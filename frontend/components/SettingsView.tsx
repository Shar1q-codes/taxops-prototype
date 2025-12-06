
import React, { useState } from 'react';
import { Save, User, Building, CreditCard, Key, CheckCircle, AlertCircle } from 'lucide-react';

export default function SettingsView() {
  const [qbConnected, setQbConnected] = useState(true);
  const [xeroConnected, setXeroConnected] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSave = () => {
    setToastMessage('Settings saved successfully.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleToggleIntegration = (name: string, isConnecting: boolean) => {
      if (isConnecting) {
          // Simulate connection delay
          setTimeout(() => {
              if (name === 'QB') setQbConnected(true);
              if (name === 'Xero') setXeroConnected(true);
              setToastMessage(`${name} connected successfully.`);
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
          }, 800);
      } else {
          if (name === 'QB') setQbConnected(false);
          if (name === 'Xero') setXeroConnected(false);
          setToastMessage(`${name} disconnected.`);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
      }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      {/* Toast Notification */}
      {showToast && (
          <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-300 z-50">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-sm font-medium">{toastMessage}</span>
          </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your firm profile, team, and billing.</p>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-200">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
             <User className="text-blue-600" size={20} />
             <h3 className="text-lg font-medium text-slate-900">User Profile</h3>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <label className="block text-sm font-medium text-slate-700">Full Name</label>
             <input type="text" defaultValue="John Doe" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500" />
           </div>
           <div>
             <label className="block text-sm font-medium text-slate-700">Email</label>
             <input type="email" defaultValue="partner@elevatecpa.com" disabled className="mt-1 block w-full rounded-md border-slate-300 bg-slate-50 text-slate-500 border p-2" />
           </div>
        </div>
        <div className="bg-slate-50 px-6 py-3 flex justify-end rounded-b-lg border-t border-slate-200">
           <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
             <Save size={16} /> Save Changes
           </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-200">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
             <Building className="text-indigo-600" size={20} />
             <h3 className="text-lg font-medium text-slate-900">Firm Details</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
           <div>
             <label className="block text-sm font-medium text-slate-700">Firm Name</label>
             <input type="text" defaultValue="Elevate CPA, LLC" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500" />
           </div>
           <div>
             <label className="block text-sm font-medium text-slate-700">Address</label>
             <textarea rows={2} defaultValue="123 Audit Ave, New York, NY 10001" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500" />
           </div>
        </div>
        <div className="bg-slate-50 px-6 py-3 flex justify-end rounded-b-lg border-t border-slate-200">
           <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">
             <Save size={16} /> Save Firm Details
           </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-200">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
             <Key className="text-amber-600" size={20} />
             <h3 className="text-lg font-medium text-slate-900">Integrations & API</h3>
          </div>
        </div>
        <div className="p-6">
           <p className="text-sm text-slate-500 mb-4">Manage connection keys for QuickBooks Online and Xero.</p>
           
           {/* QB Integration */}
           <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg mb-3">
              <div className="flex items-center gap-3">
                 <div className="h-8 w-8 bg-green-100 rounded flex items-center justify-center text-green-700 font-bold text-xs">QB</div>
                 <span className="font-medium text-slate-700">QuickBooks Online</span>
              </div>
              {qbConnected ? (
                  <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          <CheckCircle size={12} /> Connected
                      </span>
                      <button onClick={() => handleToggleIntegration('QB', false)} className="text-sm text-red-600 hover:underline">Disconnect</button>
                  </div>
              ) : (
                  <button onClick={() => handleToggleIntegration('QB', true)} className="text-sm text-blue-600 font-medium hover:underline">Connect</button>
              )}
           </div>

           {/* Xero Integration */}
           <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3">
                 <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center text-blue-700 font-bold text-xs">X</div>
                 <span className="font-medium text-slate-700">Xero</span>
              </div>
              {xeroConnected ? (
                  <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          <CheckCircle size={12} /> Connected
                      </span>
                      <button onClick={() => handleToggleIntegration('Xero', false)} className="text-sm text-red-600 hover:underline">Disconnect</button>
                  </div>
              ) : (
                  <button onClick={() => handleToggleIntegration('Xero', true)} className="text-sm text-blue-600 font-medium hover:underline">Connect</button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
