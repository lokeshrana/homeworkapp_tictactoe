import withAuth from "graphql-auth";
import { withFilter } from "graphql-subscriptions";

const BOARD_SUBSCRIPTION = "board_subscription";

function winner(x: number[][]) {
  console.log(`${x[0].join(" ")}\n${x[1].join(" ")}\n${x[2].join(" ")}`);

  let winners = new Set();

  // columns check
  for (let i = 0; i < 3; i++) {
    if (x[0][i] !== null && new Set([x[0][i], x[1][i], x[2][i]]).size === 1) {
      winners.add(x[0][i]);
    }
  }

  // rows check
  for (let i = 0; i < 3; i++) {
    if (x[i][0] !== null && new Set(x[i]).size === 1) {
      winners.add(x[i][0]);
    }
  }

  // diagonals check
  if (
    x[1][1] !== null &&
    (new Set([x[0][0], x[1][1], x[2][2]]).size === 1 ||
      new Set([x[0][2], x[1][1], x[2][0]]).size === 1)
  ) {
    winners.add(x[1][1]);
  }

  if (winners.size === 2) {
    return "error";
  }

  if (winners.size === 0) {
    // completion check
    if (x.every((y) => y.every((z) => z))) {
      return "draw";
    }

    return "incomplete";
  }

  return winners.values().next().value;
}

function generateUserIdMatrixFromMoves(moves: any) {
  let matrix: any = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  moves.forEach((move: any) => {
    matrix[move.positionY][move.positionX] = move.userId;
  });
  return matrix;
}

export default (pubsub: any) => ({
  Query: {
    async boards(
      obj: any,
      { filter, limit, after, orderBy }: any,
      context: any
    ) {
      const identity = context.req.identity;
      if (identity.id !== filter.userId && identity.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const boardOutput = await context.Board.boards(limit, after, orderBy, {
        userId: identity.id,
      });
      const { boardItems, total } = boardOutput;
      console.log("🚀 ~ file: resolvers.ts ~ line 78 ~ boardItems", boardItems);
      const hasNextPage = total > after + limit;

      const edgesArray = [];
      boardItems &&
        boardItems.map((boardItem, index) => {
          edgesArray.push({
            cursor: after + index,
            node: boardItem,
          });
        });
      const endCursor =
        edgesArray.length > 0 ? edgesArray[edgesArray.length - 1].cursor : 0;
      return {
        totalCount: total,
        edges: edgesArray,
        pageInfo: {
          endCursor,
          hasNextPage,
        },
      };
    },
    async boardsByAll(
      obj: any,
      { filter, limit, after, orderBy }: any,
      context: any
    ) {
      const boardOutput = await context.Board.boards(
        limit,
        after,
        orderBy,
        filter
      );
      const { boardItems, total } = boardOutput;
      const hasNextPage = total > after + limit;

      const edgesArray = [];
      boardItems &&
        boardItems.map((boardItem, index) => {
          edgesArray.push({
            cursor: after + index,
            node: boardItem,
          });
        });
      const endCursor =
        edgesArray.length > 0 ? edgesArray[edgesArray.length - 1].cursor : 0;
      return {
        totalCount: total,
        edges: edgesArray,
        pageInfo: {
          endCursor,
          hasNextPage,
        },
      };
    },
    async board(obj: any, { id }: any, { Board }: any) {
      const board = await Board.board(id);
      return board;
    },
  },
  Mutation: {
    addBoard: withAuth(async (obj: any, { input }: any, context: any) => {
      try {
        const { creatorId, inviteeEmail } = input;
        const identity = context.req.identity;
        if (identity.id !== creatorId && identity.role !== "admin") {
          throw Error("You are not authorized to add a board");
        }
        const userByEmail = await context.User.getUserByEmail(inviteeEmail);
        if (!userByEmail) {
          throw Error("No user exists with this email");
        }
        const existingBoards = await context.Board.getBoardsByBothUserIds(
          creatorId,
          userByEmail.id
        );
        console.log(
          "🚀 ~ file: resolvers.ts ~ line 151 ~ addBoard:withAuth ~ existingBoards",
          existingBoards
        );
        let contineousBoardExists = false;
        existingBoards.forEach((board: any) => {
          if (!board.winnerId) {
            contineousBoardExists = true;
          }
        });
        if (contineousBoardExists) {
          throw Error("Board already exists for these users");
        }
        const createdBoard = await context.Board.addBoardByBothUserIds({
          userId1: identity.id,
          userId2: userByEmail.id,
        });
        const board = await context.Board.board(createdBoard.id);
        // publish for board
        pubsub.publish(BOARD_SUBSCRIPTION, {
          boardUpdated: {
            mutation: "CREATED",
            node: board,
          },
        });
        return board;
      } catch (e) {
        return e;
      }
    }),
    makeMove: withAuth(async (obj: any, { input }: any, context: any) => {
      const { boardId, positionX, positionY } = input;
      const identity = context.req.identity;
      const board = await context.Board.board(boardId);
      console.log(
        "🚀 ~ file: resolvers.ts ~ line 176 ~ makeMove:withAuth ~ board",
        identity,
        board
      );
      if (board.winnerId) {
        throw Error("Game is already over");
      }
      if (board.user1Id !== identity.id && board.user2Id !== identity.id) {
        throw Error("You are not authorized to make a move");
      }
      const checkIfMoveAlreadyExists = board?.moves.find(
        (move: any) =>
          move.positionX === positionX && move.positionY === positionY
      );
      if (checkIfMoveAlreadyExists) {
        throw Error("Move already exists");
      }
      const isCurrentUser1 = board.user1Id === identity.id;
      let isCurrentUserTurn: boolean = false;
      if (isCurrentUser1) {
        isCurrentUserTurn = board?.moves?.length % 2 === 0;
      } else {
        isCurrentUserTurn = board?.moves?.length % 2 !== 0;
      }
      if (!isCurrentUserTurn) {
        throw Error("Not your turn");
      }
      const moveMatrix = generateUserIdMatrixFromMoves(board?.moves);
      const gameWinner = winner(moveMatrix);
      if (gameWinner === "error") {
        throw Error("Error occured");
      } else if (gameWinner === "draw") {
        throw Error("Game is a draw");
      } else if (gameWinner === board.user1Id || gameWinner === board.user2Id) {
        throw Error("Game is over");
      }
      const moveRes = await context.Board.addMove({
        boardId,
        positionX,
        positionY,
        userId: identity.id,
      });
      const updatedBoard = await context.Board.board(boardId);
      const updatedGameMatrix = generateUserIdMatrixFromMoves(
        updatedBoard?.moves
      );
      const updatedGameWinner = winner(updatedGameMatrix);
      if (
        updatedGameWinner === board.user1Id ||
        updatedGameWinner === board.user2Id
      ) {
        await context.Board.updateWinnerId(boardId, updatedGameWinner);
      }
      const doubleUpdatedBoard = await context.Board.board(boardId);
      // publish for board
      pubsub.publish(BOARD_SUBSCRIPTION, {
        boardUpdated: {
          mutation: "UPDATED",
          node: doubleUpdatedBoard,
        },
      });
      return doubleUpdatedBoard;
      // try {
      // } catch (e) {
      //   return e;
      // }
    }),
    // editBoard: withAuth(async (obj: any, { input }: any, context: any) => {
    //   try {
    //     await context.Board.editBoard(input);
    //     const board = await context.Board.board(input.id);
    //     // publish for edit board page
    //     pubsub.publish(BOARD_SUBSCRIPTION, {
    //       boardUpdated: {
    //         mutation: "UPDATED",
    //         node: board,
    //       },
    //     });
    //     return board;
    //   } catch (e) {
    //     return e;
    //   }
    // }),
    deleteBoard: withAuth(async (obj: any, { id }: any, context: any) => {
      try {
        const board = await context.Board.board(id);
        const isDeleted = await context.Board.deleteBoard(id);
        if (isDeleted) {
          // publish for edit board page
          pubsub.publish(BOARD_SUBSCRIPTION, {
            boardUpdated: {
              mutation: "DELETED",
              node: board,
            },
          });
          return board;
        } else {
          return null;
        }
      } catch (e) {
        throw Error("Deleting Board Failed");
      }
    }),
  },
  Subscription: {
    boardUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(BOARD_SUBSCRIPTION),
        (payload, variables) => {
          const { mutation, node } = payload.boardUpdated;
          const { id } = variables;
          const checkByFilter = Number(id) === Number(node.id);
          switch (mutation) {
            case "DELETED":
              return true;
            case "CREATED":
              return checkByFilter;
            case "UPDATED":
              return checkByFilter;
          }
        }
      ),
    },
  },
});
