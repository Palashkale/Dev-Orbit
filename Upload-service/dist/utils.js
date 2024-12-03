"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
//random id generator
const Max_len = 5;
function generate() {
    let ans = "";
    const subset = "1234567890qwertyuiopasdghjklzxcvbnm";
    for (let i = 0; i < Max_len; i++) {
        ans += subset[Math.floor(Math.random() * subset.length)];
    }
    return ans;
}
// Example usage:
