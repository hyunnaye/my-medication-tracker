'use client';

import { useEffect, useState } from 'react';
import { Adherence, Medication } from '@/lib/data';
import { getRefillDate } from '@/lib/utils';
import AddMedicationDialog from '@/components/AddMedicationDialog';
import MedicationList from '@/components/MedicationList';
import EditMedicationDialog from '@/components/EditMedicationDialog';

export default function Home() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [adherences, setAdherences] = useState<Adherence[]>([]);
  const [editedMedication, setEditedMedication] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetch('/api/medication')
      .then((res) => res.json())
      .then(setMedications);
  }, []);

  useEffect(() => {
    fetch('/api/medication/adherence')
      .then((res) => res.json())
      .then(setAdherences);
  }, []);


  async function addAdherence(medicationID: string) {
    const res = await fetch('/api/medication/adherence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicationID }),
    });
    if (!res.ok) {
      const err = await res.json();
      alert(`Error: ${err.error}`);
      return;
    }
    setAdherences(await res.json());
  }

  async function deleteAdherence(medicationID: string) {
    const res = await fetch('/api/medication/adherence', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicationID }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(`Error: ${err.error}`);
      return;
    }
    setAdherences(await res.json());
  }

  async function incrementAdherence(medicationID: string, adherence: "taken" | "missed") {
    const res = await fetch('/api/medication/adherence', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicationID, adherence })
    });
    if (!res.ok) {
      const err = await res.json();
      alert(`Error: ${err.error}`);
      return;
    }
    const updatedAdherence = await res.json();
    setAdherences(adherences.map((adherence) => adherence.medicationID === updatedAdherence.medicationID ? updatedAdherence : adherence));
  }

  const openEditDialog = (med: Medication) => {
    setEditedMedication(med);
    setIsEditDialogOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedMedication({ ...editedMedication, [e.target.name]: e.target.value });
  };


  async function deleteMedication(medId: string) {
    const res = await fetch('/api/medication', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medId }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(`Error: ${err.error}`);
      return;
    }
    const updatedMedications = await res.json();
    setMedications(updatedMedications);
    deleteAdherence(medId);
  }

  async function editMedication() {
    let res;
    if (editedMedication.supply || editedMedication.startDate) {
      const newRefillDate = getRefillDate(editedMedication.startDate, editedMedication.supply);
      res = await fetch('/api/medication', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editedMedication.id, updates: { ...editedMedication, refillDate: newRefillDate } }),
      });
    } else {
      res = await fetch('/api/medication', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editedMedication.id, updates: editedMedication }),
      });
    }
    if (!res.ok) {
      const err = await res.json();
      alert(`Error: ${err.error}`);
      return;
    }

    const updatedMedication = await res.json();
    setMedications(medications.map((med) => med.id === updatedMedication.id ? updatedMedication : med));
    setIsEditDialogOpen(false);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold mb-4">My Medications</h1>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add Medication
        </button>
      </div>

      <AddMedicationDialog
        onAdd={(newMed) => setMedications((prev) => [...prev, newMed])}
        onClose={() => setIsAddDialogOpen(false)}
        isOpen={isAddDialogOpen}
        addAdherence={addAdherence}
      />

      <MedicationList
        medications={medications}
        adherences={adherences}
        editMedication={openEditDialog}
        deleteMedication={deleteMedication}
        incrementAdherence={incrementAdherence}
      />

      <EditMedicationDialog
        editedMedication={editedMedication}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onChange={handleEditChange}
        onSave={editMedication}
      />
    </div>
  );
}