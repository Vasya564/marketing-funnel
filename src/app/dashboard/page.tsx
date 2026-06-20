import { getDashboardData } from '@/db/analytics';
import { DashboardView } from '@/components/DashboardView';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const data = await getDashboardData();

  return <DashboardView data={data} />;
}
