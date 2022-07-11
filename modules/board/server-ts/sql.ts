import { Model, raw } from "objection";
import { camelizeKeys, decamelizeKeys, decamelize } from "humps";
import { knex, returnId, orderedFor } from "@gqlapp/database-server-ts";
import { has } from "lodash";
//@ts-ignore
import { User } from "@gqlapp/user-server-ts/sql";

// Give the knex object to objection.
const eager = "[moves, user1.[profile], user2.[profile]]";

Model.knex(knex);

export default class Board extends Model {
  static get tableName() {
    return "board";
  }

  static get idColumn() {
    return "id";
  }

  static get relationMappings() {
    return {
      user1: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "board.user_1_id",
          to: "user.id",
        },
      },
      user2: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "board.user_2_id",
          to: "user.id",
        },
      },
      winner: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "board.winner_id",
          to: "user.id",
        },
      },
      moves: {
        relation: Model.HasManyRelation,
        modelClass: Move,
        join: {
          from: "board.id",
          to: "move.board_id",
        },
      },
    };
  }

  public async boards(limit: number, after: any, orderBy: any, filter: any) {
    const queryBuilder = Board.query()
      .withGraphFetched(eager)
      .orderBy("id", "desc");
    if (orderBy && orderBy.column) {
      const column = orderBy.column;
      let order = "asc";
      if (orderBy.order) {
        order = orderBy.order;
      }

      queryBuilder.orderBy(decamelize(column), order);
    }

    if (filter) {
      if (has(filter, "userId") && filter.userId !== "") {
        queryBuilder.where(function () {
          this.where("board.user_1_id", filter.userId).orWhere(
            "board.user_2_id",
            filter.userId
          );
        });
      }
      // if (has(filter, 'boardId') && filter.boardId !== '') {
      //   queryBuilder.where(function() {
      //     this.where('board.board_id', filter.boardId);
      //   });
      // }
      // if (has(filter, 'boardSymbol') && filter.boardSymbol !== '') {
      //   queryBuilder.where(function() {
      //     this.where('board.board_symbol', filter.boardSymbol);
      //   });
      // }
      // if (has(filter, 'boardName') && filter.boardName !== '') {
      //   queryBuilder.where(function() {
      //     this.where('board.board_name', filter.boardName);
      //   });
      // }
      // if (has(filter, 'searchText') && filter.searchText !== '') {
      //   queryBuilder
      //     .from('board')
      //     .groupBy('board.id')
      //     .where(function() {
      //       this.where(raw('LOWER(??) LIKE LOWER(?)', ['board.board_symbol', `%${filter.searchText}%`])).orWhere(
      //         raw('LOWER(??) LIKE LOWER(?)', ['board.board_name', `%${filter.searchText}%`])
      //       );
      //     });
      // }
    }
    queryBuilder.groupBy("board.id");
    const allBoardItems = camelizeKeys(await queryBuilder);

    const total = allBoardItems.length;
    let res = {};

    if (limit && after) {
      res = camelizeKeys(
        await queryBuilder.limit(limit).offset(after).groupBy("board.id")
      );
    } else if (limit && !after) {
      res = camelizeKeys(await queryBuilder.limit(limit).groupBy("board.id"));
    } else if (!limit && after) {
      res = camelizeKeys(await queryBuilder.offset(after).groupBy("board.id"));
    } else {
      res = camelizeKeys(await queryBuilder.groupBy("board.id"));
    }
    return { boardItems: res, total };
  }
  public async board(id: number) {
    let res = {};
    res = camelizeKeys(
      await Board.query()
        .findById(id)
        .withGraphFetched(eager)
        .orderBy("id", "desc")
        .first()
    );
    return res;
  }

  public async getBoardByBothUserIds(userId1: number, userId2: number) {
    const res = await Board.query()
      .where(function () {
        this.where("board.user_1_id", userId1).andWhere(
          "board.user_2_id",
          userId2
        );
      })
      .orWhere(function () {
        this.where("board.user_1_id", userId2).andWhere(
          "board.user_2_id",
          userId1
        );
      })
      .withGraphFetched(eager)
      .first();
    return res;
  }

  public async addBoard(params: any) {
    const res = await Board.query().insertGraph(decamelizeKeys(params));
    return res;
  }

  public async addMove(params: any) {
    const res = await Move.query().insert(decamelizeKeys(params));
    return res;
  }

  public async addBoardByBothUserIds(params: any) {
    const inputParams: any = {
      user_1_id: params.userId1,
      user_2_id: params.userId2,
    };
    const res = await Board.query().insert(inputParams);
    return res;
  }

  public async editBoard(params: any) {
    const res = await Board.query().upsertGraph(decamelizeKeys(params));
    return res;
  }
  public async updateWinnerId(boardId: number, winnerId: number) {
    //@ts-ignore
    const res = await Board.query()
      .update({ winner_id: winnerId })
      .where("id", boardId);
    return res;
  }

  public deleteBoard(id: number) {
    return knex("board").where("id", "=", id).del();
  }
}

export class Move extends Model {
  static get tableName() {
    return "move";
  }

  static get idColumn() {
    return "id";
  }

  static get relationMappings() {
    return {
      board: {
        relation: Model.BelongsToOneRelation,
        modelClass: Board,
        join: {
          from: "move.board_id",
          to: "board.id",
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "move.user_id",
          to: "user.id",
        },
      },
    };
  }
}
