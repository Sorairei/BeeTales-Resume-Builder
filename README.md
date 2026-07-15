# BeeTales Resume Builder

BeeTales Resume Builder is a free, open-source web application for creating professional resumes without accounts, payments, watermarks, or uploading personal information to servers.

This branch contains **Stage 1** of the project: a stable functional foundation with a personal-information editor, professional summary, work experience, ATS Classic preview, sample data, an empty resume option, and automatic local saving.

## Privacy

All information is processed and stored in the browser through `localStorage`, using the key `beetales_resume_builder_data`. The application has no backend, analytics, accounts, or cloud synchronization.

Clearing browser storage also removes the saved resume. JSON backup import and export will be added in a later stage.

## Available features

- Responsive personal-information editor.
- Professional summary with counters and guidance.
- Work experience with achievements, duplication, and deletion.
- Real-time ATS Classic preview.
- English as the default language.
- English, Spanish, Polish, and Portuguese interfaces.
- Professional sample resume for first-time visitors.
- Option to start with an empty resume.
- Automatic local saving with a status indicator.
- Browser-based printing.
- BeeTales swamp visual identity, official logo, and Sora mascot.

## Technologies

- React
- TypeScript
- Vite
- Lucide Icons
- CSS organized by visual components

## Local development

```bash
npm install
npm run dev
```

To verify a production build:

```bash
npm run build
npm run preview
```

## GitHub Pages

The `.github/workflows/deploy.yml` workflow automatically builds and publishes from `main`. In GitHub, select **Settings → Pages → Source → GitHub Actions**.

Vite calculates `base` automatically from `GITHUB_REPOSITORY` during GitHub Actions. Project sites are published under `/repository-name/`, while repositories named `username.github.io` use `/`. Local development uses `/`.

The production output in `dist` is fully static. React, Vite, and TypeScript are used only during development and compilation; GitHub Pages requires no Node.js server, functions, secrets, or route rewrites.

## Structure

```text
src/
├── components/   Editor, common controls, and preview
├── data/         Empty resume, sample data, and translations
├── hooks/        Main state and automatic local saving
├── services/     Local persistence
├── styles/       Interface, ATS preview, and print styles
├── types/        Complete TypeScript data model
└── utils/        Dates and identifiers
```

## ATS and PDF compatibility

The initial template uses a single column, linear reading order, and real selectable text. This improves readability for ATS software but does not guarantee acceptance by an automated system or recruiter.

At this stage, output uses the browser's print function. Advanced PDF export and visual multi-page management will be implemented later.

## Next stages

Future releases will add the remaining sections, reordering, additional templates, visual customization, JSON import and export, validation, ATS analysis, advanced PDF output, tests, and PWA support.

## License

Distributed under the MIT License. See `LICENSE`.
