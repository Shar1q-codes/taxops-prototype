import React, { useEffect, useRef, useState } from 'react';
import { Building2, MoreVertical } from 'lucide-react';
import { Client } from '../../web/types';
import { deleteClient, updateClient } from '../../web/lib/api';

export interface ClientRowProps {
  client: Client;
  onUpdated?: (client: Client) => void;
  onDeleted?: (clientId: string) => void;
}

export default function ClientRow({ client, onUpdated, onDeleted }: ClientRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [form, setForm] = useState({
    name: client.name,
    code: client.code,
    industry: client.industry || '',
    contactName: client.contactName || '',
    email: client.email || '',
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setForm({
      name: client.name,
      code: client.code,
      industry: client.industry || '',
      contactName: client.contactName || '',
      email: client.email || '',
    });
  }, [client]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateClient(client.id, {
        name: form.name,
        code: form.code,
        industry: form.industry,
        contactName: form.contactName,
        email: form.email,
      });
      onUpdated?.(updated);
      setIsEditOpen(false);
    } catch (err) {
      console.error(err);
      setError('Unable to update client. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deleteClient(client.id);
      onDeleted?.(client.id);
      setIsDeleteOpen(false);
    } catch (err) {
      console.error(err);
      setError('Unable to delete client. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <tr className="hover:bg-slate-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <Building2 size={20} />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-slate-900">{client.name}</div>
              <div className="text-xs text-slate-500">{client.email}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
          {client.code}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
          {client.industry}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
          {client.contactName}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              client.activeEngagements > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {client.activeEngagements} Active
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="relative inline-block" ref={menuRef}>
            <button
              aria-label="Client actions"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-20">
                <button
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                  onClick={() => {
                    setIsEditOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  Edit client
                </button>
                <div className="h-px bg-slate-100" />
                <button
                  className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={() => {
                    setIsDeleteOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  Delete client
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>

      {isEditOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Edit Client</h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Company Name"
                  value={form.name}
                  onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
                  required
                />
                <Field
                  label="Client Code"
                  value={form.code}
                  onChange={(value) => setForm((prev) => ({ ...prev, code: value.toUpperCase() }))}
                  required
                />
              </div>
              <Field
                label="Industry"
                value={form.industry}
                onChange={(value) => setForm((prev) => ({ ...prev, industry: value }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Contact Name"
                  value={form.contactName}
                  onChange={(value) => setForm((prev) => ({ ...prev, contactName: value }))}
                />
                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Delete client?</h3>
              <p className="text-sm text-slate-500 mt-1">
                This will remove the client and its engagements from your firm. This action cannot be undone.
              </p>
            </div>
            <div className="p-6 space-y-2">
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}

function Field({ label, value, onChange, required, type = 'text' }: FieldProps) {
  return (
    <label className="block text-sm font-medium text-slate-700 space-y-1">
      <span>{label}{required ? ' *' : ''}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        type={type}
        className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </label>
  );
}
