# BeeTales Resume Builder

BeeTales Resume Builder is a free, open-source web application for creating professional resumes without accounts, payments, watermarks, or uploading personal information to servers.

This branch contains **Stages 1 through 5** of the project: a complete resume editor with four templates, validated backups, local ATS guidance, measured multi-page preview, and browser-native PDF output that preserves real text.

## Privacy

Text and preferences are processed and stored in the browser through `localStorage`, using the key `beetales_resume_builder_data`. Profile photos are resized, compressed, and stored separately in IndexedDB. The application has no backend, analytics, accounts, or cloud synchronization.

Clearing browser storage also removes the saved resume. Export a JSON backup before clearing browser data if you want to restore or transfer the resume later.

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
- Validated JSON import and export, including an optional compressed photo.
- Version-aware migrations for older BeeTales resume files.
- Clear validation for email addresses, phone numbers, and web links.
- Permanent deletion of all locally stored resume data.
- Local ATS-oriented review with transparent recommendations and deductions.
- Measured page count with visible page-break guides and overflow warnings.
- Fit-to-width, 100%, zoom-in, and zoom-out preview controls.
- Browser-native PDF saving and printing with selectable text and links.
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
npm test
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

**Save PDF** and **Print** use the browser's native print dialog. Choose **Save as PDF** as the destination to preserve selectable text, searchable content, and working links. Browser print engines may produce small layout differences, so review the print preview before saving.

The preview measures the rendered document, displays page boundaries, and warns when the last page is very full or the resume exceeds two pages. Print styles avoid splitting headings and compact entries where the browser supports those rules.

## ATS review

The review runs entirely in the browser. It checks contact details, summary length, experience completeness, achievements, education, skills, link formats, page count, hidden essential sections, contrast, photos, and two-column usage. Every deduction is shown beside the related observation.

The score is only a writing and layout aid. It does not predict or guarantee acceptance by an applicant tracking system or recruiter.

## JSON backups

Open **Data and backups** in the editor to export a portable `.json` file. Import validates its format, limits its size, checks the data version, and asks before replacing the current resume. The file is created and read entirely in the browser; it is never uploaded to BeeTales or another service.

Backups may include the compressed profile photo. Treat the downloaded file as personal information and store it securely.

## Next stages

The finalization stage will add PWA support, offline caching, accessibility refinement, broader interface tests, and production optimization.

## License

Distributed under the MIT License. See `LICENSE`.
