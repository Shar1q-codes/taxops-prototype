
import React, { useRef } from 'react';
import { FileText, Download, Trash2, Search, Filter, Upload, File } from 'lucide-react';
import { Document, DocumentType } from '../web/types';

interface Props {
  documents: Document[];
  onUpload: (file: File) => void;
  onDelete: (id: string) => void;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function DocumentsView({ documents, onUpload, onDelete }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const handleDownload = (docName: string) => {
      // Simulate download
      const link = document.createElement('a');
      link.href = '#';
      link.download = docName;
      document.body.appendChild(link);
      // alert(`Downloading ${docName}...`); 
      // In a real app this would trigger a blob download
      document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange}
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search documents..." 
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-300 rounded-md hover:bg-slate-50 text-slate-600">
                <Filter size={18} />
            </button>
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
            >
                <Upload size={16} />
                <span>Upload New</span>
            </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Uploaded</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Evidence</th>
              <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {documents.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        <File className="mx-auto h-12 w-12 text-slate-200 mb-2" />
                        <p>No documents uploaded yet.</p>
                    </td>
                </tr>
            ) : (
                documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded flex items-center justify-center text-blue-600">
                        <FileText size={16} />
                        </div>
                        <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{doc.name}</div>
                        <div className="text-xs text-slate-500">by {doc.uploadedBy}</div>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
                        {doc.type.replace('_', ' ')}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {formatBytes(doc.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {doc.linkedFindingsCount > 0 ? (
                        <span className="text-blue-600 hover:underline cursor-pointer font-medium">{doc.linkedFindingsCount} Findings</span>
                    ) : (
                        <span className="text-slate-400">-</span>
                    )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => handleDownload(doc.name)}
                            className="text-slate-400 hover:text-blue-600 p-1" 
                            title="Download"
                        >
                            <Download size={16} />
                        </button>
                        <button 
                            onClick={() => onDelete(doc.id)}
                            className="text-slate-400 hover:text-red-600 p-1" 
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
