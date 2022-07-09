import { knex } from '@gqlapp/database-server-ts';

export default class Board {
  public boards() {
    return knex.select();
  }
}
