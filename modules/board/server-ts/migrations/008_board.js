exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('board', (table) => {
      table.increments();
      table.integer('user_1_id').unsigned();
      table.integer('user_2_id').unsigned();
      table.integer('winner_id').unsigned();
      table.timestamps(false, true);
    }),
    knex.schema.createTable('move', (table) => {
      table.increments();
      table.integer('board_id').unsigned().references('id').inTable('board').onDelete('CASCADE');
      table.integer('user_id').unsigned();
      table.integer('position_x');
      table.integer('position_y');
      table.timestamps(false, true);
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([knex.schema.dropTable('move'), knex.schema.dropTable('board')]);
};
