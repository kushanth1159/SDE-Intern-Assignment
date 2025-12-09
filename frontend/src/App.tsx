import { useState, useEffect, useCallback } from 'react';
import { Database } from 'lucide-react';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import TransactionTable from './components/TransactionTable';
import SortingDropdown from './components/SortingDropdown';
import PaginationControls from './components/PaginationControls';
import CSVUpload from './components/CSVUpload';
import { fetchSales, getFilterOptions } from './services/salesService';
import type { SalesRecord, FilterOptions, SortOption, PaginationState } from './types/sales';

function App() {
  const [salesData, setSalesData] = useState<SalesRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Partial<FilterOptions>>({});
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'date', direction: 'desc' });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [availableFilterOptions, setAvailableFilterOptions] = useState<{
    customerRegions: string[];
    genders: string[];
    productCategories: string[];
    tags: string[];
    paymentMethods: string[];
  }>({
    customerRegions: [],
    genders: [],
    productCategories: [],
    tags: [],
    paymentMethods: [],
  });
  const [showUpload, setShowUpload] = useState(false);
  const [hasData, setHasData] = useState(false);

  const loadFilterOptions = useCallback(async () => {
    try {
      const options = await getFilterOptions();
      setAvailableFilterOptions(options);
      setHasData(options.customerRegions.length > 0);
    } catch (error) {
      console.error('Failed to load filter options:', error);
    }
  }, []);

  const loadSalesData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchSales({
        search: searchTerm,
        filters,
        sort: sortOption,
        page: pagination.page,
        pageSize: pagination.pageSize,
      });

      setSalesData(result.data);
      setPagination({
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
      });
    } catch (error) {
      console.error('Failed to fetch sales:', error);
      setSalesData([]);
      setPagination({ page: 1, pageSize: 10, total: 0 });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters, sortOption, pagination.page, pagination.pageSize]);

  useEffect(() => {
    loadFilterOptions();
  }, [loadFilterOptions]);

  useEffect(() => {
    if (hasData) {
      loadSalesData();
    }
  }, [hasData, loadSalesData]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortOption(newSort);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleImportComplete = () => {
    setShowUpload(false);
    loadFilterOptions();
  };

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <Database className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Retail Sales Management System
            </h1>
            <p className="text-gray-600">
              Upload your CSV dataset to get started
            </p>
          </div>
          <CSVUpload onImportComplete={handleImportComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Retail Sales Management
                </h1>
                <p className="text-sm text-gray-600">
                  Search, filter, and analyze sales transactions
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Import Data
            </button>
          </div>
        </div>
      </header>

      {showUpload && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <CSVUpload onImportComplete={handleImportComplete} />
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-64 flex-shrink-0">
              <FilterPanel
                filters={filters}
                onChange={handleFilterChange}
                availableOptions={availableFilterOptions}
              />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <SearchBar value={searchTerm} onChange={handleSearchChange} />
                </div>
                <div>
                  <SortingDropdown value={sortOption} onChange={handleSortChange} />
                </div>
              </div>

              <TransactionTable data={salesData} loading={loading} />

              {!loading && salesData.length > 0 && (
                <PaginationControls
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
