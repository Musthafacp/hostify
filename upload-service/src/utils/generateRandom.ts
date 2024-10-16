const MIN_LENGTH = 6;
export function generateRandomString() {
    return Math.random().toString(36).substring(2, 2 + MIN_LENGTH);
}
