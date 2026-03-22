import React, { useState } from 'react'
import { ChatTab } from './ChatTab'
import { VoiceTab } from './VoiceTab';
import { Link } from 'react-router-dom';

const GeneralSupport = () => {

  return (
    <section className="relative w-full overflow-hidden rounded-3xl border border-cyan-500/20 bg-[radial-gradient(circle_at_12%_8%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_90%_88%,rgba(14,165,233,0.14),transparent_45%),linear-gradient(165deg,#020b1f_0%,#031536_45%,#021028_100%)] p-3 shadow-[0_25px_80px_rgba(1,10,35,0.8)] sm:p-4">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(2,12,36,0.2)_100%)]" />

      <div className="relative grid gap-3 xl:grid-cols-[220px_1fr]">
        <aside className="hidden rounded-2xl border border-cyan-400/15 bg-slate-950/45 p-4 backdrop-blur-sm xl:block" style={{ "padding": "10px" }}>

          <div className="mt-6 flex flex-col gap-6 rounded-2xl border border-slate-700/80 bg-slate-900/65 p-3 text-sm">
            <Link className="rounded-lg border flex justify-center w-[full] h-[2rem] p-2 bg-red-500 text-white transition hover:bg-red-600" to="/emergency">
              Emergency Mode
            </Link>
            <Link className="rounded-lg border w-[full] h-[2rem] flex justify-center  bg-green-500 text-white p-4 transition hover:bg-green-600" to="/general-support">
              General Purpose AI
            </Link>
            <Link className="rounded-lg border bg-blue-500 w-[full] h-[2rem] flex justify-center text-white p-2 transition hover:bg-blue-600" to="/">
              Home
            </Link>
          </div>
        </aside>

        <div className="flex flex-col rounded-2xl border border-cyan-400/15 bg-slate-950/35 p-10 backdrop-blur-sm sm:p-4 lg:p-5" style={{ "padding": "10px" }}>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl">Hi, I am your Emergency Assistant.</h2>
              <p className="mt-2 text-sm text-slate-400 sm:text-base">How can I help you?</p>
            </div>

          </div>

          <div className="flex flex-1 flex-col rounded-2xl border border-slate-700/80 bg-slate-900/65 p-3 shadow-xl sm:p-4">
            <p className="mb-3 rounded-xl border border-slate-700/80 bg-slate-800/60 p-3 text-sm text-slate-200">
              Ask anything and get instant guidance. Upload a file for context-aware answers.
            </p>
            <div className="mt-auto flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/80 p-3 shadow-lg">
              <ChatTab />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GeneralSupport