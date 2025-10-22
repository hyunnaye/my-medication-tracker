import { NextResponse } from "next/server";
import { getRefillDate } from "@/lib/utils";
import { Medication, medications } from "@/lib/data";

function getRefillNeededMedications(days: number): Medication[] {
  const now = new Date();
  const fullDay = 1000 * 60 * 60 * 24;

  console.log(medications);
  const filteredMeds = medications.filter((medication) => {
      const refillDate = new Date(getRefillDate(medication.startDate, medication.supply));
      return (Math.ceil(refillDate.getTime() - now.getTime())) / fullDay <= days;
  })

  return filteredMeds.map(medication => (
      { ...medication, refillDate: getRefillDate(medication.startDate, medication.supply)
      }));
}

export async function GET() {
  try {
      const refillsDue = getRefillNeededMedications(7);
      return NextResponse.json(refillsDue, { status: 201 });
    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

}