import { NextResponse } from 'next/server';
import { medications } from '@/lib/data';


export async function GET() {
  return NextResponse.json(medications);
}

export async function POST(request: Request) {
  try {
    const { name, dosage, frequency, startDate, quantity, supply, refillDate } = await request.json();
    const newMedication = {
      id: Date.now().toString(),
      name: name,
      dosage: dosage,
      frequency: frequency,
      startDate: startDate,
      quantity: quantity,
      supply: supply,
      refillDate: refillDate
    };

    medications.push(newMedication);

    return NextResponse.json(newMedication, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}


export async function DELETE(request: Request) {
  try {
    const idJson = await request.json();
    const id = idJson.medId;

    const i = medications.findIndex((med) => med.id === id)
    if (i === -1) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
    }

    medications.splice(i, 1);
    return NextResponse.json(medications, { status: 201 });

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, updates } = await request.json();

    const i = medications.findIndex((med) => med.id === id)
    if (i === -1) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
    }

    Object.assign(medications[i], updates);

    return NextResponse.json(medications[i], { status: 201 });

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
