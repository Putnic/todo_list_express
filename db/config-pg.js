const {Pool, Client} = require('pg');

// const connectionString = 'postgresql://postgres:@127.0.0.1:5432/todo_list_express';
// const pool = new Pool({connectionString}, console.log('Connecting on port: 5432'));

const config_local = {
  user: 'postgres',
  host: 'localhost',
  database: 'todo_list_express',
  password: '',
  port: 5432,
};
const configHeroku = {
  connectionString: process.env.DATABASE_URL,
  ssl: true
};

const config = process.env.DATABASE_URL ? configHeroku : config_local;

if (module.parent) {
  const pool = new Pool(config, console.log('Connecting on port: 5432'));

  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

  module.exports = pool;
  
} else {
  const client = new Client(config);
  client.connect(console.log('Connecting on port: 5432'));

  client.query('SELECT $1::text as message', ['Hello world!'])
    .then (res => {
    console.log(res.rows[0].message);
    })
    .catch(err => console.log(err.stack));
    // client.end();
  
  client.query('SELECT $1::varchar AS my_first_query', ['todo list express'], function (err, result) {
    if (err) {
      return console.error('error happened during query', err);
    }
    console.log(result.rows[0].my_first_query);
    // client.end();
  });

  let sql_func = "CREATE OR REPLACE FUNCTION trigger_set_timestamp()\
    RETURNS TRIGGER AS $$\
    BEGIN\
      NEW.updated_at = NOW();\
      RETURN NEW;\
    END;\
    $$ LANGUAGE plpgsql";

  // select '2014-04-04 20:00:00'::timestamp at time zone 'America/Los_Angeles';
  let sql_table = "CREATE TABLE IF NOT EXISTS todos\
    (id SERIAL NOT NULL PRIMARY KEY,\
    name VARCHAR(255) NOT NULL,\
    description TEXT,\
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,\
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\
    completed BOOL DEFAULT false)";

  let sql_trigger = "CREATE TRIGGER set_timestamp\
    BEFORE UPDATE ON todos\
    FOR EACH ROW\
    EXECUTE PROCEDURE trigger_set_timestamp()";

  client.query(sql_trigger)
  .then(res => {
    console.log(res.rows[0]);
    client.end();
  })
  .catch(e => console.error(e.stack));

}