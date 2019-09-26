import db from '../database/db-config';

export default async (): Promise<void> => {
  await db.migrate.rollback();
  await db.migrate.latest();
  await db.seed.run();
};
