module.exports = {
  development: {
    client: 'sqlite3',
    connection: { filename: './database/trip-split.db3' },
    useNullAsDefault: true,
    migrations: {
      directory: './database/migrations',
    },
    seeds: { directory: './database/seeds' },
  },
  testing: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    migrations: {
      directory: './database/migrations',
    },
    seeds: { directory: './database/seeds/testing' },
  },
};
