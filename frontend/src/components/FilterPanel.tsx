import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import type { FilterOptions } from '../types/sales';

interface FilterPanelProps {
  filters: Partial<FilterOptions>;
  onChange: (filters: Partial<FilterOptions>) => void;
  availableOptions: {
    customerRegions: string[];
    genders: string[];
    productCategories: string[];
    tags: string[];
    paymentMethods: string[];
  };
}

export default function FilterPanel({ filters, onChange, availableOptions }: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    region: false,
    gender: false,
    age: false,
    category: false,
    tags: false,
    payment: false,
    date: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleArrayFilter = (key: keyof FilterOptions, value: string) => {
    const currentValues = (filters[key] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    onChange({ ...filters, [key]: newValues.length > 0 ? newValues : undefined });
  };

  const updateAgeRange = (min?: number, max?: number) => {
    if (min === undefined && max === undefined) {
      onChange({ ...filters, ageRange: undefined });
    } else {
      onChange({
        ...filters,
        ageRange: {
          min: min || filters.ageRange?.min || 0,
          max: max || filters.ageRange?.max || 100,
        },
      });
    }
  };

  const updateDateRange = (start?: string, end?: string) => {
    if (!start && !end) {
      onChange({ ...filters, dateRange: undefined });
    } else {
      onChange({
        ...filters,
        dateRange: {
          start: start || filters.dateRange?.start || '',
          end: end || filters.dateRange?.end || '',
        },
      });
    }
  };

  const clearAllFilters = () => {
    onChange({});
  };

  const activeFilterCount = [
    filters.customerRegions?.length || 0,
    filters.genders?.length || 0,
    filters.ageRange ? 1 : 0,
    filters.productCategories?.length || 0,
    filters.tags?.length || 0,
    filters.paymentMethods?.length || 0,
    filters.dateRange ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear All ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="space-y-3">
        <FilterSection
          title="Customer Region"
          isExpanded={expandedSections.region}
          onToggle={() => toggleSection('region')}
          activeCount={filters.customerRegions?.length || 0}
        >
          <div className="space-y-2">
            {availableOptions.customerRegions.map(region => (
              <label key={region} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.customerRegions?.includes(region) || false}
                  onChange={() => toggleArrayFilter('customerRegions', region)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{region}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Gender"
          isExpanded={expandedSections.gender}
          onToggle={() => toggleSection('gender')}
          activeCount={filters.genders?.length || 0}
        >
          <div className="space-y-2">
            {availableOptions.genders.map(gender => (
              <label key={gender} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.genders?.includes(gender) || false}
                  onChange={() => toggleArrayFilter('genders', gender)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{gender}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Age Range"
          isExpanded={expandedSections.age}
          onToggle={() => toggleSection('age')}
          activeCount={filters.ageRange ? 1 : 0}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Min Age</label>
              <input
                type="number"
                value={filters.ageRange?.min || ''}
                onChange={(e) => updateAgeRange(parseInt(e.target.value) || undefined, filters.ageRange?.max)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max Age</label>
              <input
                type="number"
                value={filters.ageRange?.max || ''}
                onChange={(e) => updateAgeRange(filters.ageRange?.min, parseInt(e.target.value) || undefined)}
                placeholder="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </FilterSection>

        <FilterSection
          title="Product Category"
          isExpanded={expandedSections.category}
          onToggle={() => toggleSection('category')}
          activeCount={filters.productCategories?.length || 0}
        >
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableOptions.productCategories.map(category => (
              <label key={category} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.productCategories?.includes(category) || false}
                  onChange={() => toggleArrayFilter('productCategories', category)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Tags"
          isExpanded={expandedSections.tags}
          onToggle={() => toggleSection('tags')}
          activeCount={filters.tags?.length || 0}
        >
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableOptions.tags.map(tag => (
              <label key={tag} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.tags?.includes(tag) || false}
                  onChange={() => toggleArrayFilter('tags', tag)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{tag}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Payment Method"
          isExpanded={expandedSections.payment}
          onToggle={() => toggleSection('payment')}
          activeCount={filters.paymentMethods?.length || 0}
        >
          <div className="space-y-2">
            {availableOptions.paymentMethods.map(method => (
              <label key={method} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.paymentMethods?.includes(method) || false}
                  onChange={() => toggleArrayFilter('paymentMethods', method)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{method}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Date Range"
          isExpanded={expandedSections.date}
          onToggle={() => toggleSection('date')}
          activeCount={filters.dateRange ? 1 : 0}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.dateRange?.start || ''}
                onChange={(e) => updateDateRange(e.target.value, filters.dateRange?.end)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                value={filters.dateRange?.end || ''}
                onChange={(e) => updateDateRange(filters.dateRange?.start, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </FilterSection>
      </div>
    </div>
  );
}

interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  activeCount: number;
  children: React.ReactNode;
}

function FilterSection({ title, isExpanded, onToggle, activeCount, children }: FilterSectionProps) {
  return (
    <div className="border-b border-gray-200 pb-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 rounded px-2"
      >
        <span className="font-medium text-gray-900 text-sm flex items-center gap-2">
          {title}
          {activeCount > 0 && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isExpanded && <div className="mt-3 px-2">{children}</div>}
    </div>
  );
}
