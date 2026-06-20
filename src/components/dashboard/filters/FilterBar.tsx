'use client';

import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/cn';
import { DashboardFilters, DATE_RANGES } from '@/lib/filters';
import { useFilterNav } from '@/components/dashboard/hooks/useFilterNav';
import { CARD_TITLE, SELECT_OPTION } from '@/lib/dashboard/theme';
import { FilterField } from './FilterField';
import { FilterSelect } from './FilterSelect';

export function FilterBar({
  filters,
  sourceOptions,
}: {
  filters: DashboardFilters;
  sourceOptions: string[];
}) {
  const { setParam, reset } = useFilterNav();
  const hasFilters =
    filters.range !== 'all' ||
    filters.source !== null ||
    filters.audience !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className={CARD_TITLE}>Filters</p>
        <button
          type="button"
          onClick={reset}
          aria-hidden={!hasFilters}
          tabIndex={hasFilters ? 0 : -1}
          className={cn(
            'flex items-center gap-1 rounded-md border border-violet-400/30 bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-200 transition-colors hover:border-violet-400/50 hover:bg-violet-500/20',
            !hasFilters && 'pointer-events-none invisible',
          )}
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <FilterField label="Date range">
        <FilterSelect
          value={filters.range}
          onChange={(value) => setParam('range', value)}
        >
          {DATE_RANGES.map((range) => (
            <option
              key={range.value}
              value={range.value}
              className={SELECT_OPTION}
            >
              {range.label}
            </option>
          ))}
        </FilterSelect>
      </FilterField>

      <FilterField label="Source">
        <FilterSelect
          value={filters.source ?? ''}
          onChange={(value) => setParam('source', value || null)}
        >
          <option value="" className={SELECT_OPTION}>
            All sources
          </option>
          {sourceOptions.map((source) => (
            <option key={source} value={source} className={SELECT_OPTION}>
              {source}
            </option>
          ))}
        </FilterSelect>
      </FilterField>

      <FilterField label="Audience">
        <FilterSelect
          value={filters.audience ?? ''}
          onChange={(value) => setParam('audience', value || null)}
        >
          <option value="" className={SELECT_OPTION}>
            All visits
          </option>
          <option value="new" className={SELECT_OPTION}>
            New only
          </option>
          <option value="returning" className={SELECT_OPTION}>
            Returning only
          </option>
        </FilterSelect>
      </FilterField>
    </div>
  );
}
