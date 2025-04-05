// place files you want to import through the `$lib` alias in this folder.

export type FormatCurrencyOptions = { locales: Intl.LocalesArgument } & Intl.NumberFormatOptions;

export const formatCurrency = (value: number, options?: FormatCurrencyOptions) =>
	new Intl.NumberFormat(options?.locales ?? 'de-DE', {
		style: 'currency',
		currency: 'EUR',
		...options
	}).format(value);

export type FormatNumberOptions = { locales: Intl.LocalesArgument } & Intl.NumberFormatOptions;

export const formatNumber = (value: number, options?: FormatNumberOptions) =>
	new Intl.NumberFormat(options?.locales ?? 'de-DE', {
		maximumSignificantDigits: 1,
		...options
	}).format(value);

export type FormatUnitOptions = { locales: Intl.LocalesArgument } & Intl.NumberFormatOptions;

export const formatUnit = (
	value: number,
	unit: Intl.NumberFormatOptions['unit'],
	options?: FormatUnitOptions
) =>
	new Intl.NumberFormat(options?.locales ?? 'de-DE', {
		style: 'unit',
		...options,
		unit
	}).format(value);
