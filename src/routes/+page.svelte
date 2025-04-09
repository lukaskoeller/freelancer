<script lang="ts">
	import { formatCurrency } from '$lib';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let workDays = $state(198);
	let workHours = $state(7.5);
	let salary = $state(80);
	let insuranceCosts = $state(600 * 12);
	let incomeTax = $state(form?.wageTax.value ?? 0);

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

<div class="grid">
	<div class="hero">
		<div class="inner-hero">
			<h1 class="title">
				<span style="color: var(--color-brand-primary-base)">Freelancer.</span> Selbstständigkeit finanziell
				durchgerechnet.
			</h1>
			<div class="text nc-flow">
				<p>
					<strong>
						Rechne dir aus, ab wann die Selbstständigkeit oder ein Kleingewerbe finanziell mit
						deinem Job als Angestellter mithalten kann.
					</strong>
				</p>
				<p>
					Der Schritt in die Selbstständigkeit ist für viele nicht leicht. Viele befinden sich in
					einem unbefristeten Arbeitsverhältnis. Hinzu kommen finanzielle und private
					Verpflichtungen wie eine Familie oder ein Kredit. Meist geht mit der Vollzeitbeschäftigung
					auch ein gewisser Lebensstandard einher, den man nicht so einfach aufgeben möchte.
				</p>
				<p>
					Dieser Rechner hilft dir dabei eine bessere Vorstellung von deinen Einnahmen und Ausgaben
					zu bekommen. Dies geschieht zum Beispiel anhand dem von dir veranschlagten Stunden- oder
					Tagessatz. Auch die Arbeitszeit und Steuern werden berücksichtigt. So kannst du besser
					vergleichen, welche Bedingungen erfüllt sein müssen, damit du mit deiner Selbstständigkeit
					deinen Lebensstandard halten kannst.
				</p>
			</div>
		</div>
	</div>
	<div class="container">
		<form method="POST" action="?/incomeTax" class="nc-stack">
			<div class="nc-card">
				<!-- COMPONENT-START: nc-fieldset -->
				<fieldset class="nc-fieldset" aria-describedby="fieldset-standard-description">
					<legend class="main-legend nc-legend nc-input-label">Arbeitsaufwand</legend>
					<div class="nc-stack -far">
						<!-- COMPONENT-START: nc-input-field -->
						<div class="nc-input-field">
							<label for="workDays" class="nc-stack">
								<span class="nc-input-label">Arbeitstage im Jahr</span>
								<span class="nc-hint">Als Richtwert kannst du von 198 Tagen ausgehen</span>
								<!-- <span class="nc-input-error">Render errors here if there is an issue with the input.</span> -->
							</label>
							<input
								id="workDays"
								class="nc-input"
								aria-required="true"
								bind:value={workDays}
								autocomplete="off"
								type="number"
								min="0"
								step="1"
							/>
						</div>
						<!-- COMPONENT-END: nc-input-field -->
						<!-- <details>
							<summary>Herleitung</summary>
							Im Durchschnitt arbeitet ein/e Deutsche/r 198 Tage im Jahr. Von 365 Kalendertagen sind beispielsweise
							folgende Tage abzuziehen: 104 Tage Wochenende 📅, 11 Feiertage 🎉, 14 krank 🤒, 10 Tage 👨‍🍼🤱, 28
							Urlaub 🌴 = 198 Tage
						</details> -->
						<!-- COMPONENT-START: nc-radio-field -->
						<fieldset class="nc-fieldset nc-input-field nc-radio-field">
							<legend class="nc-legend nc-stack">
								<span class="nc-input-label">Abrechnungsmodell</span>
								<!-- <span class="nc-input-error"
									>Render errors here if there is an issue with the input.</span
								> -->
							</legend>
							<!-- Options can be multiple -->
							<div class="nc-checkbox-wrapper nc-input-field">
								<label for="radio-option-1" class="nc-stack" data-label>
									<span class="nc-input-label">Stündlich</span>
								</label>
								<input
									data-input
									id="billingBasis-hourly"
									class="nc-input-radio"
									type="radio"
									value="hourly"
									name="billingBasis"
									bind:group={billingBasis}
								/>
							</div>
							<div class="nc-checkbox-wrapper nc-input-field">
								<label for="radio-option-2" class="nc-stack" data-label>
									<span class="nc-input-label">Täglich</span>
								</label>
								<input
									data-input
									id="billingBasis-daily"
									class="nc-input-radio"
									type="radio"
									value="daily"
									name="billingBasis"
									bind:group={billingBasis}
								/>
							</div>
							<!-- End Options -->
						</fieldset>
						<!-- COMPONENT-END: nc-input-field -->
						<!-- COMPONENT-START: nc-input-field -->
						{#if billingBasis === 'hourly'}
							<div class="nc-input-field">
								<label for="workHours" class="nc-stack">
									<span class="nc-input-label">Arbeitsstunden pro Tag</span>
									<span class="nc-hint"
										>Das entspricht {workHours * 5} Stunde{workHours * 5 === 1 ? '' : 'n'} pro Arbeitswoche</span
									>
									<!-- <span class="nc-input-error"
										>Render errors here if there is an issue with the input.</span
									> -->
								</label>
								<input
									id="workHours"
									bind:value={workHours}
									class="nc-input"
									aria-required="true"
									autocomplete=""
									type="number"
									min="0"
									max="24"
									step="0.5"
								/>
								<!-- <details>
									<summary>Hinweis</summary>
									Du solltest vor Antritt deiner Tätigkeit dringend klären wie viele Wochenstunden von
									dir erwartet werden bzw. du abrufen kannst. Bei einem Vollzeit-Job kannst du mit 38 bis
									40 Stunden pro Woche rechnen.
								</details> -->
							</div>
							<!-- COMPONENT-END: nc-input-field -->
						{/if}
					</div>
				</fieldset>
				<!-- COMPONENT-END: nc-fieldset -->
			</div>
			<div class="nc-card">
				<!-- COMPONENT-START: nc-fieldset -->
				<fieldset class="nc-fieldset" aria-describedby="fieldset-standard-description">
					<legend class="main-legend nc-legend nc-input-label">Einnahmen & Ausgaben</legend>
					<div class="nc-stack -far">
						<!-- COMPONENT-START: nc-input-field -->
						<div class="nc-input-field">
							<label for="salary" class="nc-stack">
								<span class="nc-input-label">{billingBasisLabel} (netto)</span>
								<span class="nc-hint">{billingBasisLabel} ohne Umsatzsteuer</span>
								<!-- <span class="nc-input-error"
									>Render errors here if there is an issue with the input.</span
								> -->
							</label>
							<input
								id="salary"
								bind:value={salary}
								class="nc-input"
								aria-required="true"
								autocomplete=""
								type="number"
								min="0"
								step="1"
							/>
						</div>
						<!-- COMPONENT-END: nc-input-field -->
						<div class="nc-input-field">
							<span class="nc-input-label">Betriebsausgaben pro Jahr</span>
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
												{item.value}
											</td>
											<td>
												{formatCurrency(item.amount)}
											</td>
										</tr>
									{/each}
								</tbody>
								<tfoot>
									<tr>
										<td></td>
										<td>
											<strong>
												<output
													aria-label="Summe Betriebsausgaben"
													name="result"
													for={businessCostsItems.map((item) => item.formValueName).join(' ')}
													>{formatCurrency(businessCosts)}</output
												>
											</strong>
										</td>
									</tr>
									<tr>
										<td> @todo </td>
									</tr>
								</tfoot>
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
							<!-- <details>
								<summary>Erläuterung</summary>
								Als Betriebsausgaben werden Kosten bezeichnet, die du hast um deine Arbeit auszuführen. Bist du
								Software Entwickler? Dann brauchst du wahrscheinlich einen Computer. Aber auch Reisemittel sind
								Betriebskosten. Mehr dazu steht bei Github.
							</details> -->
						</div>
					</div>
				</fieldset>
				<!-- COMPONENT-END: nc-fieldset -->
			</div>
			<div class="nc-card">
				<!-- COMPONENT-START: nc-fieldset -->
				<fieldset class="nc-fieldset" aria-describedby="fieldset-standard-description">
					<legend class="main-legend nc-legend nc-input-label">Steuern</legend>
					<div class="nc-stack -far">
						<!-- COMPONENT-START: nc-input-field: Textarea -->
						<div class="nc-input-field">
							<label for="taxClass" class="nc-stack">
								<span class="nc-input-label">Steuerklasse</span>
							</label>
							<select class="nc-select" id="taxClass" name="taxClass" aria-required={true}>
								<option value="1">Klasse 1</option>
								<option value="2">Klasse 2</option>
								<option value="3" selected>Klasse 3</option>
								<option value="4">Klasse 4</option>
								<option value="5">Klasse 5</option>
								<option value="6">Klasse 6</option>
							</select>
							<!-- <details>
							<summary>Hinweis zu Steuerklassen</summary>
							In Deutschland gibt es sechs Steuerklassen (Lohnsteuerklassen) die das Finanzamt dem Arbeitnehmer
							zuordnet. Die Steuerklasse richtet sich in erster Linie nach dem Familienstand.
							<ul>
								<li>Steuerklasse 1: Alleinstehende, ein Job, keine Kinder</li>
								<li>Steuerklasse 2: Alleinerziehende, höherer Entlastungsbetrag</li>
								<li>Steuerklassen 3 bis 5: Verheiratete, je nach Verdienst</li>
								<li>Steuerklasse 6: Mehrere sozialversicherungspflichtige Jobs</li>
							</ul>
						</details> -->
						</div>
						<!-- COMPONENT-END: nc-input-field: Textarea -->
						<input type="hidden" bind:value={calculatedSalary} name="calculatedSalary" />
						<input type="hidden" bind:value={workDays} name="workDays" />
						<input type="hidden" bind:value={businessCosts} name="businessCosts" />
						<!-- <details>
							Auf deine Einnahmen abzüglich Betriebskosten musst du Einkommenssteuer bezahlen.
						</details> -->
						<!-- COMPONENT-START: nc-input-field -->
						<div class="nc-input-field">
							<label for="insuranceCosts" class="nc-stack">
								<span class="nc-input-label">Versicherungskosten pro Jahr</span>
								<span class="nc-hint"
									>Zum Beispiel Krankversicherung, Berufshaftpflichtversicherung, etc.</span
								>
								<!-- <span class="nc-input-error"
									>Render errors here if there is an issue with the input.</span
								> -->
							</label>
							<input
								id="insuranceCosts"
								bind:value={insuranceCosts}
								class="nc-input"
								aria-required="true"
								autocomplete="off"
								type="number"
								min="0"
							/>
						</div>
						<!-- COMPONENT-END: nc-input-field -->
					</div>
				</fieldset>
				<!-- COMPONENT-END: nc-fieldset -->
			</div>
			<button class="nc-button" type="submit">Berechnen</button>
		</form>
		<div class="results">
			<!-- <div class="nc-cluster">
				<div>
					<div class="nc-input-label kpi-label">Einkommen vor Steuer</div>
					<output class="kpi" for="incomeBeforeTax">{formatCurrency(incomeBeforeTax)}</output>
				</div>

				<div>
					<div class="nc-input-label kpi-label">Einkommen nach Steuer</div>
					<output class="kpi" for="income">{formatCurrency(income)}</output>
				</div>
			</div> -->
			<dl class="calculation">
				<dt id="yearly-turnover">Einkommen (jährlich)</dt>
				<dd>
					<output aria-describedby="yearly-turnover" for="incomeBeforeTax">
						{formatCurrency(yearlyTurnover)}
					</output>
				</dd>
				<dt class="text-ident" id="business-costs">Betriebskosten</dt>
				<dd>
					<output aria-describedby="business-costs">
						{formatCurrency(businessCosts * -1)}
					</output>
				</dd>
				<dt id="income-before-tax">Einkommen vor Steuern</dt>
				<dd>
					<output aria-describedby="income-before-tax">
						{formatCurrency(incomeBeforeTax)}
					</output>
				</dd>
				<dt class="text-ident" id="income-tax">Lohnsteuer</dt>
				<dd>
					<output aria-describedby="income-tax">
						{formatCurrency(incomeTax * -1)}
					</output>
				</dd>
				<dt class="text-ident" id="insurance-costs">Versicherungskosten</dt>
				<dd>
					<output aria-describedby="insurance-costs">
						{formatCurrency(insuranceCosts * -1)}
					</output>
				</dd>
				<dt id="income-after-tax">Einkommen nach Steuern</dt>
				<dd>
					<output aria-describedby="income-after-tax">
						{formatCurrency(income)}
					</output>
				</dd>
			</dl>
		</div>
	</div>
</div>

<style>
	@custom-media --sm-n-above (width >= 480px);
	@custom-media --md-n-above (width >= 768px);
	@custom-media --lg-n-above (width >= 1024px);
	@custom-media --xl-n-above (width >= 1440px);

	:root {
		--root-width: min(90rem, 100%);
	}

	.grid {
		margin-inline: auto;
		padding: var(--spacing-base);
		display: grid;
		gap: var(--spacing-base);

		@media (--lg-n-above) {
			gap: var(--spacing-far);
		}
	}

	.hero {
		min-block-size: 50vh;
		min-block-size: 50svh;
		background-color: var(--color-surface-base);
		padding-inline: var(--spacing-far);
		padding-block: var(--spacing-farthest);
		border-radius: calc(var(--border-radius-large) * 3);
	}

	.inner-hero {
		inline-size: var(--root-width);
		margin-inline: auto;
		display: flex;
		justify-content: space-between;
		gap: var(--spacing-farthest);
		flex-wrap: wrap;
	}

	.title {
		flex: 1 1 14ch;
		color: var(--color-text-base);
		font-size: var(--font-size-large);

		@media (--sm-n-above) {
			font-size: var(--font-size-largest);
		}

		@media (--md-n-above) {
			font-size: var(--font-size-display);
		}

		& span {
			opacity: 0.6;
		}
	}

	.text {
		flex: 1 1 70ch;
		column-count: 1;
		column-gap: var(--spacing-farthest);

		@media (--md-n-above) {
			column-count: 2;
		}
	}

	.container {
		inline-size: var(--root-width);
		margin-inline: auto;
		display: grid;
		gap: var(--spacing-base);
		align-items: start;

		@media (--lg-n-above) {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: var(--spacing-far);
		}
	}

	.main-legend {
		font-weight: var(--font-weight-strong);
		font-size: var(--font-size-large);
	}

	.results {
		position: sticky;
		bottom: var(--spacing-base);
		margin-inline: auto;
		inline-size: min(40ch, 100%);
		border-radius: var(--border-radius-large);
		background-color: color-mix(in lch, var(--color-surface-base), transparent 60%);
		backdrop-filter: blur(var(--spacing-base));
		padding: var(--spacing-base);
		border: var(--border-width-thin) solid var(--color-border-base);

		@media (--lg-n-above) {
			top: var(--spacing-base);
			bottom: auto;
			inline-size: 100%;
		}
	}

	.calculation {
		--measure-base: auto;

		display: grid;
		grid-auto-columns: 1fr;
		font-size: var(--font-size-small);

		@media (--lg-n-above) {
			font-size: var(--font-size-base);
		}

		& dt {
			grid-column: 1;
			padding-block: 0.2lh;

			&:not(:last-of-type) {
				border-bottom: var(--border-width-thin) solid var(--color-border-muted);
			}
		}

		& dd {
			grid-column: 2;
			text-align: end;
			padding-block: 0.2lh;

			&:not(:last-of-type) {
				border-bottom: var(--border-width-thin) solid var(--color-border-muted);
			}
		}
	}

	.text-ident {
		font-weight: var(--font-weight-default);
		padding-inline-start: 2ch;
	}

	.kpi-label {
		display: block;
		inline-size: fit-content;
	}
	.kpi {
		font-size: var(--font-size-large);
		font-weight: var(--font-weight-strong);
		color: var(--color-primary);
	}
</style>
