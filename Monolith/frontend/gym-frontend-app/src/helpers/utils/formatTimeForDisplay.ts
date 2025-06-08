export function formatTimeForDisplay(time24: string): string {
    const [hourStr, minuteStr] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;

    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;

    return `${String(hour).padStart(2, '0')}:${minute}`;
}

export function getPeriod(time24: string): 'AM' | 'PM' {
    const hour = parseInt(time24.split(':')[0], 10);
    return hour >= 12 ? 'PM' : 'AM';
}