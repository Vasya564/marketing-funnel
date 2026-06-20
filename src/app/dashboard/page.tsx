import {
  getDashboardData,
  getSourceOptions,
} from '@/server/repositories/analyticsRepository';
import { DashboardView } from '@/components/dashboard';
import { parseFilters, resolveFilters } from '@/lib/filters';

export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);

  const [data, sourceOptions] = await Promise.all([
    getDashboardData(resolveFilters(filters)),
    getSourceOptions(),
  ]);

  return (
    <DashboardView
      data={data}
      filters={filters}
      sourceOptions={sourceOptions}
    />
  );
}
