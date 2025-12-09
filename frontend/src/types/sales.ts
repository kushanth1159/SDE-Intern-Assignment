export interface SalesRecord {
  id: string;
  customer_id: string;
  customer_name: string;
  phone_number: string;
  gender: string | null;
  age: number | null;
  customer_region: string | null;
  customer_type: string | null;
  product_id: string;
  product_name: string;
  brand: string | null;
  product_category: string | null;
  tags: string | null;
  quantity: number;
  price_per_unit: number;
  discount_percentage: number;
  total_amount: number;
  final_amount: number;
  date: string;
  payment_method: string | null;
  order_status: string | null;
  delivery_type: string | null;
  store_id: string | null;
  store_location: string | null;
  salesperson_id: string | null;
  employee_name: string | null;
  created_at: string;
}

export interface FilterOptions {
  customerRegions: string[];
  genders: string[];
  ageRange: { min: number; max: number } | null;
  productCategories: string[];
  tags: string[];
  paymentMethods: string[];
  dateRange: { start: string; end: string } | null;
}

export interface SortOption {
  field: 'date' | 'quantity' | 'customer_name';
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}
