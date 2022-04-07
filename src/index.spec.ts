import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

///////

import { ImplementClass } from './index.js';

describe('TypeScript library skeleton:', function () {
	it('should be able to call myFunc on a new instance', async function () {
		const instance = new ImplementClass();
		expect(instance.myFunc).to.be.a('function');

		await expect(instance.myFunc()).to.eventually.become(
			`I need implementing! 1`,
		);
	});
});
