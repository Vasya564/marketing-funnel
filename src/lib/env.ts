function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  get databaseUrl() {
    return required('DATABASE_URL');
  },
  get jwtSecret() {
    return required('JWT_SECRET');
  },
  get dashboardUser() {
    return required('DASHBOARD_USER');
  },
  get dashboardPass() {
    return required('DASHBOARD_PASS');
  },
};
