"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomString = generateRandomString;
const MIN_LENGTH = 6;
function generateRandomString() {
    return Math.random().toString(36).substring(2, 2 + MIN_LENGTH);
}
