'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return  db.createTable('orders',{
    order_id:{ type: 'int', primaryKey:true, autoIncrement:true, unsigned: true},
    id: { type: 'string'},
    order_details: { type: 'string', notNull:false},
    total_amount: {type:'int', notNull:false},
    order_status: { type: 'string'}
})
};
exports.down = function(db) {
  return db.dropTable('orders');
};


exports._meta = {
  "version": 1
};
