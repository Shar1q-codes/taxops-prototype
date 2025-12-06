
import React, { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle, Download, LogOut, MessageSquare, UploadCloud, Send } from 'lucide-react';
import { MOCK_ENGAGEMENT, MOCK_REPORTS } from '../web/lib/constants';

interface Props {
    onLogout: () => void;
}

export default function ClientPortal({ onLogout }: Props) {
    // Simulated local state for interactivity
    const [completedRequests, setCompletedRequests] = useState<string[]>([]);
    const [repliedRequests, setRepliedRequests] = useState<string[]>([]);

    const handleUpload = (id: string) => {
        // Simulate upload
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = () => {
             setCompletedRequests(prev => [...prev, id]);
             alert('Document uploaded successfully.');
        };
        input.click();
    };

    const handleReply = (id: string) => {
        const reply = prompt('Enter your response to the auditor:');
        if (reply) {
            setRepliedRequests(prev => [...prev, id]);
            alert('Reply sent to audit team.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Portal Header */}
            <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded text-white">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="font-bold text-slate-900 text-lg">Acme Corp Portal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500 hidden sm:inline">Logged in as Alice Finance</span>
                        <button onClick={onLogout} className="text-slate-400 hover:text-slate-600" title="Logout">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                
                {/* Welcome Card */}
                <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900">FY2024 Audit Engagement</h1>
                    <p className="text-slate-500 mt-1">
                        Your engagement is currently <strong>In Progress</strong>. Please review the pending requests below.
                    </p>
                    <div className="mt-4 flex gap-3">
                        <button 
                            onClick={() => handleUpload('general-upload')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-2"
                        >
                            <UploadCloud size={16} /> Upload Documents
                        </button>
                        <button 
                            onClick={() => alert('Support ticket created. Auditor will contact you shortly.')}
                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors"
                        >
                            Contact Auditor
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Col: Request List */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-semibold text-slate-900">Open Information Requests</h3>
                                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded">Action Required</span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                
                                {/* Request 1 */}
                                <div className={`p-4 transition-colors ${completedRequests.includes('req-1') ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-3">
                                            <div className={`mt-0.5 ${completedRequests.includes('req-1') ? 'text-green-500' : 'text-slate-400'}`}>
                                                {completedRequests.includes('req-1') ? <CheckCircle size={18} /> : <FileText size={18} />}
                                            </div>
                                            <div>
                                                <h4 className={`text-sm font-medium ${completedRequests.includes('req-1') ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                                    Q1 Bank Statements (Chase)
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-1">Please upload PDF statements for Jan-Mar 2024.</p>
                                                {completedRequests.includes('req-1') && <span className="text-xs text-green-600 font-medium mt-1 block">Uploaded</span>}
                                            </div>
                                        </div>
                                        {!completedRequests.includes('req-1') && (
                                            <button 
                                                onClick={() => handleUpload('req-1')} 
                                                className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                                            >
                                                Upload
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Request 2 */}
                                <div className={`p-4 transition-colors ${repliedRequests.includes('req-2') ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-3">
                                            <div className={`mt-0.5 ${repliedRequests.includes('req-2') ? 'text-green-500' : 'text-slate-400'}`}>
                                                {repliedRequests.includes('req-2') ? <CheckCircle size={18} /> : <MessageSquare size={18} />}
                                            </div>
                                            <div>
                                                <h4 className={`text-sm font-medium ${repliedRequests.includes('req-2') ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                                    Clarification on Vendor: TechSoft Inc
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-1">Large payment of $12,500 on Feb 14. Provide contract details.</p>
                                                {repliedRequests.includes('req-2') && <span className="text-xs text-green-600 font-medium mt-1 block">Replied</span>}
                                            </div>
                                        </div>
                                        {!repliedRequests.includes('req-2') && (
                                            <button 
                                                onClick={() => handleReply('req-2')} 
                                                className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                                            >
                                                Reply
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Completed Item (Historical) */}
                                <div className="p-4 bg-slate-50/50">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-3">
                                            <div className="mt-0.5 text-green-500">
                                                <CheckCircle size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-slate-500 line-through">Trial Balance Upload</h4>
                                                <p className="text-xs text-slate-500 mt-1">Completed on Feb 15</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Shared Docs */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-200">
                                <h3 className="font-semibold text-slate-900">Documents Shared with You</h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {MOCK_REPORTS.map(report => (
                                    <div key={report.id} className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-slate-400 group-hover:text-blue-500" size={16} />
                                            <span className="text-sm text-slate-700 group-hover:text-slate-900">{report.title}</span>
                                        </div>
                                        <button className="text-slate-400 hover:text-blue-600" title="Download">
                                            <Download size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
