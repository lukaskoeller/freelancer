// place files you want to import through the `$lib` alias in this folder.

export type FormatCurrencyOptions = { locales: Intl.LocalesArgument } & Intl.NumberFormatOptions;

export const formatCurrency = (
	value: number,
	{ locales, ...options }: FormatCurrencyOptions = {
		locales: 'de-DE',
		style: 'currency',
		currency: 'EUR'
	}
) => new Intl.NumberFormat(locales, options).format(value);
