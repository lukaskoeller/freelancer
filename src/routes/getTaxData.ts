export const getTaxData = async (
	taxClass: string,
	calculatedSalary: number,
	workDays: number,
	businessCosts: number
) => {
	/**
	 * @url https://bmf-steuerrechner.de/interface/einganginterface.xhtml
	 * @example http://www.bmf-steuerrechner.de/interface/2025Version1.xhtml?code=extS2025&LZZ=1&RE4=2500000&STKL=1
	 */

	const RE4 = (Number(calculatedSalary) * Number(workDays) - Number(businessCosts)) * 100; // needs to be converted to EUR-Cents

	const queryParams = new URLSearchParams({
		code: 'extS2025',
		/** Steuerklasse */
		STKL: taxClass,
		/**
		 * Einkommen
		 * Voraussichtlicher Jahresarbeitslohn ohne sonstige Bezüge
		 * @url https://bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2025.xml.xhtml
		 */
		RE4: String(RE4),
		/**
		 * Lohnzahlungszeitraum
		 * @url https://bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2025.xml.xhtml
		 * 1 = Jahr | 2 = Monat | 3 = Woche | 4 = Tag
		 */
		LZZ: String(1)
	});

	const url = new URL(
		`http://www.bmf-steuerrechner.de/interface/2025Version1.xhtml?${queryParams.toString()}`
	);

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			cors: 'no-cors'
		}
	});
	const xmlData = await response.text();
	const wageTaxMatch = new RegExp(/<ausgabe name="LSTLZZ" value="(\d+)" type="STANDARD"\/>/).exec(
		xmlData
	);
	const wageTax = wageTaxMatch ? Number(wageTaxMatch[1]) / 100 : null; // convert from cents to euros

	const usedAllowanceMatch = new RegExp(/<ausgabe name="VFRB" value="(\d+)" type="DBA"\/>/).exec(
		xmlData
	);
	const usedAllowance = usedAllowanceMatch ? Number(usedAllowanceMatch[1]) / 100 : null; // convert from cents to euros

	return {
		wageTax: {
			labelShort: 'Lohnsteuer',
			label: 'Für den Lohnzahlungszeitraum einzubehaltende Lohnsteuer',
			name: 'LSTLZZ',
			value: wageTax,
			unit: 'EUR',
			style: 'currency'
		},
		usedAllowance: {
			labelShort: 'Verbrauchter Freibetrag',
			label: 'Verbrauchter Freibetrag bei Berechnung des laufenden Arbeitslohns',
			name: 'VFRB',
			value: usedAllowance,
			unit: 'EUR',
			style: 'currency'
		}
	} as const;
};
