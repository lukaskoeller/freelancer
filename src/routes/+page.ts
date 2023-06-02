import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
	ignoreAttributes: false
});

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, url }) {
  const params = url.searchParams;

  const calculatedSalary = params.get('calculatedSalary');
  const workDays = params.get('workDays');
  const businessCosts = params.get('businessCosts');
  const taxClass = params.get('taxClass');

  if (!calculatedSalary || !workDays || !businessCosts) return { incomeTax: 0 }

  const RE4 = (
    Number(calculatedSalary)
    * Number(workDays)
    - Number(businessCosts)
  ) * 100; // needs to be converted to EUR-Cents

  const STKL = taxClass;

  try {
    /**
     * As defined here: https://www.bmf-steuerrechner.de/interface/einganginterface.xhtml
     * The XML reponse is defined here: https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2022.xml.xhtml
     */

    /** @url https://www.bmf-steuerrechner.de/interface/einganginterface.xhtml#:~:text=Der%20Code%20ist%20g%C3%BCltig%20bis%20zum%2015.01.2024. */
    if (new Date() > new Date('2024/01/16')) throw Error('The current used request url is not valid anymore. Please ask the maintainer to update it.');

    const res = await fetch(
      `https://www.bmf-steuerrechner.de/interface/2023Version1.xhtml?code=ext2023&LZZ=1&RE4=${RE4}&STKL=${STKL}`,
      // {
      //   headers: {
      //     'Content-Type': 'text/xml;charset=UTF-8',
      //     'Access-Control-Allow-Origin': '*',
      //   }
      // }
    );

    // The API return XML
    const raw = await res.text();

    // The returned XML contains excape chars (\) that need to be removed before parsing
    const parsedXml = parser.parse(raw.replace('\\', ''));

    // LSTLZZ = Lohnzahlungszeitraum einzubehaltende Lohnsteuer in Cents:
    const { '@_value': lstlzz } = parsedXml.lohnsteuer.ausgaben.ausgabe.find(
      (item) => item['@_name'] === 'LSTLZZ'
    );
    console.log({ parsed: parsedXml.lohnsteuer.ausgaben.ausgabe });
    
    console.log({ incomeTax: lstlzz });
    
    return { incomeTax: lstlzz };
  } catch (error) {
    return {
      error: 'Beim Laden Lohnsteuer ist etwas schiefgelaufen :/',
      debugMsg: JSON.stringify(error, null, 2),
    }
  }
}