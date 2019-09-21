export default {
  jwtSecret: process.env.JWT_SECRET || 'elementary my dear watson',
  admin: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASS || 'admin',
};
