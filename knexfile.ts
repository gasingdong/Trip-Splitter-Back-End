module.exports = {
  development: {
    client: 'sqlite3',
    connection: { filename: './database/trip-split.db3' },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn: { run: Function }, done: Function): void => {
        conn.run('PRAGMA foreign_keys = ON', done);
      },
    },
    migrations: {
      directory: './database/migrations',
    },
    seeds: { directory: './database/seeds' },
  },
  testing: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn: { run: Function }, done: Function): void => {
        conn.run('PRAGMA foreign_keys = ON', done);
      },
    },
    migrations: {
      directory: './database/migrations',
    },
    seeds: { directory: './database/seeds/testing' },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './database/migrations',
    },
    seeds: { directory: './database/seeds' },
  },
};
