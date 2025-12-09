/*
  # Create Sales Management System Database

  ## Overview
  This migration creates the core sales table for the Retail Sales Management System.
  The table stores comprehensive transaction data including customer information, product details,
  sales metrics, and operational data.

  ## New Tables
  
  ### `sales`
  Main transaction table with the following structure:
  
  **Customer Fields:**
  - `customer_id` (text) - Unique identifier for the customer
  - `customer_name` (text) - Full name of the customer
  - `phone_number` (text) - Contact number
  - `gender` (text) - Customer gender
  - `age` (integer) - Customer age
  - `customer_region` (text) - Geographic region of customer
  - `customer_type` (text) - Type/category of customer
  
  **Product Fields:**
  - `product_id` (text) - Unique product identifier
  - `product_name` (text) - Name of the product
  - `brand` (text) - Product brand
  - `product_category` (text) - Product category
  - `tags` (text) - Product tags for classification
  
  **Sales Fields:**
  - `quantity` (integer) - Number of units sold
  - `price_per_unit` (decimal) - Unit price
  - `discount_percentage` (decimal) - Discount applied
  - `total_amount` (decimal) - Amount before discount
  - `final_amount` (decimal) - Amount after discount
  
  **Operational Fields:**
  - `date` (date) - Transaction date
  - `payment_method` (text) - Method of payment
  - `order_status` (text) - Current order status
  - `delivery_type` (text) - Type of delivery
  - `store_id` (text) - Store identifier
  - `store_location` (text) - Store location
  - `salesperson_id` (text) - Salesperson identifier
  - `employee_name` (text) - Name of employee who processed the sale
  
  **System Fields:**
  - `id` (uuid) - Primary key
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on `sales` table
  - Add policy for public read access (for demo purposes)
  - In production, this should be restricted to authenticated users

  ## Indexes
  - Create indexes on frequently queried fields for optimal search and filter performance
  - Index on customer_name and phone_number for search functionality
  - Index on date for sorting and date range filters
  - Index on filter fields for efficient filtering
*/

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Customer fields
  customer_id text NOT NULL,
  customer_name text NOT NULL,
  phone_number text NOT NULL,
  gender text,
  age integer,
  customer_region text,
  customer_type text,
  
  -- Product fields
  product_id text NOT NULL,
  product_name text NOT NULL,
  brand text,
  product_category text,
  tags text,
  
  -- Sales fields
  quantity integer NOT NULL DEFAULT 1,
  price_per_unit decimal(10, 2) NOT NULL,
  discount_percentage decimal(5, 2) DEFAULT 0,
  total_amount decimal(10, 2) NOT NULL,
  final_amount decimal(10, 2) NOT NULL,
  
  -- Operational fields
  date date NOT NULL DEFAULT CURRENT_DATE,
  payment_method text,
  order_status text,
  delivery_type text,
  store_id text,
  store_location text,
  salesperson_id text,
  employee_name text,
  
  -- System fields
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sales_customer_name ON sales(customer_name);
CREATE INDEX IF NOT EXISTS idx_sales_phone_number ON sales(phone_number);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date DESC);
CREATE INDEX IF NOT EXISTS idx_sales_customer_region ON sales(customer_region);
CREATE INDEX IF NOT EXISTS idx_sales_gender ON sales(gender);
CREATE INDEX IF NOT EXISTS idx_sales_age ON sales(age);
CREATE INDEX IF NOT EXISTS idx_sales_product_category ON sales(product_category);
CREATE INDEX IF NOT EXISTS idx_sales_payment_method ON sales(payment_method);
CREATE INDEX IF NOT EXISTS idx_sales_quantity ON sales(quantity);

-- Enable Row Level Security
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (for demo purposes)
CREATE POLICY "Allow public read access to sales"
  ON sales
  FOR SELECT
  TO public
  USING (true);

-- Create policy for public insert access (for CSV import)
CREATE POLICY "Allow public insert access to sales"
  ON sales
  FOR INSERT
  TO public
  WITH CHECK (true);