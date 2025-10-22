export interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    quantity: string;
    supply: string;
    refillDate: string;
};

export interface Adherence {
    id: string,
    medicationID: string;
    dosesTaken: number;
    dosesMissed: number;
}

export const medications: Medication[] = [];
export const adherences: Adherence[] = [];

