import { adherences } from '@/lib/data';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json(adherences);
}

export async function POST(request: Request) {
  try {
    const { medicationID } = await request.json();

    const newAdherence = {
      id: Date.now().toString(),
      medicationID: medicationID,
      dosesTaken: 0,
      dosesMissed: 0
    };

    adherences.push(newAdherence);

    return NextResponse.json(adherences, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
  
export async function DELETE(request: Request) {
  try {
    const idJson  = await request.json(); 
    const medicationID = idJson.medicationID;

    const i = adherences.findIndex( (adherence) => adherence.medicationID === medicationID)
    if (i === -1) {
    return NextResponse.json({ error: 'Adherence not found' }, { status: 404 });
  }

    adherences.splice(i, 1);
    return NextResponse.json(adherences, {status: 201});
    
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const {medicationID, adherence} = await request.json();

    const i = adherences.findIndex( (adherence) => adherence.medicationID === medicationID)
    if (i === -1) {
      return NextResponse.json({ error: 'Adherence not found' }, { status: 404 });
    }

    if (adherence === "taken") {
        adherences[i].dosesTaken++;
    } else if (adherence === "missed") {
        adherences[i].dosesMissed++;
    } else {
        return NextResponse.json({ error: 'Invalid adherence type' }, { status: 400 });
    }

    return NextResponse.json(adherences[i], { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

    
