'use client';

interface EditMedicationDialogProps {
  editedMedication: any;
  isOpen: boolean;
  onClose: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

export default function EditMedicationDialog({ editedMedication, isOpen, onClose, onChange, onSave }: EditMedicationDialogProps) {
  if (!isOpen) return null;

  return (
<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-800 transition-all animate-fadeIn">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
      ✏️ Edit Medication
    </h3>

    <div className="space-y-3">
      <div>
        <label className="text-sm text-gray-600 dark:text-gray-400">Name</label>
        <input
          name="name"
          value={editedMedication?.name || ""}
          onChange={onChange}
          placeholder="Medication Name"
          className="mt-1 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600 dark:text-gray-400">Dosage</label>
        <input
          name="dosage"
          value={editedMedication?.dosage || ""}
          onChange={onChange}
          placeholder="Dosage"
          className="mt-1 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600 dark:text-gray-400">Frequency</label>
        <input
          name="frequency"
          value={editedMedication?.frequency || ""}
          onChange={onChange}
          placeholder="Frequency"
          className="mt-1 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600 dark:text-gray-400">Start Date</label>
        <input
          name="startDate"
          type="date"
          value={editedMedication?.startDate || ""}
          onChange={onChange}
          className="mt-1 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">Total Quantity</label>
          <input
            name="quantity"
            type="number"
            value={editedMedication?.quantity || ""}
            onChange={onChange}
            placeholder="Quantity"
            className="mt-1 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">Days Supply</label>
          <input
            name="supply"
            type="number"
            value={editedMedication?.supply || ""}
            onChange={onChange}
            placeholder="Days Supply"
            className="mt-1 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
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
        onClick={onSave}
        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
      >
        Save Changes
      </button>
    </div>
  </div>
</div>

  );
};
