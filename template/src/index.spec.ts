/* This is all example code.
 * Feel free to delete all of it and replace it with what you deep appropriate.
 */
import 'jest';
import { greet } from '.';
describe('Salutations algorithm', () => {
	test('should be able to execute a trivial test', () => {
		expect(2 + 3).toBe(5);
	});
	test('should return expected greeting as a string', () => {
		expect(greet('Alice')).toBe('Hello, Alice!');
	});
});
