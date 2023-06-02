<script lang="ts">
	import type { PageData } from './$types';

	let workDays: number = 198;
	let workHours: number = 7.5;
	let salary: number = 50;
	let insuranceCosts: number = 600 * 12;

	export let data: PageData;
	let incomeTax: number = data?.incomeTax ?? 0;

	let billingBasis: 'daylie' | 'hourly' = 'hourly';
	let businessCostsItems = [
		{
			name: 'Software Lizenzen (Office, eMail, ...)',
			amount: 12 * 25
		}
	];

	$: businessCosts = businessCostsItems.reduce((prev, { amount }) => prev + amount, 0);

	$: calculatedSalary = billingBasis === 'hourly' ? workHours * salary : salary;

	$: daylieTurnover = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
		calculatedSalary
	);
	$: yearlyTurnover = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
		calculatedSalary * workDays
	);
	$: incomeBeforeTax = new Intl.NumberFormat('de-DE', {
		style: 'currency',
		currency: 'EUR'
	}).format(calculatedSalary * workDays - businessCosts);
	$: income = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
		calculatedSalary * workDays - businessCosts - incomeTax - insuranceCosts
	);
</script>

<svelte:head>
	<title>Freelancer</title>
	<meta name="description" content="Freelance calculator" />
</svelte:head>

<fieldset>
	<legend>User input</legend>

	<label for="workDays">Arbeitstage im Jahr</label>
	<input type="number" min="0" step="1" bind:value={workDays} id="workDays" />
	<details>
		Im Durchschnitt arbeitet ein/e Deutsche/r 198Tage im Jahr. Von 365 Kalendertagen sind
		beispielsweise folgende Tage abzuziehen: 104 Tage Wochenende 📅, 11 Feiertage 🎉, 14 krank 🤒,
		10 Tage 👨‍🍼🤱, 28 Urlaub 🌴 = 198 Tage
	</details>

	<div>Abrechnungsmodell</div>
	<div style="display: flex; gap: 15px">
		<label
			><input
				type="radio"
				name="billingBasis"
				bind:group={billingBasis}
				value="hourly"
			/>Stündlich</label
		>
		<label
			><input
				type="radio"
				name="billingBasis"
				bind:group={billingBasis}
				value="daylie"
			/>Täglich</label
		>
	</div>

	{#if billingBasis === 'hourly'}
		<label for="workHours">Arbeitsstunden pro Tag</label>
		<input type="number" min="0" step="0.1" bind:value={workHours} id="workHours" />
		<details>
			Du solltest vor Antritt deiner Tätigkeit dringend klären wie viele Wochenstunden von dir
			erwartet werden bzw. du in abrufen kannst. Bei einem Vollzeit-Job kannst du mit 38 bis 40
			Stunden pro Woche rechnen.
		</details>
	{/if}

	<label for="salary">{billingBasis === 'hourly' ? 'Stundenlohn' : 'Tageslohn'}(netto)</label>
	<input type="number" min="0" step="0.01" bind:value={salary} id="salary" />
	<details>
		{billingBasis === 'hourly' ? 'Stundenlohn' : 'Tageslohn'} ohne Umsatzsteuer. Davon ist meistens die
		Rede wenn über den {billingBasis === 'hourly' ? 'Stundenlohn' : 'Tageslohn'} gesprochen wird.
	</details>

	<label for="businessCosts">Betriebsausgeben pro Jahr</label>
	<input type="number" bind:value={businessCosts} id="businessCosts" />
	<table>
		<tr
			><th>Betriebsausgabe</th>
			<th>Betrag (jährlich)</th></tr
		>
		{#each businessCostsItems as item}
			<tr>
				<td><input type="text" name="" id="" bind:value={item.name} /></td>
				<td><input type="number" name="" id="" bind:value={item.amount} /></td>
			</tr>{/each}
	</table>
	<button
		on:click={() => {
			businessCostsItems.push({
				name: 'Item #1',
				amount: 100
			});
			businessCostsItems = businessCostsItems;
		}}>Betriebsausgabe hinzufügen</button
	>
	<details>
		Als Betriebsausgaben werden Kosten bezeichnet, die du hast um deine Arbeit auszuführen. Bist du
		Software Entwickler? Dann brauchst du wahrscheinlich einen Computer. Aber auch Reisemittel sind
		Betriebskosten. Mehr dazu steht bei Github.
	</details>

	<form method="GET">
		<label for="incomeTax">Income Tax</label>
		<button type="submit">Steuer berechnen</button>
		<input type="number" bind:value={incomeTax} name="incomeTax" id="incomeTax" />
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
</fieldset>

<fieldset>
	<legend>Calculated</legend>
	<label for="daylieTurnover">Tagesverdienst</label>
	<input type="string" bind:value={daylieTurnover} id="daylieTurnover" disabled />

	<label for="yearlyTurnover">Jahresverdienst</label>
	<input type="string" bind:value={yearlyTurnover} id="yearlyTurnover" disabled />

	<label for="incomeBeforeTax">Einkommen vor Steuer</label>
	<input type="string" bind:value={incomeBeforeTax} id="incomeBeforeTax" disabled />

	<label for="income">Einkommen nach Steuer</label>
	<input type="string" bind:value={income} id="income" disabled />
</fieldset>

<style>
	input {
		display: block;
	}
</style>
