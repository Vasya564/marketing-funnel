export const VISITOR_COOKIE = 'visitor_id';
export const VISIT_COOKIE = 'visit_id';
export const AUTH_COOKIE = 'funnel_token';

export const VISITOR_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
export const VISIT_MAX_AGE = 60 * 60 * 24; // 1 day
export const AUTH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  };
}
