import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Digital Signature System</h1>
          <p className="text-xl mb-8">
            Secure, efficient, and legally binding digital document signing
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-900"
            >
              Sign In
            </Link>
          </div>
        </div>
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white text-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">🔒 Secure</h3>
            <p>Enterprise-grade security for your documents</p>
          </div>
          <div className="bg-white text-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">⚡ Fast</h3>
            <p>Sign documents in seconds, not days</p>
          </div>
          <div className="bg-white text-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">✅ Legal</h3>
            <p>Legally binding signatures across jurisdictions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
