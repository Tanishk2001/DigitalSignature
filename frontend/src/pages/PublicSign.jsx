import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import API from '../utils/api';

function PublicSign() {
  const { token } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const pdfRef = useRef(null);

  useEffect(() => {
    // In a real app, you would verify the token and fetch the document
    // For now, we'll show a placeholder
    setLoading(false);
  }, [token]);

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Sign and submit
      const response = await API.post(`/signatures/external-sign`, {
        token,
        signerName,
        signerEmail,
      });

      alert('Document signed successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Signing failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Sign Document</h1>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-800">
              You have been invited to sign a document. Please review it below and provide your details to sign.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Your Name</label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">Your Email</label>
              <input
                type="email"
                value={signerEmail}
                onChange={(e) => setSignerEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {submitting ? 'Signing...' : 'Sign Document'}
            </button>
          </form>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Document Preview</h2>
            <div className="border border-gray-300 rounded p-4 bg-gray-100">
              <p className="text-center text-gray-600">PDF Preview would appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicSign;
