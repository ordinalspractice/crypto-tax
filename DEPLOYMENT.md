# Instrukcja wdrożenia aplikacji na Vercel

## Wdrożenie z GitHub

1. Załóż konto na [Vercel](https://vercel.com) jeśli jeszcze go nie masz.
2. Umieść kod w repozytorium na GitHub.
3. W panelu Vercel, kliknij "Import Project".
4. Wybierz opcję "Import Git Repository" i podaj URL swojego repozytorium.
5. Vercel automatycznie wykryje, że to projekt Next.js i zastosuje odpowiednie ustawienia.
6. Kliknij "Deploy" aby zakończyć proces.

## Wdrożenie z linii komend

1. Zainstaluj CLI Vercel:

   ```bash
   npm install -g vercel
   ```

2. Zaloguj się do Vercel:

   ```bash
   vercel login
   ```

3. Przejdź do folderu projektu i wdróż aplikację:

   ```bash
   cd currency-tax-calculator
   vercel
   ```

4. Odpowiedz na pytania w kreatorze wdrożenia.

## Zmienne środowiskowe

Ta aplikacja nie wymaga żadnych zmiennych środowiskowych, ponieważ korzysta z publicznego API NBP.

## Domena niestandardowa

Aby skonfigurować niestandardową domenę:

1. W panelu projektu na Vercel, przejdź do zakładki "Settings".
2. Wybierz "Domains".
3. Dodaj swoją domenę i postępuj zgodnie z instrukcjami, aby skonfigurować rekordy DNS.

## Notatki

- Aplikacja jest w pełni statyczna i nie wymaga własnego backendu.
- Wszystkie zapytania do API NBP są wykonywane z przeglądarki klienta.
- Vercel automatycznie generuje HTTPS dla Twojej aplikacji.
