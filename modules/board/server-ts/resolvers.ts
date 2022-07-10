import withAuth from "graphql-auth";
import { withFilter } from "graphql-subscriptions";

const BOARD_SUBSCRIPTION = "board_subscription";

export default (pubsub: any) => ({
  Query: {
    async boardsByUser(
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
    async boards(
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
        const checkIfBoardExistsForUsers =
          await context.Board.getBoardByBothUserIds(creatorId, userByEmail.id);
        if (checkIfBoardExistsForUsers) {
          throw Error("Board already exists for these users");
        }
        const createdBoard = await context.Board.addBoardByBothUserIds({
          userId1: identity.id,
          userId2: userByEmail.id,
        });
        const board = await context.Board.board(createdBoard.id);
        // publish for boards list
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
    // makeMove: withAuth(async (obj: any, { input }: any, context: any) => {
    //   try {
    //     const { boardId, move } = input;
    //     const identity = context.req.identity;
    //     const board = await context.Board.board(boardId);
    //     if (
    //       board.user_1_id !== identity.id &&
    //       board.user_2_id !== identity.id
    //     ) {
    //       throw Error("You are not authorized to make a move");
    //     }
    //     const moveRes = await context.Board.makeMove(input);
    //     // publish for boards list
    //     pubsub.publish(BOARD_SUBSCRIPTION, {
    //       boardUpdated: {
    //         mutation: "UPDATED",
    //         node: moveRes,
    //       },
    //     });
    //     return moveRes;
    //   } catch (e) {
    //     return e;
    //   }
    // }),
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
          const {
            filter: { userId },
          } = variables;
          const checkByFilter =
            !userId || userId === node.user_1_id || userId === node.user_2_id;
          switch (mutation) {
            case "DELETED":
              return true;
            case "CREATED":
              return checkByFilter;
            case "UPDATED":
              return !checkByFilter;
          }
        }
      ),
    },
  },
});
