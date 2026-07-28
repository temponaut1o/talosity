'use client';

import { ReactNode, useMemo, useState } from 'react';

interface FieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'number' | 'textarea' | 'select';
  required?: boolean;
  options?: string[];
}

interface FormModalProps {
  open: boolean;
  title: string;
  fields: FieldConfig[];
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (values: Record<string, string>) => Promise<void>;
  initialValues?: Record<string, string>;
  footer?: ReactNode;
}

export function FormModal({
  open,
  title,
  fields,
  submitLabel,
  onCancel,
  onSubmit,
  initialValues = {},
  footer,
}: FormModalProps) {
  const defaultValues = useMemo(() => {
    const result: Record<string, string> = {};
    for (const field of fields) {
      result[field.name] = initialValues[field.name] ?? '';
    }
    return result;
  }, [fields, initialValues]);

  const [values, setValues] = useState<Record<string, string>>(defaultValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    for (const field of fields) {
      if (field.required && !values[field.name]?.trim()) {
        setError(`${field.label} is required.`);
        return;
      }
    }

    setLoading(true);
    try {
      await onSubmit(values);
      setSuccess('Saved successfully.');
      setValues(defaultValues);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save changes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
        <div className="mt-4 grid gap-4">
          {fields.map((field) => {
            const value = values[field.name] ?? '';
            if (field.type === 'textarea') {
              return (
                <label key={field.name} className="space-y-1 text-sm">
                  <span className="text-slate-700">{field.label}</span>
                  <textarea
                    value={value}
                    onChange={(event) => setValues((prev) => ({ ...prev, [field.name]: event.target.value }))}
                    className="min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </label>
              );
            }

            if (field.type === 'select') {
              return (
                <label key={field.name} className="space-y-1 text-sm">
                  <span className="text-slate-700">{field.label}</span>
                  <select
                    value={value}
                    onChange={(event) => setValues((prev) => ({ ...prev, [field.name]: event.target.value }))}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  >
                    <option value="">Select</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }

            return (
              <label key={field.name} className="space-y-1 text-sm">
                <span className="text-slate-700">{field.label}</span>
                <input
                  type={field.type ?? 'text'}
                  value={value}
                  onChange={(event) => setValues((prev) => ({ ...prev, [field.name]: event.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </label>
            );
          })}
        </div>

        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
        {success ? <p className="mt-3 text-sm text-emerald-600">{success}</p> : null}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
          >
            {loading ? 'Saving...' : submitLabel}
          </button>
          <button type="button" onClick={onCancel} className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700">
            Cancel
          </button>
          {footer}
        </div>
      </div>
    </div>
  );
}
