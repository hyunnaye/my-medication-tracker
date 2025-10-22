'use client';

import { Adherence, Medication } from '@/lib/data';
import { getDaysLeft, getRefillAlert } from '@/lib/utils';

interface MedicationListProps {
  medications: Medication[];
  adherences: Adherence[];
  editMedication: (med: Medication) => void;
  deleteMedication: (medID: string) => void;
  incrementAdherence: (medID: string, action: "taken" | "missed") => void;
}

export default function MedicationList({ medications, adherences, editMedication, deleteMedication, incrementAdherence }: MedicationListProps) {

  function medicationLabels(label: string, value: string) {
    return (
      <p className="text-sm text-gray-500">
        <span className="font-semibold">{label}: </span>{value}
      </p>
    );
  }
  function getProgressBar(progressPercent: number, status: "on-track" | "low" | "overdue" | "refill-day", daysLeft: number) {
    let progressBarColour = ""
    let alertBadgeColor = ""
    let text = "";

    switch (status) {
      case "on-track":
        progressBarColour = "bg-green-500"
        alertBadgeColor = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        text = `On Track! ${daysLeft} days left`
        break;
      case "low":
        progressBarColour = "bg-yellow-300"
        alertBadgeColor = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
        text = `Running Low! Refill in ${daysLeft} days`
        break;
      case "overdue":
        progressBarColour = "bg-red-500"
        alertBadgeColor = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
        text = `Overdue! Refill is ${daysLeft} days late`
        break;
      case "refill-day":
        progressBarColour = "bg-green-500"
        alertBadgeColor = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        text = `Today is your refill day!`
        break;
      default:
        progressBarColour = "bg-gray-500"
    }

    return (
      <div>
        <div className="mt-4">
          <div className={`relative w-full h-2.5 bg-gray-200 rounded-full overflow-hidden`}>
            <div
              className={"absolute left-0 top-0 h-full transition-all duration-500 " + progressBarColour}
              style={{ width: `${100 - progressPercent}%` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <p
            className={"inline-block text-center text-m font-medium px-2.5 py-0.5 rounded-sm " + alertBadgeColor}
          >
            {text}
          </p>
        </div>
      </div>
    );
  }

  function getAdherencePercentage(medicationID: string): number {
    const adherence = adherences.find(a => a.medicationID === medicationID);
    if (!adherence) return 0;

    const total = adherence.dosesTaken + adherence.dosesMissed;
    if (total === 0) return 0;

    return Math.round((adherence.dosesTaken / total) * 100);
  }
  return (
    <>
      {medications.length === 0 ? (
        <div className="w-full text-center p-8 bg-gradient-to-r from-slate-50 to-slate-100 shadow-sm border border-gray-100 dark:border-gray-800  rounded-2xl shadow-sm">
          <p className="text-gray-800 font-semibold text-lg">No medications yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Add one above to start tracking your refills and adherence.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {medications.map((med) => {
            const daysLeft = getDaysLeft(med.refillDate, false);
            const progressPercent = Math.max(
              0,
              Math.min(100, (daysLeft / Number(med.supply)) * 100)
            );
            return (
              <li
                key={med.id}
                className="border border-gray-200 bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between flex-wrap gap-3">
                  <div className="space-y-1">
                    <p className="font-semibold text-lg flex items-center gap-2">
                      {med.name}
                    </p>
                    {medicationLabels("Dosage", med.dosage)}
                    {medicationLabels("Frequency", med.frequency)}
                    {medicationLabels("Start Date", med.startDate)}
                    {medicationLabels("Quantity", med.quantity)}
                    {medicationLabels("Days Left", daysLeft.toString())}
                    {medicationLabels("Refill Date", med.refillDate)}
                  </div>
                  <div className="flex flex-col items-end gap-2 text-sm">
                    <button
                      onClick={() => editMedication(med)}
                      className="px-3 py-1.5 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteMedication(med.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-medium transition"
                    >
                      🗑️ Delete
                    </button>
                    <button
                      onClick={() => incrementAdherence(med.id, "taken")}
                      className="px-3 py-1.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 font-medium transition"
                    >
                      ✅ Dose Taken
                    </button>
                    <button
                      onClick={() => incrementAdherence(med.id, "missed")}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
                    >
                      🚫 Dose Missed
                    </button>
                    <p className="text-sm text-gray-500 mt-1">
                      Adherence: <span className="font-semibold text-gray-700">{getAdherencePercentage(med.id)}%</span>
                    </p>
                  </div>
                </div>

                {getProgressBar(progressPercent, getRefillAlert(med.refillDate), Math.abs(getDaysLeft(med.refillDate, true)))}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}  