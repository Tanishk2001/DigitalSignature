import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import { X } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import API from '../utils/api';

function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [signingMode, setSigningMode] = useState(false);
  const [signatureText, setSignatureText] = useState('');
  const pdfRef = useRef(null);

  useEffect(() => {
    fetchDocument();
    fetchSignatures();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await API.get(`/documents/${id}`);
      setDocument(response.data.document);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch document');
    } finally {
      setLoading(false);
    }
  };

  const fetchSignatures = async () => {
    try {
      const response = await API.get(`/signatures/${id}`);
      setSignatures(response.data.signatures || []);
    } catch (err) {
      console.error('Failed to fetch signatures:', err);
    }
  };

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleSignatureClick = (e) => {
    if (!signingMode) return;

    const rect = pdfRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const coordinates = {
      page: currentPage - 1,
      x: Math.round(x),
      y: Math.round(y),
    };

    saveSignature(coordinates);
  };

  const saveSignature = async (coordinates) => {
    try {
      await API.post('/signatures/save', {
        documentId: id,
        coordinates,
        signatureText: signatureText || `Signed on ${new Date().toLocaleDateString()}`,
      });

      setSigningMode(false);
      setSignatureText('');
      fetchSignatures();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save signature');
    }
  };

  const handleCloseViewer = () => {
    navigate('/dashboard');
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">{document?.fileName}</h1>
            <p className="text-gray-600">Status: <span className="font-bold">{document?.status}</span></p>
          </div>
          <button
            onClick={handleCloseViewer}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Back
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          {/* PDF Viewer */}
          <div className="relative bg-white p-6 rounded-lg shadow-lg">
            <button
              onClick={handleCloseViewer}
              className="absolute right-4 top-4 rounded-full bg-black/80 text-white p-2 hover:bg-black"
              aria-label="Close PDF viewer"
            >
              <X size={18} />
            </button>

            <div className="pt-10">
              <div
                ref={pdfRef}
                onClick={handleSignatureClick}
                className={
                  (signingMode ? 'cursor-crosshair' : 'cursor-default') + ' relative'
                }
              >
                <Document
                  file={document?.filePath ? { url: document.filePath } : null}
                  onLoadSuccess={handleDocumentLoadSuccess}
                  onLoadError={(err) => setError(`PDF load error: ${err.message || err}`)}
                  onSourceError={(err) => setError(`PDF source error: ${err.message || err}`)}
                >
                  <Page pageNumber={currentPage} />
                </Document>

                {/* Render signature overlays for the current page */}
                {signatures
                  .filter((s) => s.coordinates && s.coordinates.page === currentPage - 1)
                  .map((s) => {
                    const x = s.coordinates.x || 0;
                    const y = s.coordinates.y || 0;
                    const signer = s.signerId?.email || s.signerEmail || s.signerId?.name || 'Signer';
                    return (
                      <div
                        key={s._id}
                        className="absolute text-xs px-2 py-1 rounded shadow"
                        style={{
                          left: x,
                          top: y,
                          transform: 'translate(-50%, -50%)',
                          background: s.status === 'signed' ? 'rgba(16,185,129,0.9)' : 'rgba(59,130,246,0.9)',
                          color: '#fff',
                          pointerEvents: 'none',
                          zIndex: 50,
                        }}
                      >
                        <div className="font-bold text-[11px]">{s.signatureText || signer}</div>
                        <div className="text-[10px]">{s.status}</div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {numPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                disabled={currentPage === numPages}
                className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          {/* Signature Panel */}
          <div className="bg-white p-6 rounded-lg shadow-lg h-fit">
            <h2 className="text-2xl font-bold mb-4">Sign Document</h2>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Signature Text</label>
              <input
                type="text"
                value={signatureText}
                onChange={(e) => setSignatureText(e.target.value)}
                placeholder="Your name or custom text"
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
            </div>

            <button
              onClick={() => setSigningMode(!signingMode)}
              className={`w-full py-2 rounded font-bold mb-4 ${
                signingMode
                  ? 'bg-red-600 text-white'
                  : 'bg-blue-600 text-white'
              }`}
            >
              {signingMode ? 'Cancel Signing' : 'Add Signature'}
            </button>

            {signingMode && (
              <p className="text-sm text-gray-600 mb-4">
                Click on the PDF to place your signature
              </p>
            )}

            <h3 className="text-xl font-bold mb-2">Signatures</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {signatures.map((sig) => (
                <div key={sig._id} className="bg-gray-100 p-3 rounded">
                  <p className="text-sm font-bold">{sig.signerEmail}</p>
                  <p className="text-xs text-gray-600">Status: {sig.status}</p>
                  <p className="text-xs text-gray-600">
                    Pos: ({sig.coordinates.x}, {sig.coordinates.y})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentDetail;
