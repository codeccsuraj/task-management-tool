export function normalizeValue(value) {
    if (value === undefined) return null;

    if (value instanceof Date) {
        return value.toISOString();
    }
    if (value && typeof value.toHexString === "function") {
        return value.toHexString();
    }

    if (value && typeof value === "object") {
        return JSON.stringify(value);
    }

    return value;
}