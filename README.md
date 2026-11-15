# Offerings Counter

A simple app for counting church offerings. Pick a service, add categories such as Tithe or Love Offering, enter how many of each denomination you have, and the totals update as you type. Everything is stored on the device, so it works without internet.

## Features

- Create a service with the upcoming Sunday prefilled
- Add offering categories and naira denominations
- Totals update live for each denomination, offering, and service
- Confirmation before deleting services, categories, or counted denominations
- Read-only report, laid out for copying by hand
- Data is saved locally and survives app restarts

## Tech stack

- [Expo](https://expo.dev) with TypeScript and expo-router
- expo-sqlite with Drizzle ORM
- Uniwind (Tailwind CSS for React Native)
- React Native Reusables for UI components
- @react-native-community/datetimepicker for date selection

## Getting started

Requirements: Node.js LTS and npm.

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `a` (Android) or `w` (web).

If styles or new files don't appear, restart with a cleared cache:

```bash
npx expo start --clear
```

## Database

The schema lives in `db/schema.ts`. After changing it, generate a migration:

```bash
npx drizzle-kit generate
```

Migrations run automatically when the app starts.

## Project structure

```
app/                      screens (expo-router)
components/               reusable UI and dialogs
components/ui/            React Native Reusables components
db/                       schema, database client, and queries
drizzle/                  generated migrations (do not edit by hand)
lib/                      money, dates, report logic, and presets
global.css                theme colors
```

## Customizing

- **Denominations, categories, and service labels:** edit `lib/presets.ts`.
- **Colors:** edit the variables in `global.css`.
- **Report logic:** see `lib/report.ts`. The report screen only displays its output.

## Building for a device

Expo Go is fine for testing. For a standalone build, see the Expo docs on development builds (`npx expo run:android`).

## License

Add your license here, or remove this section.
