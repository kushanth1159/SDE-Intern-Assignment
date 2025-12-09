import { ArrowUpDown } from 'lucide-react';
import type { SortOption } from '../types/sales';

interface SortingDropdownProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

export default function SortingDropdown({ value, onChange }: SortingDropdownProps) {
  const sortOptions = [
    { label: 'Date (Newest First)', field: 'date' as const, direction: 'desc' as const },
    { label: 'Date (Oldest First)', field: 'date' as const, direction: 'asc' as const },
    { label: 'Quantity (High to Low)', field: 'quantity' as const, direction: 'desc' as const },
    { label: 'Quantity (Low to High)', field: 'quantity' as const, direction: 'asc' as const },
    { label: 'Customer Name (A-Z)', field: 'customer_name' as const, direction: 'asc' as const },
    { label: 'Customer Name (Z-A)', field: 'customer_name' as const, direction: 'desc' as const },
  ];

  const currentLabel = sortOptions.find(
    opt => opt.field === value.field && opt.direction === value.direction
  )?.label || 'Sort by';

  return (
    <div className="relative">
      <select
        value={JSON.stringify(value)}
        onChange={(e) => onChange(JSON.parse(e.target.value))}
        className="appearance-none w-full sm:w-auto pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
      >
        {sortOptions.map((option) => (
          <option
            key={`${option.field}-${option.direction}`}
            value={JSON.stringify({ field: option.field, direction: option.direction })}
          >
            {option.label}
          </option>
        ))}
      </select>
      <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
    </div>
  );
}
