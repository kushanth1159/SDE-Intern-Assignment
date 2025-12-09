import type { SalesRecord } from '../types/sales';

export function parseCSV(csvText: string): Partial<SalesRecord>[] {
  const lines = csvText.split('\n').filter(line => line.trim());

  if (lines.length === 0) {
    return [];
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const records: Partial<SalesRecord>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);

    if (values.length !== headers.length) {
      continue;
    }

    const record: any = {};

    headers.forEach((header, index) => {
      const value = values[index];
      const fieldName = mapHeaderToField(header);

      if (fieldName) {
        record[fieldName] = parseValue(fieldName, value);
      }
    });

    if (record.customer_id && record.product_id) {
      records.push(record);
    }
  }

  return records;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

function mapHeaderToField(header: string): string | null {
  const mapping: Record<string, string> = {
    'Customer ID': 'customer_id',
    'Customer Name': 'customer_name',
    'Phone Number': 'phone_number',
    'Gender': 'gender',
    'Age': 'age',
    'Customer Region': 'customer_region',
    'Customer Type': 'customer_type',
    'Product ID': 'product_id',
    'Product Name': 'product_name',
    'Brand': 'brand',
    'Product Category': 'product_category',
    'Tags': 'tags',
    'Quantity': 'quantity',
    'Price per Unit': 'price_per_unit',
    'Discount Percentage': 'discount_percentage',
    'Total Amount': 'total_amount',
    'Final Amount': 'final_amount',
    'Date': 'date',
    'Payment Method': 'payment_method',
    'Order Status': 'order_status',
    'Delivery Type': 'delivery_type',
    'Store ID': 'store_id',
    'Store Location': 'store_location',
    'Salesperson ID': 'salesperson_id',
    'Employee Name': 'employee_name',
  };

  return mapping[header] || null;
}

function parseValue(field: string, value: string): any {
  const cleanValue = value.replace(/^"|"$/g, '').trim();

  if (!cleanValue) {
    return null;
  }

  if (field === 'age' || field === 'quantity') {
    return parseInt(cleanValue, 10) || 0;
  }

  if (
    field === 'price_per_unit' ||
    field === 'discount_percentage' ||
    field === 'total_amount' ||
    field === 'final_amount'
  ) {
    return parseFloat(cleanValue) || 0;
  }

  if (field === 'date') {
    return cleanValue;
  }

  return cleanValue;
}
