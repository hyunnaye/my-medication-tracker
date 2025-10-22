'use client';

import { FormEvent, useState } from 'react';
import { Medication } from '@/lib/data';
import { getRefillDate } from '@/lib/utils';

interface AddMedicationFormProps {
  onAdd: (newMed: Medication) => void;
  addAdherence: (medicationID: string) => void;
}

export default function AddMedicationForm({ onAdd, addAdherence }: AddMedicationFormProps) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supply, setSupply] = useState('');

  function resetForm() {
    setName('');
    setDosage('');
    setFrequency('');
    setStartDate('');
    setQuantity('');
    setSupply('');
  }

  async function addMedication(event: FormEvent) {
    event.preventDefault();

    const refillDate = getRefillDate(startDate, supply)

    const res = await fetch('/api/medication', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, dosage, frequency, startDate, quantity, supply, refillDate }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(`Error: ${err.error}`);
      return;
    }

    const newMedication = await res.json()
    onAdd(newMedication);
    addAdherence(newMedication.id);
    resetForm;
  }

  return (
    <form
      onSubmit={addMedication}
      className="space-y-4 mb-8 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
    >
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Add New Medication
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Medication Name"
          required
          className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        <input
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          placeholder="Dosage (e.g. 10mg)"
          required
          className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        <input
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          placeholder="Frequency (e.g. 2x per day)"
          required
          className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        <input
          value={startDate}
          type="date"
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        <input
          value={quantity}
          type="number"
          min="0"
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Total Quantity"
          required
          className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        <input
          value={supply}
          type="number"
          min="0"
          onChange={(e) => setSupply(e.target.value)}
          placeholder="Days Supply"
          required
          className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
      >
        Add Medication
      </button>
    </form>
  );

}
