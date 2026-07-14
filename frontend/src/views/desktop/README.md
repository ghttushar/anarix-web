# Desktop View

This folder is the home of the desktop-only presentation layer.

Phase 1 status: the desktop variant continues to render directly from the existing
`src/pages/*` and `src/components/layout/*` tree without changes. As the tablet
and mobile variants gain their own dedicated screens (Phases 2–7), shared logic
will be lifted into `src/app/*` and per-view shells will live in their respective
`src/views/<variant>/` folder.

Do not put cross-view business logic here.
