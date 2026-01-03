/**
 * Environment variable validation
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'AUTH_SECRET',
  'AUTH_GITHUB_ID',
  'AUTH_GITHUB_SECRET',
  'AUTH_GOOGLE_ID',
  'AUTH_GOOGLE_SECRET',
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter(
    (envVar) => !process.env[envVar] || process.env[envVar]?.trim() === ''
  );

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Validate on module load
if (typeof window === 'undefined') {
  // Server-side only
  validateEnv();
}

export const getEnv = () => ({
  DATABASE_URL: process.env.DATABASE_URL!,
  AUTH_SECRET: process.env.AUTH_SECRET!,
  AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID!,
  AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET!,
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID!,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET!,
  NODE_ENV: process.env.NODE_ENV || 'development',
});

export default getEnv;
