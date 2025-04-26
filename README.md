# Kalkulator Podatku od Transakcji Walutowych

Aplikacja do obliczania podatku dochodowego od transakcji w walutach obcych, korzystająca z aktualnych kursów walut Narodowego Banku Polskiego.

## Funkcje

- Dodawanie pojedynczych transakcji walutowych
- Masowe dodawanie transakcji z pliku JSON
- Automatyczne pobieranie kursów walut z API NBP
- Konwersja wszystkich transakcji na złotówki (PLN)
- Obliczanie podatku (19% stawka)
- Szczegółowe podsumowanie transakcji

## Technologie

- Next.js 13+
- React 18+
- TypeScript
- Tailwind CSS

## Instalacja

```bash
# Klonowanie repozytorium
git clone https://github.com/twoje-repo/currency-tax-calculator.git
cd currency-tax-calculator

# Instalacja zależności
npm install

# Uruchomienie w trybie deweloperskim
npm run dev
```

Aplikacja będzie dostępna pod adresem [http://localhost:3000](http://localhost:3000)

## Jak używać

1. Dodaj transakcję, podając walutę, kwotę i datę
2. Alternatywnie, wklej listę transakcji w formacie JSON
3. Kliknij "Oblicz podatek"
4. Sprawdź wyniki przeliczenia i kwotę podatku do zapłacenia

## Format danych JSON

```json
[
  {
    "currency": "EUR",
    "amount": 25.69,
    "data": "15-03-2023"
  },
  {
    "currency": "USD",
    "amount": 100,
    "data": "22-04-2023"
  }
]
```

## API NBP

Aplikacja korzysta z oficjalnego API Narodowego Banku Polskiego do pobierania kursów walut.
Dokumentacja API: [http://api.nbp.pl/](http://api.nbp.pl/)

## Zastrzeżenie

Aplikacja służy jedynie do celów informacyjnych i nie stanowi profesjonalnej porady podatkowej. Zawsze konsultuj się z księgowym lub doradcą podatkowym w kwestiach rozliczenia podatku.

## Licencja

MIT
