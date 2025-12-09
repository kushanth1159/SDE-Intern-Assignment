import { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { parseCSV } from '../utils/csvParser';
import { importSalesData } from '../services/salesService';

interface CSVUploadProps {
  onImportComplete: () => void;
}

export default function CSVUpload({ onImportComplete }: CSVUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus('idle');
    setMessage('');

    try {
      const text = await file.text();
      const records = parseCSV(text);

      if (records.length === 0) {
        throw new Error('No valid records found in CSV file');
      }

      const batchSize = 1000;
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        await importSalesData(batch);
        setMessage(`Imported ${Math.min(i + batchSize, records.length)} of ${records.length} records...`);
      }

      setStatus('success');
      setMessage(`Successfully imported ${records.length} records!`);
      setTimeout(() => {
        onImportComplete();
      }, 2000);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to import CSV');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-center">
        <label className="cursor-pointer">
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-3" />
            <span className="text-sm font-medium text-gray-700 mb-1">
              Upload CSV Dataset
            </span>
            <span className="text-xs text-gray-500">
              Click to select or drag and drop
            </span>
          </div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {uploading && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600">{message || 'Processing...'}</span>
        </div>
      )}

      {status === 'success' && (
        <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 flex items-center justify-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}
    </div>
  );
}
