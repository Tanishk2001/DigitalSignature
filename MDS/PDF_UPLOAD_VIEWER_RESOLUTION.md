# PDF Upload + Viewer Resolution

## Problem

The frontend was able to upload a PDF, but the document viewer failed to load the PDF correctly.

## Root cause

- The React PDF viewer (`react-pdf`) needed an explicit PDF worker configuration.
- The viewer also needed a proper `file` source object when loading the uploaded file.
- The backend upload response did not return the document file path, so the frontend could not reliably load the uploaded asset.

## Fixes applied

### Backend
- Updated `backend/src/controllers/documentController.js` to return the uploaded document's:
  - `filePath`
  - `fileSize`
  - `mimeType`

### Frontend
- Added `react-pdf` worker configuration to `frontend/src/App.jsx`:
  ```js
  import { pdfjs } from 'react-pdf';
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();
  ```
- Updated `frontend/src/pages/DocumentDetail.jsx` to load the PDF with an explicit URL:
  ```js
  <Document file={{ url: document.filePath }} ...>
  ```
- Added error handlers to show PDF source or load errors explicitly.

## How to confirm it works

1. Start the backend on port `5000`.
2. Start the frontend on port `5174`.
3. Upload a PDF from the dashboard.
4. Open the document detail view.
5. The PDF should render inside the viewer rather than failing to load.

## Added UI support

- The viewer now has a document removal flow in `frontend/src/pages/DocumentDetail.jsx`.
- If you want a cross-style option to remove the document, use the "Remove Document" button inside the detail page.
- The frontend also includes the digital signature UI in the Document Detail screen, where you can enable signing mode and click on the PDF to add signature coordinates.

## Notes

- The PDF file is served from the backend via `/uploads/...` and proxied by Vite.
- If the app still cannot load the PDF, check the browser network tab for `GET /uploads/...` and verify the backend is serving that file.
- The signature panel is already present in the document detail page, so the frontend is covering the digital signature functionality.
