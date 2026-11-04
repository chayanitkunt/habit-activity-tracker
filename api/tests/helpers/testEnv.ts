process.env.APP_ENV = 'test';
process.env.SESSION_SECRET = 'test-session-secret-not-for-production';
process.env.TEST_DATABASE_URL ??= 'postgresql://habit:habit@localhost:5433/habit_tracker_test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
process.env.SESSION_MAX_AGE_HOURS = '8';
process.env.APP_TIMEZONE = 'Asia/Bangkok';
process.env.SEED_DEMO_PASSWORD = 'test-demo-password-not-for-production';
