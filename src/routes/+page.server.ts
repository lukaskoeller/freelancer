import type { Actions } from './$types';
import { getTaxData } from './getTaxData';

export const actions = {
	incomeTax: async ({ request }) => {
		const data = await request.formData();
		const taxClass = data.get('taxClass') as string;
		const calculatedSalary = data.get('calculatedSalary');
		const workDays = data.get('workDays');
		const businessCosts = data.get('businessCosts');

		const response = await getTaxData(
			taxClass,
			Number(calculatedSalary),
			Number(workDays),
			Number(businessCosts)
		);
		return response;
	}
} satisfies Actions;
