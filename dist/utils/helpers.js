"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyQuery = void 0;
exports.stringifyQuery = (data) => {
    return Object.entries(data).reduce((acc, item, index, entries) => {
        const [key, value] = item;
        let accumulator = acc;
        if (value instanceof Array) {
            value.forEach((field, fieldIndex) => {
                accumulator += `${key}${encodeURIComponent("[]")}=${encodeURIComponent(field)}${fieldIndex === field.length - 1 ? "" : "&"}`;
            });
        }
        else {
            accumulator += `${key}=${encodeURIComponent(value)}${index === entries.length - 1 ? "" : "&"}`;
        }
        return accumulator;
    }, "");
};
