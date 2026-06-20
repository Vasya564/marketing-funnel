import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

function isAuthorized(request: NextRequest): boolean {
  const header = request.headers.get('authorization');

  if (!header?.startsWith('Basic ')) {
    return false;
  }

  const decoded = atob(header.slice('Basic '.length));
  const separator = decoded.indexOf(':');
  const user = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);

  return user === env.dashboardUser && password === env.dashboardPass;
}

export function proxy(request: NextRequest) {
  if (isAuthorized(request)) {
    return NextResponse.next();
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Dashboard"' },
  });
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/dashboard/:path*'],
};
