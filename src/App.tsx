import { useState, useEffect } from 'react';
import { initSDK, getAccelerationMode } from './runanywhere';
import { ChatTab } from './components/ChatTab';
import { VisionTab } from './components/VisionTab';
import { VoiceTab } from './components/VoiceTab';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Emergency from './components/Emergency';
import GeneralSupport from './components/GeneralSupport';
import Assistance from './components/Assistance';
import Footer from './components/Footer';

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
        <h2>Loading RunAnywhere SDK...</h2>
        <p>Initializing on-device AI engine</p>
      </div>
    );
  }

  const accel = getAccelerationMode();

  return (
    <div className="app">
      <header className="app-header sticky top-0 z-20 rounded-2xl border border-cyan-500/15 bg-[#031027]/80 px-4 py-3 backdrop-blur-md md:px-6 flex justify-between">
        <a href="/" className="flex flex-col items-center justify-between gap-2">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-cyan-300/80">FULLY OFFLINE</p>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">Emergency Assistant</h1>
        </a>
        {accel && <span className="badge">{accel === 'webgpu' ? 'WebGPU' : 'CPU'}</span>}
        <nav className="flex flex-wrap items-center gap-2">
          <a href="/emergency" className="rounded-lg border bg-red-500 text-white p-1  transition ">Emergency Mode</a>
          <a href="/general-support" className="hidden sm:block rounded-lg border bg-green-500 text-white p-1  transition ">Assistant Mode</a>
          <a href="/contact" className=" hidden sm:block rounded-lg border bg-blue-500 text-white p-1  transition ">Contact</a>
        </nav>
      </header>

      <Router>
        <Routes>
          <Route path='/' element={<Assistance />} />
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
