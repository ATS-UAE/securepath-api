"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyQuery = (data) => {
    return Object.entries(data).reduce((acc, item) => {
        const [key, value] = item;
        acc += `${key}=${encodeURIComponent(value)}`;
        return acc;
    }, "");
};
