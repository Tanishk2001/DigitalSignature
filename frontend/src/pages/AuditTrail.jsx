import { useState, useEffect } from 'react';
import API from '../utils/api';
import { isAuthenticated } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

function AuditTrail() {
  const navigate = useNavigate();
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchAuditTrail();
  }, [navigate]);

  const fetchAuditTrail = async () => {
    try {
      const response = await API.get('/audit/user/trail');
      setAudits(response.data.audits || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch audit trail');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Audit Trail</h1>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {audits.length === 0 ? (
            <p className="p-6 text-center text-gray-600">No audit records yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left">Action</th>
                    <th className="px-6 py-3 text-left">Details</th>
                    <th className="px-6 py-3 text-left">IP Address</th>
                    <th className="px-6 py-3 text-left">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {audits.map((audit) => (
                    <tr key={audit._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 font-bold">{audit.action}</td>
                      <td className="px-6 py-3">
                        <pre className="text-xs bg-gray-100 p-2 rounded max-w-xs overflow-auto">
                          {JSON.stringify(audit.details, null, 2)}
                        </pre>
                      </td>
                      <td className="px-6 py-3">{audit.ipAddress}</td>
                      <td className="px-6 py-3">
                        {new Date(audit.timestamp).toLocaleString()}
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

export default AuditTrail;
