import {parseText, parseCode} from './transpile';

describe('parseText', () => {
	it('Should just return normal text', () => {
		let parsed = parseText(['test'], 'abc')
		expect(parsed()).toBe('abc');
	});

	it('Should replace simple expression', () => {
		let parsed = parseText(['test'], 'a${test}c')
		expect(parsed({test: 'b'})).toBe('abc');
	});

	it('Should allow es5 and above', () => {
		let parsed = parseText(['test'], 'a${test**2}c');
		expect(parsed({test: 2})).toBe('a4c');
	});

	it('Should allow multiple expressions', () => {
		let parsed = parseText(['test1', 'test2'], 'a${test1}b${test2}c');
		expect(parsed({test1: 1, test2: '-'})).toBe('a1b-c');
	});

	it('Should respect unescaped html entities', () => {
		let parsed = parseText(['test'], 'a${test}c<>&\'"');
		expect(parsed({test: 'b'})).toBe('abc<>&\'"');
	});

	it('Should leave tags in text', () => {
		let parsed = parseText(['test'], 'a<div>${test}</div>c');
		expect(parsed({test: 'test'})).toBe('a<div>test</div>c');
	});

	it('Should call .toString() for objects in expressions', () => {
		let parsed = parseText(['test'], 'a${{test: test}}c');
		expect(parsed({test: 'test'})).toBe('a[object Object]c');
	});
});

describe('parseCode', () => {
	it('Should execute simple expression', () => {
		let parsed = parseCode(['test'], 'test + 1;');
		expect(parsed({test: 1})).toBe(2);
	});

	test.skip('Should allow simple function expression', () => {
		let parsed = parseCode(['test'], 'function () { return 2; }');
		expect(parsed({test: () => 2})()).toBe(2);
	});

	it('Should allow lambda expression', () => {
		let parsed = parseCode(['test'], '() => 2');
		expect(parsed({test: () => 2})()).toBe(2);
	});
});