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

export function formatDate(date : Date) {
    return {
        day: `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`,
        hour: `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`                                            
    }
}