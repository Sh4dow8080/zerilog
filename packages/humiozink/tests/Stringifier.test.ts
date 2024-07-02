import stringifier from "../src/stringifier";
it("Should be able to stringify BigInts", () => {
	// Arrange
	const value = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1);

	// Act
	const result = stringifier({ value });

	// Assert
	expect(result).toBe(`{"value":"${value}n"}`);
});

it("Should be able to stringify circular references", () => {
	// Arrange
	const obj = {};
	obj["obj"] = obj;

	// Act
	const result = stringifier(obj);

	// Assert
	expect(result).toBe('{"obj":"[Circular]"}');
});

it("Should be able to stringify circular references in arrays", () => {
	// Arrange
	const arr = [];
	arr.push(arr);

	// Act
	const result = stringifier(arr);

	// Assert
	expect(result).toBe('["[Circular]"]');
});

it("Should be able to stringify circular references in nested objects", () => {
	// Arrange
	const obj = {};
	obj["obj"] = { obj };

	// Act
	const result = stringifier(obj);

	// Assert
	expect(result).toBe('{"obj":{"obj":"[Circular]"}}');
});

it("Should be able to stringify circular references in nested arrays", () => {
	// Arrange
	const arr = [];
	arr.push([arr]);

	// Act
	const result = stringifier(arr);

	// Assert
	expect(result).toBe('[["[Circular]"]]');
});

it("Should be able to stringify circular references in nested objects and arrays", () => {
	// Arrange
	const obj = {};
	obj["obj"] = { arr: [obj] };

	// Act
	const result = stringifier(obj);

	// Assert
	expect(result).toBe('{"obj":{"arr":["[Circular]"]}}');
});

it("Should be able to stringify circular references in nested arrays and objects", () => {
	// Arrange
	const arr = [];
	arr.push({ arr });

	// Act
	const result = stringifier(arr);

	// Assert
	expect(result).toBe('[{"arr":"[Circular]"}]');
});

it("Should be able to stringify a simple object", () => {
	// Arrange
	const obj = {
		name: "John",
		age: 42,
	};

	// Act
	const result = stringifier(obj);

	// Assert
	expect(result).toBe('{"name":"John","age":42}');
});

it("Should be able to stringify a simple array", () => {
	// Arrange
	const arr = ["John", 42];

	// Act
	const result = stringifier(arr);

	// Assert
	expect(result).toBe('["John",42]');
});

it("Should be able to stringify a string", () => {
	// Arrange
	const str = "Hello, World!";

	// Act
	const result = stringifier(str);

	// Assert
	expect(result).toBe('"Hello, World!"');
});

it("Should be able to stringify a number", () => {
	// Arrange
	const num = 42;

	// Act
	const result = stringifier(num);

	// Assert
	expect(result).toBe("42");
});

it("Should be able to stringify a boolean", () => {
	// Arrange
	const bool = true;

	// Act
	const result = stringifier(bool);

	// Assert
	expect(result).toBe("true");
});

it("Should be able to stringify null", () => {
	// Arrange
	const value = null;

	// Act
	const result = stringifier(value);

	// Assert
	expect(result).toBe("null");
});

it("Should be able to stringify undefined", () => {
	// Arrange
	const value = undefined;

	// Act
	const result = stringifier(value);

	// Assert
	expect(result).toBe(undefined);
});

it("Should be able to stringify a symbol", () => {
	// Arrange
	const sym = Symbol("test");

	// Act
	const result = stringifier(sym);

	// Assert
	expect(result).toBe("\"Symbol(test)\"");
});

it("Should remove functions from stringified result", () => {
	// Arrange
	const fn = () => {};

	// Act
	const result = stringifier(fn);

	// Assert
	expect(result).toBe(undefined);
});

it("Should be able to stringify a Map", () => {
	// Arrange
	const map = new Map<string, any>([
		["name", "John"],
		["age", 42],
	]);

	// Act
	const result = stringifier(map);

	// Assert
	expect(result).toBe('{"name":"John","age":42}');
});

it("Should be able to stringify a Set", () => {
	// Arrange
	const set = new Set(["John", 42]);

	// Act
	const result = stringifier(set);

	// Assert
	expect(result).toBe('["John",42]');
});

it("Should be able to stringify a Date", () => {
	// Arrange
	const date = new Date(0);

	// Act
	const result = stringifier(date);

	// Assert
	expect(result).toBe('"1970-01-01T00:00:00.000Z"');
});
