import type { SalesRecord } from '../types/sales';

interface TransactionTableProps {
  data: SalesRecord[];
  loading?: boolean;
}

export default function TransactionTable({ data, loading }: TransactionTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <p className="text-center text-gray-500">No transactions found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  <div className="font-medium">{record.customer_name}</div>
                  <div className="text-gray-500">{record.phone_number}</div>
                  <div className="text-xs text-gray-400">
                    {record.gender && record.age && `${record.gender}, ${record.age} yrs`}
                    {record.customer_region && ` • ${record.customer_region}`}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  <div className="font-medium">{record.product_name}</div>
                  <div className="text-gray-500">{record.brand}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.product_category}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                  {record.quantity}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  ${Number(record.price_per_unit).toFixed(2)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <div className="font-medium">${Number(record.final_amount).toFixed(2)}</div>
                  {record.discount_percentage > 0 && (
                    <div className="text-xs text-green-600">
                      {record.discount_percentage}% off
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.payment_method}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      record.order_status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : record.order_status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : record.order_status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {record.order_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
