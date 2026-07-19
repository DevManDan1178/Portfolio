export function formatTime(timeMS: number, digitsAfterZero: number) {
    const ToMinutes = 60000;
    const ToSeconds = 1000;

    const milliseconds = Math.floor(
        (timeMS % ToSeconds) / Math.pow(10, 3 - digitsAfterZero)
    );

    return `${String(Math.floor(timeMS / ToMinutes)).padStart(2, "0")}:`+
    `${String(Math.floor((timeMS % ToMinutes) / ToSeconds)).padStart(2, "0")}.`+
    `${String(milliseconds).padStart(digitsAfterZero, "0")}`;
}