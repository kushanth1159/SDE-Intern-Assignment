import { supabase } from '../lib/supabase';
import type { SalesRecord, FilterOptions, SortOption } from '../types/sales';

export interface FetchSalesParams {
  search?: string;
  filters?: Partial<FilterOptions>;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface FetchSalesResult {
  data: SalesRecord[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchSales(params: FetchSalesParams = {}): Promise<FetchSalesResult> {
  const {
    search = '',
    filters = {},
    sort = { field: 'date', direction: 'desc' },
    page = 1,
    pageSize = 10,
  } = params;

  let query = supabase.from('sales').select('*', { count: 'exact' });

  if (search.trim()) {
    const searchTerm = search.trim();
    query = query.or(`customer_name.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%`);
  }

  if (filters.customerRegions && filters.customerRegions.length > 0) {
    query = query.in('customer_region', filters.customerRegions);
  }

  if (filters.genders && filters.genders.length > 0) {
    query = query.in('gender', filters.genders);
  }

  if (filters.ageRange) {
    if (filters.ageRange.min !== undefined) {
      query = query.gte('age', filters.ageRange.min);
    }
    if (filters.ageRange.max !== undefined) {
      query = query.lte('age', filters.ageRange.max);
    }
  }

  if (filters.productCategories && filters.productCategories.length > 0) {
    query = query.in('product_category', filters.productCategories);
  }

  if (filters.tags && filters.tags.length > 0) {
    query = query.in('tags', filters.tags);
  }

  if (filters.paymentMethods && filters.paymentMethods.length > 0) {
    query = query.in('payment_method', filters.paymentMethods);
  }

  if (filters.dateRange) {
    if (filters.dateRange.start) {
      query = query.gte('date', filters.dateRange.start);
    }
    if (filters.dateRange.end) {
      query = query.lte('date', filters.dateRange.end);
    }
  }

  query = query.order(sort.field, { ascending: sort.direction === 'asc' });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch sales: ${error.message}`);
  }

  return {
    data: data || [],
    total: count || 0,
    page,
    pageSize,
  };
}

export async function getFilterOptions(): Promise<{
  customerRegions: string[];
  genders: string[];
  productCategories: string[];
  tags: string[];
  paymentMethods: string[];
}> {
  const [regionsRes, gendersRes, categoriesRes, tagsRes, paymentsRes] = await Promise.all([
    supabase.from('sales').select('customer_region').not('customer_region', 'is', null),
    supabase.from('sales').select('gender').not('gender', 'is', null),
    supabase.from('sales').select('product_category').not('product_category', 'is', null),
    supabase.from('sales').select('tags').not('tags', 'is', null),
    supabase.from('sales').select('payment_method').not('payment_method', 'is', null),
  ]);

  const uniqueRegions = [...new Set(regionsRes.data?.map((r) => r.customer_region) || [])];
  const uniqueGenders = [...new Set(gendersRes.data?.map((g) => g.gender) || [])];
  const uniqueCategories = [...new Set(categoriesRes.data?.map((c) => c.product_category) || [])];
  const uniqueTags = [...new Set(tagsRes.data?.map((t) => t.tags) || [])];
  const uniquePayments = [...new Set(paymentsRes.data?.map((p) => p.payment_method) || [])];

  return {
    customerRegions: uniqueRegions.sort(),
    genders: uniqueGenders.sort(),
    productCategories: uniqueCategories.sort(),
    tags: uniqueTags.sort(),
    paymentMethods: uniquePayments.sort(),
  };
}

export async function importSalesData(records: Partial<SalesRecord>[]): Promise<void> {
  const { error } = await supabase.from('sales').insert(records);

  if (error) {
    throw new Error(`Failed to import sales data: ${error.message}`);
  }
}
