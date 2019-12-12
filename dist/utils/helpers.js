"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyQuery = (data) => {
    return Object.entries(data).reduce((acc, item, index, entries) => {
        const [key, value] = item;
        acc += `${key}=${encodeURIComponent(value)}${index === entries.length - 1 ? "" : "&"}`;
        return acc;
    }, "");
};
