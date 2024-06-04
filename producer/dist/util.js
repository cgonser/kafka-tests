"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fibonacci = void 0;
const fibonacci = (n) => {
    return n < 1 ? 0 : n <= 2 ? 1 : (0, exports.fibonacci)(n - 1) + (0, exports.fibonacci)(n - 2);
};
exports.fibonacci = fibonacci;
//# sourceMappingURL=util.js.map