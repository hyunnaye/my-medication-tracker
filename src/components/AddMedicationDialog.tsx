'use client';

import { FormEvent, useState } from 'react';
import { Medication } from '@/lib/data';
import { getRefillDate } from '@/lib/utils';

interface AddMedicationDialogProps {
  onAdd: (newMed: Medication) => void;
  isOpen: boolean,
  onClose: () => void;
  addAdherence: (medicationID: string) => void;
}

export default function AddMedicationDialog({ onAdd, isOpen, onClose, addAdherence }: AddMedicationDialogProps) {
  if (!isOpen) return null;

  const emptyForm = {
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    quantity: '',
    supply: ''
  }

  const [form, setForm] = useState(emptyForm);

  function resetForm() {
    setForm(emptyForm);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function addMedication(event: FormEvent) {
    event.preventDefault();

    const refillDate = getRefillDate(form.startDate, form.supply)

    const res = await fetch('/api/medication', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, refillDate }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(`Error: ${err.error}`);
      return;
    }

    const newMedication = await res.json()
    onAdd(newMedication);
    addAdherence(newMedication.id);
    onClose();
    resetForm();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] border border-gray-100 dark:border-gray-800 transition-all animate-fadeIn overflow-auto">
        <form
          onSubmit={addMedication}
          className="space-y-4  bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
        >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
          💊 Add a New Medication
        </h3>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="name" className="w-32 text-gray-700 dark:text-gray-300 font-medium">Medication Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={onChange}
                required
                className="flex-1 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="dosage" className="w-32 text-gray-700 dark:text-gray-300 font-medium">Dosage</label>
              <input
                id="dosage"
                name="dosage"
                placeholder='eg. 12mg'
                value={form.dosage}
                onChange={onChange}
                required
                className="flex-1 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="frequency" className="w-32 text-gray-700 dark:text-gray-300 font-medium">Frequency</label>
              <input
                id="frequency"
                name="frequency"
                placeholder='eg. 2x a day'
                value={form.frequency}
                onChange={onChange}
                required
                className="flex-1 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="startDate" className="w-32 text-gray-700 dark:text-gray-300 font-medium">Start Date</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={onChange}
                required
                className="flex-1 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="w-32 text-gray-700 dark:text-gray-300 font-medium">Total Quantity</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={form.quantity}
                onChange={onChange}
                required
                className="flex-1 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="supply" className="w-32 text-gray-700 dark:text-gray-300 font-medium">Days Supply</label>
              <input
                id="supply"
                name="supply"
                type="number"
                min="0"
                value={form.supply}
                onChange={onChange}
                required
                className="flex-1 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>


          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              Add Medication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
