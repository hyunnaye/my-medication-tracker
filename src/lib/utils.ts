export function getRefillDate(startDate: string, supply: string): string {
    const date = new Date(startDate);
    date.setDate(date.getDate() + Number(supply));
    return date.toISOString().split("T")[0];
}

export function getDaysLeft(refillDate: string, countOverdue: boolean): number {
    const refillDateObject = new Date(refillDate);
    const now = new Date();
    const daysLeft = Math.ceil((refillDateObject.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (countOverdue) {
        return daysLeft;
    }
    return daysLeft > 0 ? daysLeft : 0;
}

export function getRefillAlert(refillDate: string): "on-track" | "low" | "overdue" {
    const daysLeft = getDaysLeft(refillDate, true);
    if (daysLeft > 7) {
        return "on-track";
    } else if (daysLeft < 7 && daysLeft > 0) {
        return "low";
    } else {
        return "overdue";
    }
}





