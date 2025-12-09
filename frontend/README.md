# Retail Sales Management System

## Overview

A comprehensive sales management system built with React, TypeScript, and Supabase that enables users to search, filter, sort, and analyze retail sales transactions. The application provides an intuitive interface for managing large datasets with advanced querying capabilities and responsive pagination.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Custom components with Lucide React icons
- **State Management**: React Hooks (useState, useEffect, useCallback)

## Search Implementation Summary

The search functionality implements case-insensitive full-text search across customer names and phone numbers. Search queries are executed server-side using Supabase's query builder with the `.ilike` operator and `.or()` clause to match against multiple fields. The search maintains state alongside active filters and sorting, resetting pagination to page 1 when a new search is performed. Results update in real-time as users type, providing immediate feedback.

## Filter Implementation Summary

Multi-select filtering is implemented across seven key dimensions: Customer Region, Gender, Age Range, Product Category, Tags, Payment Method, and Date Range. Each filter operates independently and can be combined with others for complex queries. Filter state is managed in React and translated to Supabase query parameters using `.in()` for multi-select fields and `.gte()/.lte()` for range-based filters. Active filters are displayed with badges showing selection counts, and a "Clear All" button resets all filters simultaneously. The FilterPanel component features collapsible sections to maintain a clean interface while providing comprehensive filtering options.

## Sorting Implementation Summary

Sorting is implemented for three key fields: Date (newest/oldest first), Quantity (high to low / low to high), and Customer Name (A-Z / Z-A). The sorting logic is handled server-side through Supabase's `.order()` method, ensuring efficient processing of large datasets. Users select sort options through a dropdown menu, and the selected sort criterion is preserved across filter changes and search queries. Pagination resets to page 1 when sorting changes to ensure consistent result ordering.

## Pagination Implementation Summary

Pagination is implemented with a fixed page size of 10 items, featuring Previous/Next navigation controls and clear display of current position (showing X to Y of Z results). The implementation uses Supabase's `.range()` method for efficient server-side pagination, loading only the required data subset for each page. Pagination state is preserved when applying filters or sorting, automatically adjusting to page 1 only when the query parameters change in ways that could affect result count. The system gracefully handles edge cases like empty result sets and single-page results.

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database setup**

   The database schema is already configured with the required `sales` table. If needed, the migration can be found in the Supabase migrations.

5. **Import data**

   - Start the development server
   - Use the "Import Data" button in the application header
   - Select your CSV file containing sales data
   - The system will automatically parse and import records in batches

6. **Run the application**
   ```bash
   npm run dev
   ```

7. **Build for production**
   ```bash
   npm run build
   ```

8. **Preview production build**
   ```bash
   npm run preview
   ```

## Features

- Full-text search across customer information
- Multi-dimensional filtering with real-time updates
- Flexible sorting options
- Efficient pagination for large datasets
- CSV data import functionality
- Responsive design for all screen sizes
- Professional UI with clear visual hierarchy
- Edge case handling for empty results and invalid inputs
