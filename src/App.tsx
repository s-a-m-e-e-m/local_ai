import { useState, useEffect } from 'react';
import { initSDK, getAccelerationMode } from './runanywhere';
import { ChatTab } from './components/ChatTab';
import { VisionTab } from './components/VisionTab';
import { VoiceTab } from './components/VoiceTab';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Emergency from './components/Emergency';
import GeneralSupport from './components/GeneralSupport';
import Assistant from './components/Assistant';
import Footer from './components/Footer';

function RedirectToHomeOnReload() {
  const navigate = useNavigate();

  useEffect(() => {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    const isReload = navigationEntry?.type === 'reload';

    if (isReload && window.location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return null;
}

export function App() {
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);

  useEffect(() => {
    initSDK()
      .then(() => setSdkReady(true))
      .catch((err) => setSdkError(err instanceof Error ? err.message : String(err)));
  }, []);

  if (sdkError) {
    return (
      <div className="app-loading">
        <h2>SDK Error</h2>
        <p className="error-text">{sdkError}</p>
      </div>
    );
  }

  if (!sdkReady) {
    return (
      <div className="app-loading">
        <div className="spinner" />
        <h2>Loading Emergency Assistant AI...</h2>
        <p>Initializing on-device AI engine</p>
      </div>
    );
  }

  const accel = getAccelerationMode();

  return (
    <div className="app">
      <Router>
        <RedirectToHomeOnReload />
        <header className="app-header sticky top-0 z-20 rounded-2xl border border-cyan-500/15 bg-[#031027]/80 px-4 py-3 backdrop-blur-md md:px-6 flex justify-between">
          <Link to="/" className="flex flex-col items-center justify-between gap-2">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-cyan-300/80">FULLY OFFLINE</p>
            <h1 className="text-xl font-bold tracking-tight md:text-2xl">Emergency Assistant</h1>
          </Link>
          {accel && <span className="badge">{accel === 'webgpu' ? 'WebGPU' : 'CPU'}</span>}
          <nav className="flex flex-wrap items-center gap-2">
            <Link to="/emergency" className="rounded-lg border bg-red-500 text-white p-1  transition ">Emergency Mode</Link>
            <Link to="/general-support" className="hidden sm:block rounded-lg border bg-green-500 text-white p-1  transition ">Assistant Mode</Link>
          </nav>
        </header>

        <Routes>
          <Route path='/' element={<Assistant />} />
          <Route path="/vision" element={<VisionTab />} />
          <Route path="/voice" element={<VoiceTab />} />
          <Route path='/emergency' element={<Emergency />} />
          <Route path='/general-support' element={<GeneralSupport />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}
