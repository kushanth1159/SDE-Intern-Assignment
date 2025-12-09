# Architecture Documentation

## Backend Architecture

### Database Layer (Supabase/PostgreSQL)

**Schema Design:**
- Single normalized `sales` table containing all transaction data
- Comprehensive indexing strategy on frequently queried fields:
  - `customer_name`, `phone_number` for search operations
  - `date` for temporal sorting
  - Filter fields: `customer_region`, `gender`, `age`, `product_category`, `payment_method`
- Row Level Security (RLS) enabled with public read/insert policies for demo purposes

**Query Optimization:**
- Server-side filtering, sorting, and pagination to minimize data transfer
- Batch operations for CSV imports (1000 records per batch)
- Efficient use of PostgreSQL's ILIKE for case-insensitive search
- Range queries for numeric and date filters

### API Layer (Supabase Client)

**Service Architecture:**
- `salesService.ts`: Core data access layer
  - `fetchSales()`: Unified query builder handling search, filters, sorting, and pagination
  - `getFilterOptions()`: Retrieves distinct values for filter dropdowns
  - `importSalesData()`: Batch import handler for CSV data
- Direct client-to-database communication via Supabase's JavaScript client
- Type-safe queries using TypeScript interfaces

## Frontend Architecture

### Component Structure

**Layout Components:**
- `App.tsx`: Main application container with state management
- Responsive layout with sidebar filters and main content area
- Conditional rendering for empty state (CSV upload prompt)

**Feature Components:**

1. **SearchBar** (`components/SearchBar.tsx`)
   - Controlled input component
   - Debounced search to prevent excessive queries
   - Icon integration for visual clarity

2. **FilterPanel** (`components/FilterPanel.tsx`)
   - Collapsible filter sections
   - Multi-select checkboxes for categorical filters
   - Range inputs for numeric/date filters
   - Active filter count badges
   - Clear all functionality

3. **TransactionTable** (`components/TransactionTable.tsx`)
   - Responsive table layout
   - Loading state spinner
   - Empty state messaging
   - Rich data display with nested customer/product information
   - Status badges with color coding

4. **SortingDropdown** (`components/SortingDropdown.tsx`)
   - Select-based sorting interface
   - Predefined sort options
   - Visual sort indicator

5. **PaginationControls** (`components/PaginationControls.tsx`)
   - Previous/Next navigation
   - Current page indicator
   - Result range display
   - Disabled state handling

6. **CSVUpload** (`components/CSVUpload.tsx`)
   - File upload interface
   - Progress indication
   - Success/error messaging
   - Automatic data refresh on completion

### State Management

**Local State (React Hooks):**
- `useState` for component-level state
- `useCallback` for memoized functions preventing unnecessary re-renders
- `useEffect` for side effects (data fetching, filter option loading)

**State Flow:**
```
User Action → State Update → Reset Pagination (if needed) → Trigger Data Fetch → Update Display
```

**Key State Objects:**
- `salesData`: Current page of sales records
- `searchTerm`: Active search query
- `filters`: Object containing all active filter selections
- `sortOption`: Current sort field and direction
- `pagination`: Page number, page size, and total count
- `availableFilterOptions`: Distinct values for each filter dimension

### Data Flow

1. **Initial Load:**
   - Check for existing data via `getFilterOptions()`
   - Display CSV upload prompt if no data exists
   - Load filter options if data present
   - Fetch initial page of data

2. **User Interactions:**
   - Search/Filter/Sort changes reset pagination to page 1
   - All query parameters sent to `fetchSales()`
   - Server processes query and returns paginated results
   - UI updates with new data and pagination state

3. **CSV Import:**
   - Parse CSV client-side
   - Validate and transform records
   - Batch insert to database
   - Refresh filter options and data

## Folder Structure

```
project/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── SearchBar.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── TransactionTable.tsx
│   │   ├── SortingDropdown.tsx
│   │   ├── PaginationControls.tsx
│   │   └── CSVUpload.tsx
│   │
│   ├── services/            # Data access layer
│   │   └── salesService.ts
│   │
│   ├── lib/                 # Third-party integrations
│   │   └── supabase.ts
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── sales.ts
│   │
│   ├── utils/               # Helper functions
│   │   └── csvParser.ts
│   │
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
│
├── docs/                    # Documentation
│   └── architecture.md
│
├── public/                  # Static assets
├── dist/                    # Build output
└── README.md                # Project documentation
```

## Module Responsibilities

### Components Layer
- **Responsibility**: User interface presentation and user interaction handling
- **Dependencies**: Services layer for data, Types for interfaces
- **Communication**: Props for parent-child, callbacks for child-parent

### Services Layer
- **Responsibility**: Data fetching, transformation, and business logic
- **Dependencies**: Supabase client, Types for interfaces
- **Communication**: Async functions returning typed data or errors

### Types Layer
- **Responsibility**: TypeScript type definitions and interfaces
- **Dependencies**: None
- **Communication**: Imported by all other layers

### Utils Layer
- **Responsibility**: Pure utility functions (CSV parsing, formatting)
- **Dependencies**: Types layer only
- **Communication**: Exported functions with clear input/output contracts

### Lib Layer
- **Responsibility**: Third-party service initialization and configuration
- **Dependencies**: External packages
- **Communication**: Singleton instances exported for application-wide use

## Design Decisions

1. **Direct Supabase Integration**: Eliminated need for separate backend API server, reducing complexity and latency

2. **Server-Side Operations**: All filtering, sorting, and pagination performed in database for optimal performance with large datasets

3. **Component Isolation**: Each component is self-contained with clear props interface, enabling independent testing and reuse

4. **Type Safety**: Comprehensive TypeScript types prevent runtime errors and improve developer experience

5. **Optimistic UI Updates**: Immediate visual feedback while data loads in background

6. **Batch Import**: Large CSV files processed in chunks to prevent memory issues and provide progress feedback

7. **Responsive Design**: Mobile-first approach with Tailwind CSS for consistent cross-device experience
