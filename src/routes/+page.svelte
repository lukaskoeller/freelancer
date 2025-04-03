<script lang="ts">
	import { formatCurrency } from '$lib';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let workDays = $state(198);
	let workHours = $state(7.5);
	let salary = $state(50);
	let insuranceCosts = $state(600 * 12);
	let incomeTax = $state(form?.wageTax.value);

	type TBusinessCostsItem = {
		value: string;
		amount: number;
		formValueName: `businessCostItem.${number}.name`;
		formAmountName: `businessCostItem.${number}.amount`;
	};

	let billingBasis: 'daily' | 'hourly' = $state('hourly');
	let businessCostsItems: TBusinessCostsItem[] = $state([
		{
			value: 'Software Lizenzen (Office, eMail, etc.)',
			amount: 12 * 25,
			formValueName: `businessCostItem.0.name`,
			formAmountName: `businessCostItem.0.amount`
		}
	]);

	let businessCosts: number = $derived(
		businessCostsItems.reduce((prev, { amount }) => prev + amount, 0)
	);

	let calculatedSalary: number = $derived(billingBasis === 'hourly' ? workHours * salary : salary);

	const dailyTurnover = $derived(calculatedSalary);
	const yearlyTurnover = $derived(calculatedSalary * workDays);
	const incomeBeforeTax = $derived(calculatedSalary * workDays - businessCosts);
	const income = $derived(calculatedSalary * workDays - businessCosts - incomeTax - insuranceCosts);
	const billingBasisLabel = $derived(billingBasis === 'hourly' ? 'Stundenlohn' : 'Tageslohn');
</script>

<svelte:head>
	<title>Lohnt sich Freelancing?</title>
	<meta
		name="description"
		content="Rechne dir aus, ab wann die Selbstständigkeit oder ein Kleingewerbe finanziell mit deinem Job als Angestellter mithalten kann"
	/>
</svelte:head>

<h1>Lohnt sich Freelancing</h1>
<form>
	<label for="workDays">Arbeitstage im Jahr</label>
	<input type="number" min="0" step="1" bind:value={workDays} id="workDays" />
	<details>
		<summary>Herleitung</summary>
		Im Durchschnitt arbeitet ein/e Deutsche/r 198 Tage im Jahr. Von 365 Kalendertagen sind beispielsweise
		folgende Tage abzuziehen: 104 Tage Wochenende 📅, 11 Feiertage 🎉, 14 krank 🤒, 10 Tage 👨‍🍼🤱, 28
		Urlaub 🌴 = 198 Tage
	</details>
	<fieldset>
		<legend>Abrechnungsmodell</legend>
		<label>
			<input type="radio" name="billingBasis" bind:group={billingBasis} value="hourly" />
			Stündlich
		</label>
		<label>
			<input type="radio" name="billingBasis" bind:group={billingBasis} value="daily" />
			Täglich
		</label>
	</fieldset>
	{#if billingBasis === 'hourly'}
		<label for="workHours">Arbeitsstunden pro Tag</label>
		<input type="number" min="0" step="0.1" bind:value={workHours} id="workHours" />
		<details>
			<summary>Hinweis</summary>
			Du solltest vor Antritt deiner Tätigkeit dringend klären wie viele Wochenstunden von dir erwartet
			werden bzw. du in abrufen kannst. Bei einem Vollzeit-Job kannst du mit 38 bis 40 Stunden pro Woche
			rechnen.
		</details>
	{/if}
	<label for="salary">{billingBasisLabel} (netto)</label>
	<input type="number" min="0" step="0.01" bind:value={salary} id="salary" />
	<details>
		<summary>Erläuterung</summary>
		{billingBasisLabel} ohne Umsatzsteuer. Davon ist meistens die Rede wenn über den {billingBasisLabel}
		gesprochen wird.
	</details>
	<span>Betriebsausgeben pro Jahr</span>
	<output name="result" for="@todo">{businessCosts}</output>
	<table>
		<thead>
			<tr>
				<th>Betriebsausgabe</th>
				<th>Betrag (jährlich)</th>
			</tr>
		</thead>
		<tbody>
			{#each businessCostsItems as item, idx}
				<tr>
					<td>
						<input
							type="text"
							name={item.formValueName}
							id={item.formValueName}
							bind:value={item.value}
						/>
					</td>
					<td>
						<input
							type="number"
							name={item.formAmountName}
							id={item.formAmountName}
							bind:value={item.amount}
						/>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<button
		onclick={() => {
			businessCostsItems.push({
				value: '',
				amount: 0,
				formValueName: `businessCostItem.${businessCostsItems.length}.name`,
				formAmountName: `businessCostItem.${businessCostsItems.length}.amount`
			});
		}}
	>
		Betriebsausgabe hinzufügen
	</button>
	<details>
		<summary>Erläuterung</summary>
		Als Betriebsausgaben werden Kosten bezeichnet, die du hast um deine Arbeit auszuführen. Bist du Software
		Entwickler? Dann brauchst du wahrscheinlich einen Computer. Aber auch Reisemittel sind Betriebskosten.
		Mehr dazu steht bei Github.
	</details>
</form>

<form method="POST" action="?/incomeTax">
	<label for="taxClass">Steuerklasse</label>
	<select name="taxClass" id="taxClass">
		<option value="1">Klasse 1</option>
		<option value="2">Klasse 2</option>
		<option value="3">Klasse 3</option>
		<option value="4">Klasse 4</option>
		<option value="5">Klasse 5</option>
		<option value="6">Klasse 6</option>
	</select>
	<details>
		<summary>Hinweis zu Steuerklassen</summary>
		In Deutschland gibt es sechs Steuerklassen (Lohnsteuerklassen) die das Finanzamt dem Arbeitnehmer
		zuordnet. Die Steuerklasse richtet sich in erster Linie nach dem Familienstand.
		<ul>
			<li>Steuerklasse 1: Alleinstehende, ein Job, keine Kinder</li>
			<li>Steuerklasse 2: Alleinerziehende, höherer Entlastungsbetrag</li>
			<li>Steuerklassen 3 bis 5: Verheiratete, je nach Verdienst</li>
			<li>Steuerklasse 6: Mehrere sozialversicherungspflichtige Jobs</li>
		</ul>
	</details>
	<label for="incomeTax">Income Tax</label>
	<input type="number" bind:value={incomeTax} name="incomeTax" id="incomeTax" />
	<button type="submit">Steuer berechnen</button>
	<input type="hidden" bind:value={calculatedSalary} name="calculatedSalary" />
	<input type="hidden" bind:value={workDays} name="workDays" />
	<input type="hidden" bind:value={businessCosts} name="businessCosts" />
	<details>
		Auf deine Einnahmen abzüglich Betriebskosten musst du Einkommenssteuer bezahlen.
	</details>
</form>

<label for="insuranceCosts">Versicherungskosten pro Jahr</label>
<input type="number" bind:value={insuranceCosts} id="insuranceCosts" />
<details>
	Hier können alle Arte von Versicherungen erfassten werden. Der sicher größte Posten ist die
	Krankversicherung.
</details>

<span>Tagesverdienst</span>
<output for="dailyTurnover">{formatCurrency(dailyTurnover)}</output>

<span>Jahresverdienst</span>
<output for="yearlyTurnover">{formatCurrency(yearlyTurnover)}</output>

<span>Einkommen vor Steuer</span>
<output for="incomeBeforeTax">{formatCurrency(incomeBeforeTax)}</output>

<span>Einkommen nach Steuer</span>
<output for="income">{formatCurrency(income)}</output>

{#if form?.wageTax.value && form.usedAllowance.value}
	<dl>
		<dt>{form?.wageTax.labelShort}</dt>
		<dd>{formatCurrency(form?.wageTax.value)}</dd>

		<dt>{form?.usedAllowance.labelShort}</dt>
		<dd>{formatCurrency(form?.usedAllowance.value)}</dd>
	</dl>
{/if}
