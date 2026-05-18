import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { pdfjs } from 'react-pdf';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DocumentDetail from './pages/DocumentDetail';
import PublicSign from './pages/PublicSign';
import AuditTrail from './pages/AuditTrail';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/document/:id" element={<DocumentDetail />} />
        <Route path="/sign/:token" element={<PublicSign />} />
        <Route path="/audit" element={<AuditTrail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
