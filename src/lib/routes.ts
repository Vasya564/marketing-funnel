export const ROUTES = {
  quiz: '/',
  email: '/email',
  paywall: '/paywall',
  dashboard: '/dashboard',
} as const;

export const API_ROUTES = {
  track: '/api/track',
  funnelEmail: '/api/funnel/email',
  funnelStatus: '/api/funnel/status',
} as const;

export const FUNNEL_STEPS = [
  { label: 'Goal', route: ROUTES.quiz },
  { label: 'Email', route: ROUTES.email },
  { label: 'Plan', route: ROUTES.paywall },
] as const;
