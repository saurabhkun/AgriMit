import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-abstract-lavender py-32 px-4 text-center border-b border-gray-200">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-abstract-black">
            AgriMit Crop Intelligence
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-2xl mx-auto">
            Detect crop diseases and get AI-powered recovery guidance.
          </p>
          
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/analyze" className="px-8 py-4 bg-abstract-blue text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors shadow-lg">
              Analyze Image &rarr;
            </Link>
            <Link to="/dashboard" className="px-8 py-4 bg-white text-abstract-black border border-gray-300 font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-lg">
              View Dashboard
            </Link>
          </div>
        </section>

        <section className="py-24 px-4 bg-white">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 bg-abstract-lavender rounded-lg flex items-center justify-center text-2xl">📸</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Instant Disease Detection</h3>
                <p className="text-gray-600 leading-relaxed">Upload a leaf image and get instant analysis from our custom AI model trained on Apple, Grape, and Tomato crops.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 bg-abstract-lavender rounded-lg flex items-center justify-center text-2xl">🩺</div>
              <div>
                <h3 className="text-xl font-bold mb-2">AI Recovery Plans</h3>
                <p className="text-gray-600 leading-relaxed">Receive actionable organic and chemical recovery steps based on real-time disease detection.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 bg-abstract-lavender rounded-lg flex items-center justify-center text-2xl">📊</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Monitor History</h3>
                <p className="text-gray-600 leading-relaxed">Keep track of your field's health over time with our secure history and analytics dashboard.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 bg-abstract-lavender rounded-lg flex items-center justify-center text-2xl">🔒</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Secure Accounts</h3>
                <p className="text-gray-600 leading-relaxed">Your crop data and history are securely saved. Access it anywhere via your protected dashboard.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
