const RequestCoalescer = require("../src/requestCoalescer.js");
const BatchExecutor = require("../src/batchExecutor.js");

describe("Batch request coalescer", () => {
    test("should process valid input", () => {
        const obj = new RequestCoalescer();
        expect(obj.process({ key: "val" })).not.toBeNull();
    });
    test("should handle null", () => {
        const obj = new RequestCoalescer();
        expect(obj.process(null)).toBeNull();
    });
    test("should track stats", () => {
        const obj = new RequestCoalescer();
        obj.process({ x: 1 });
        expect(obj.getStats().processed).toBe(1);
    });
    test("support should work", () => {
        const obj = new BatchExecutor();
        expect(obj.process({ data: "test" })).not.toBeNull();
    });
});
