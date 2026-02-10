import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPassTime(time: any): string {
    if (!time) return "---";

    try {
        // 1. Handle Firestore Timestamp objects (seconds/nanoseconds)
        if (typeof time === "object" && "_seconds" in time) {
            return new Date(time._seconds * 1000).toLocaleString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        }

        // 2. Handle simple time strings like "10:15 AM" or "22:15"
        if (typeof time === "string") {
            // Check if it matches HH:MM AM/PM or HH:MM format
            const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)?$/i;
            if (time.match(timeRegex)) {
                return time.toUpperCase(); // Already a clean time string
            }

            // 3. Handle ISO strings or Date strings
            const date = new Date(time);
            if (!isNaN(date.getTime())) {
                return date.toLocaleString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                });
            }
        }

        // 4. Handle Date objects
        if (time instanceof Date) {
            return time.toLocaleString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        }

        return "---";
    } catch (error) {
        console.error("Error formatting time:", time, error);
        return "---";
    }
}
