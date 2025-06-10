import axios from 'axios';

const apiKey = '9e43368e71def7c2fc24b0085298971f';   
const baseUrl = 'https://v6.exchangerate-api.com/v6/';

async function getExchangeRate(currency) {
  try {
    // Tworzymy URL z kluczem API
    const url = `${baseUrl}${apiKey}/latest/${currency}`;
    
    // Pobieramy dane z API
    const { data } = await axios.get(url);

    // Sprawdzamy, czy odpowiedź jest sukcesem
    if (data.result === 'success') {
      const rate = data.conversion_rates['PLN'];  // Pobieramy kurs względem PLN
      return rate;
    } else {
      throw new Error('Błąd podczas pobierania kursu.');
    }
  } catch (error) {
    console.error('Błąd API:', error);
    return null;
  }
}

// Funkcja obsługująca zapytania API
export default async function handler(req, res) {
  const { currency } = req.query;  // Odbieramy walutę (EUR, USD)
  
  if (!currency || !['EUR', 'USD'].includes(currency)) {
    return res.status(400).send('Niepoprawna waluta.');
  }

  const rate = await getExchangeRate(currency);

  if (rate) {
    res.status(200).json({ rate });
  } else {
    res.status(500).json({ error: 'Nie udało się pobrać kursu.' });
  }
}
