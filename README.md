# 🗺️ RoadTo
🚀 **Live Demo:** [roadto.vercel.app](https://frontend-one-kappa-41.vercel.app/)

**Sätt mål, ta små steg och följ din utveckling – i din egen takt.**

*Set goals, take small steps and track your progress – at your own pace.*

RoadTo är en webbapp för att sätta mål, dela upp dem i mindre steg och följa sin utveckling. Projektet är byggt som en portfolioapplikation med fokus på användarupplevelse, tydlig struktur och en genomtänkt design.

---

## 🇸🇪 Svenska

### ✨ Funktioner

**Mål och framsteg**
- Skapa, visa, redigera och radera mål.
- Dela upp mål i mindre delsteg.
- Markera delsteg som avklarade.
- Automatisk beräkning av framsteg i procent.
- Visuell överblick över mål och hur långt man har kommit.
- Spara data lokalt med `localStorage` eller i Supabase.

**En personlig utvecklingsresa**

RoadTo utgår från tanken att ett mål inte bara handlar om slutresultatet, utan också om vägen dit. Designen ska göra det enkelt att se vad man arbetar mot, vilka steg man har tagit och hur resan utvecklas över tid.

### 🎨 UX och design

- **Lugn och tydlig design:** en luftig layout med genomtänkt typografi och en varm, nedtonad färgpalett.
- **Visuell överblick:** mål och delsteg presenteras på ett sätt som gör framstegen lätta att förstå.
- **Flexibilitet:** användaren ska kunna ändra sina mål och delsteg när förutsättningarna förändras.
- **Responsiv design:** fungerar på både mobil och desktop.
- **Tillgänglighet:** fokus på tydlig struktur och användbara gränssnitt.

### 🧱 Arkitektur

```text
frontend/src
├── components/       Återanvändbara UI-komponenter
├── context/          Delat state och temahantering
├── lib/
│   ├── logik.ts      Funktioner för mål och framsteg
│   ├── supabase.ts   Kommunikation med Supabase
│   └── lokalLagring.ts
│                     Lokal lagring av data
├── types/            Delade TypeScript-typer
└── App.tsx           Applikationens huvudkomponent
```

**Design- och teknikval**

- **Komponentbaserad struktur:** gränssnittet delas upp i mindre komponenter som kan återanvändas.
- **Separation av logik och UI:** beräkningar och funktionalitet hålls separerade från presentationskomponenterna.
- **Lokal lagring:** appen kan användas utan att en databas är konfigurerad.
- **Supabase:** används för att lagra och hämta data från en databas.

### 🛠️ Teknikstack

React · TypeScript · Vite · Tailwind CSS · Supabase

### 🚀 Kom igång

```bash
git clone https://github.com/Shayaa63/RoadTo.git
cd RoadTo/frontend
npm install
```

Skapa en `.env.local`-fil utifrån `.env.example` och fyll i dina Supabase-uppgifter om du vill använda databasen.

Starta utvecklingsservern:

```bash
npm run dev
```

Utan Supabase-konfiguration används lokal lagring.

### 🔭 Framtida utveckling

- En visuell resekarta där mål representeras som destinationer och delsteg som vägen dit.
- En personlig journal för anteckningar och reflektioner.
- Möjlighet att samla viktiga händelser och tidigare framsteg.
- Användarkonton med Supabase Auth.
- RLS-policyer för att hantera användarnas egna data.
- Tester av affärslogiken.

---

## 🇬🇧 English

**RoadTo** is a goal-tracking web application built as a portfolio project. It helps users define goals, break them down into smaller steps and track their progress.

The project focuses on user experience, a clear structure and a calm visual design.

### ✨ Features

- Create, view, edit and delete goals.
- Break goals down into smaller steps.
- Mark steps as completed.
- Automatically calculate progress.
- View goals and progress visually.
- Store data locally using `localStorage` or in Supabase.

### 🎨 Design approach

RoadTo is built around the idea that progress is about more than reaching the final destination. The experience should help users see the steps they have taken, reflect on their progress and adjust their direction when needed.

The design aims to feel calm, clear and personal rather than competitive or overwhelming.

### 🧱 Architecture

The application uses reusable React components, shared TypeScript types and a separate library for application logic and data handling.

- `components/` – reusable UI components.
- `context/` – shared state and theme handling.
- `lib/` – application logic, Supabase integration and local storage.
- `types/` – shared TypeScript types.
- `App.tsx` – main application component.

### 🛠️ Tech stack

React · TypeScript · Vite · Tailwind CSS · Supabase

### 🚀 Getting started

See the Swedish section above for setup instructions.

### 🔭 Future improvements

- A visual journey map for goals and steps.
- A personal journal for notes and reflections.
- User authentication with Supabase Auth.
- Row Level Security policies.
- Unit tests for application logic.

---

*RoadTo is an ongoing portfolio project.*
