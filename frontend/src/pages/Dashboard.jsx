import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import API from '../utils/api';
import { isAuthenticated } from '../utils/auth';

function Dashboard() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchDocuments();
  }, [navigate]);

  const fetchDocuments = async () => {
    try {
      const response = await API.get('/documents');
      setDocuments(response.data.documents || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const response = await API.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setDocuments([response.data.document, ...documents]);
      setUploadFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Delete this document from your account?')) return;

    try {
      await API.delete(`/documents/${documentId}`);
      setDocuments((prev) => prev.filter((doc) => doc._id !== documentId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete document');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Upload Document</h2>
          <form onSubmit={handleFileUpload} className="flex gap-4">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setUploadFile(e.target.files[0])}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
            <button
              type="submit"
              disabled={uploading || !uploadFile}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-100 border-b">
            <h2 className="text-2xl font-bold">My Documents</h2>
          </div>
          {documents.length === 0 ? (
            <p className="p-6 text-center text-gray-600">No documents yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left">File Name</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Uploaded</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3">{doc.fileName}</td>
                      <td className="px-6 py-3">
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-3">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-3 flex gap-3 items-center">
                        <button
                          onClick={() => navigate(`/document/${doc._id}`)}
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc._id)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
