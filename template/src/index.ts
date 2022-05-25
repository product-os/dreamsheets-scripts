/* This is all example code.
 * Feel free to delete all of it and replace it with what you deep appropriate.
 */

/**
 * Example of a custom function. Converts a provided name into a salutation to that name.
 * @link https://developers.google.com/apps-script/guides/sheets/functions
 *
 * @param {string} input name of the person/entity to greet
 * @return {string} Input the input name prepended with "Hello, "
 * @customfunction
 */
export function greet(name: string) {
	if (typeof name !== 'string') {
		throw new Error('square expects a number.');
	}
	return `Hello, ${name}!`;
}

/**
 * An example of a macro. Creats a toast (short lived alert)
 * with a quick instruction for using greeting function.
 */
export function helloWorld() {
	const greeting = greet('World');
	const message =
		'Try our custom greeting formula in any cell. e.g. `=greet("Bob")`';
	SpreadsheetApp.getActiveSpreadsheet().toast(message, greeting);
	console.log(greeting, message);
}

export function onOpen() {
	SpreadsheetApp.getUi()
		.createMenu('My Custom Menu')
		// .addItem('Foo Bar', 'fooBarFunction')
		.addItem('Hello World', 'helloWorld')
		.addToUi();
}

// TODO: check if typings `typings/common.d.ts` is still necessary
/*
// This is where the gas-webpack-plugin expects us to assign our exports
declare let global: any;

interface Dictionary<T> {
	[index: string]: T;
}

type AnyObject = Dictionary<any>;

type Writable<T> = { -readonly [K in keyof T]: T[K] };
 */
