const JWT_SECRET = process.env.JWT_SECRET || 'elementary my dear watson';

const ADMIN = process.env.ADMIN_USERNAME || 'admin';

const ADMIN_PASS = process.env.ADMIN_PASS || 'admin';

export default {
  JWT_SECRET,
  ADMIN,
  ADMIN_PASS,
};
