import https from 'https';
import { JSDOM } from 'jsdom';

const STQ_URLS = {
  eur: 'https://stooq.pl/q/?s=eurpln&c=1d&t=l&a=lg&b=0',
  usd: 'https://stooq.pl/q/?s=usdpln&c=1d&t=l&a=lg&b=0',
};

export default async function handler(req, res) {
  const { currency } = req.query;
  if (!currency || !['eur', 'usd'].includes(currency)) {
    return res.status(400).send('Invalid currency');
  }

  try {
    const html = await fetchHTML(STQ_URLS[currency]);
    const kurs = parseStooq(html);

    const now = new Date();
    const godzina = now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    const dzisiaj = now.toLocaleDateString('pl-PL');

    const waluta = currency === 'eur' ? 'euro' : 'dolara';
    const para = currency.toUpperCase() + '/PLN';
    const tytul = `Kurs ${waluta} ${dzisiaj} r. około godz. ${godzina}`;
    const lead = `Kurs ${waluta} ${dzisiaj} około godz. ${godzina} wynosił ${kurs} zł.`;

    const body = `
${lead}
Od początku dnia notowania ${para} pozostają ${currency === 'eur' ? 'relatywnie stabilne' : 'umiarkowanie zmienne'}, a inwestorzy śledzą zmiany na rynku walutowym. 

Aktualna wartość ${waluta} względem złotego to ${kurs} zł. Dane pochodzą z serwisu Stooq.pl i przedstawiają kurs rynkowy z ostatnich minut. 

Na dalszą część dnia wpływ mogą mieć m.in. dane makroekonomiczne ze strefy euro i USA, a także zmienność globalnych rynków finansowych. Zmiany kursów mogą być również powiązane z oczekiwaniami dotyczącymi stóp procentowych i decyzjami banków centralnych.

### Kurs ${para} od początku roku

Od początku 2024 roku kurs ${waluta} wobec złotego ulegał kilku wyraźnym wahaniom, wynikającym m.in. z sytuacji geopolitycznej, polityki monetarnej głównych banków centralnych i nastrojów inwestorów. Obserwujemy, że złoty reaguje przede wszystkim na dane o inflacji, decyzje RPP i wydarzenia w otoczeniu globalnym.

Na tle ostatnich miesięcy obecny kurs ${waluta} utrzymuje się ${currency === 'eur' ? 'blisko poziomów z marca' : 'w trendzie wzrostowym z końcówki maja'}.
    `;

    const article = `${tytul}

${lead}

${body.trim()}`;
    res.status(200).send(article);
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd podczas generowania artykułu');
  }
}

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let html = '';
      res.on('data', (chunk) => (html += chunk));
      res.on('end', () => resolve(html));
    }).on('error', reject);
  });
}

function parseStooq(html) {
  const dom = new JSDOM(html);
  const td = dom.window.document.querySelector('td.qBox');
  if (!td) throw new Error('Nie znaleziono kursu na stronie');
  return td.textContent.trim();
}
