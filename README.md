# BeeTales Resume Builder

BeeTales Resume Builder is a free, open-source web application for creating professional resumes without accounts, payments, watermarks, or uploading personal information to servers.

This branch contains **Stages 1, 2, and 3** of the project: a stable resume editor with all content sections, section visibility and ordering, four professional templates, visual customization, optional local photo storage, sample data, an empty resume option, and automatic local saving.

## Privacy

Text and preferences are processed and stored in the browser through `localStorage`, using the key `beetales_resume_builder_data`. Profile photos are resized, compressed, and stored separately in IndexedDB. The application has no backend, analytics, accounts, or cloud synchronization.

Clearing browser storage also removes the saved resume. JSON backup import and export will be added in a later stage.

## Available features

- Responsive personal-information editor.
- Professional summary with counters and guidance.
- Work experience with achievements, duplication, and deletion.
- Education, skills, languages, certifications, projects, courses, and references.
- Custom sections for publications, awards, volunteering, and other content.
- Section visibility controls that preserve hidden information.
- Drag-and-drop section ordering with mouse, touch, and keyboard support.
- Accessible up/down ordering controls for individual entries.
- Reference details or an “available upon request” display mode.
- Four real-time templates: ATS Classic, Modern, Executive, and Two-column.
- Professional color palettes, custom accent color, and contrast guidance.
- Font, size, density, margins, divider, and A4/Letter controls.
- Optional profile photo with crop positioning and zoom, stored in IndexedDB.
- English as the default language.
- English, Spanish, Polish, and Portuguese interfaces.
- Professional sample resume for first-time visitors.
- Option to start with an empty resume.
- Automatic local saving with a status indicator.
- Browser-based printing.
- BeeTales swamp visual identity, official swamp-space background, logo, and Sora mascot.

## Technologies

- React
- TypeScript
- Vite
- Lucide Icons
- dnd-kit
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

The `.github/workflows/deploy.yml` workflow automatically enables, builds, and publishes GitHub Pages from `main`. If repository policy prevents automatic enablement, select **Settings → Pages → Source → GitHub Actions** once.

Vite calculates `base` automatically from `GITHUB_REPOSITORY` during GitHub Actions. Project sites are published under `/repository-name/`, while repositories named `username.github.io` use `/`. Local development uses `/`.

The production output in `dist` is fully static. React, Vite, and TypeScript are used only during development and compilation; GitHub Pages requires no Node.js server, functions, secrets, or route rewrites.

## Structure

```text
src/
├── components/   Editor, common controls, and preview
├── data/         Empty resume, sample data, and translations
├── hooks/        Main state and automatic local saving
├── services/     Local text and image persistence
├── styles/       Interface, ATS preview, and print styles
├── types/        Complete TypeScript data model
└── utils/        Dates and identifiers
```

## ATS and PDF compatibility

ATS Classic uses a single column, linear reading order, real selectable text, and intentionally hides photos. The other templates retain real text but use more visual layouts, so their ATS compatibility may vary. No template can guarantee acceptance by an automated system or recruiter.

At this stage, output uses the browser's print function. Advanced PDF export and visual multi-page management will be implemented later.

## Next stages

Future releases will add JSON import and export, validation, ATS analysis, advanced PDF output, automated tests, and PWA support.

## License

Distributed under the MIT License. See `LICENSE`.
