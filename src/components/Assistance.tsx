import { Link } from "react-router-dom";

const capabilities = [
  {
    title: 'Smart Chat',
    description: 'Context-aware conversations with practical responses for daily questions, planning, and guidance.',
    tone: 'from-cyan-400/10 to-blue-500/5',
    page: '/general-support',
  },
  {
    title: 'Code Assistance',
    description: 'Help with coding tasks, debugging direction, and implementation ideas across your projects.',
    tone: 'from-violet-500/15 to-blue-500/10',
    page: '/general-support',
  },
  {
    title: 'Deep Analysis',
    description: 'Extract and summarize information from documents and visual content quickly.',
    tone: 'from-sky-500/10 to-slate-500/5',
    page: '/general-support',

  },
  {
    title: 'Voice & Vision',
    description: 'Interact naturally using audio and image-based workflows when typing is not ideal.',
    tone: 'from-blue-500/10 to-cyan-500/10',
    page: '/emergency',
  },
];

const Assistance = () => {
  return (
    <section className=" p-6 min-h-full w-full bg-[#030d24] pb-10 text-slate-100" style={{ paddingBottom: "4rem" }}>
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_8%,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_30%_45%,rgba(30,64,175,0.2),transparent_35%)]" />

      <main className="flex flex-col items-center gap-6 mx-auto w-full max-w-[1320px] px-6 py-12 md:px-10 lg:px-14 space-y-16 pb-20">

        {/* Hero */}
        <section className="flex w-full max-w-5xl flex-col gap-2 space-y-6 text-center items-center mx-auto mt-10">
          <h1 className="text-2xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Your Local AI Assistant for Emergencies and Everyday Support
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-300" style={{ margin: "8px" }}>
            Get instant help with a fully offline AI assistant designed for critical situations and general support. No internet required.
          </p>
          <div className="flex flex-wrap gap-5 justify-center mt-6">
            <Link
              to="/general-support"
              className="rounded-xl border w-[200px] h-[80px] px-6 py-3 ml-4 text-2xl font-semibold text-cyan-50 transition hover:-translate-y-0.5 bg-green-600 hover:bg-green-700 active:bg-green-800"
            >
              Start General Support
            </Link>
            <Link
              to="/emergency"
              className="rounded-xl border w-[200px] h-[80px] border-slate-600/70 px-6 py-3 text-2xl font-semibold text-slate-100 transition hover:-translate-y-0.5 bg-red-600 hover:bg-red-700 active:bg-red-800"
            >
              Open Emergency Mode
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto mt-12 grid w-full max-w-6xl items-center gap-10 rounded-2xl border border-cyan-500/10 bg-[#041332]/70 p-8 text-center shadow-[0_20px_60px_rgba(2,8,27,0.7)] md:grid-cols-3" >
          <div className="space-y-6 p-6 md:col-span-1" style={{ margin: 'auto' }}>
            <h2 className="text-3xl font-semibold mt-4">Local AI assistant built for real-world workflows.</h2>
            <p className="text-lg leading-relaxed text-slate-300">
              Communicate, analyze, and respond fast even when internet access is unstable. Privacy-first AI features with practical tools for speed and clarity.
            </p>
          </div>
          <div className="grid gap-6 p-4 md:col-span-2 md:grid-cols-1">
            {[
              { title: "Availability", value: "24/7 Local", desc: "Runs directly in your environment with no cloud dependency." },
              { title: "Privacy First", value: "Offline Ready", desc: "Designed for sensitive contexts where data handling and reliability matter." },
              { title: "Response", value: "Fast Action", desc: "Instant route access to emergency and general AI support experiences." }
            ].map((item) => (
              <article key={item.title} className="rounded-xl border hover:scale-105 border-cyan-500/15 bg-slate-900/65 p-6 space-y-3">
                <p className="text-xs uppercase tracking-wide text-cyan-300/75">{item.title}</p>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="mx-auto w-full max-w-6xl text-center p-4 rounded-2xl border border-cyan-500/10 bg-[#041332]/60 p-8 space-y-6">
          <h3 className="text-3xl font-bold">About Us</h3>
          <p className="text-lg leading-relaxed text-slate-300">
            We are building reliable AI experiences focused on assistance in critical and everyday situations. Our goal is to make intelligent support available regardless of connectivity, device constraints, or high-pressure conditions.
          </p>
        </section>

        {/* What We Are */}
        <section id="what-we-are" className="mx-auto w-full max-w-6xl text-center rounded-2xl border border-cyan-500/10 bg-[#041332]/60 px-8 py-10 pb-10 space-y-12">
          <h3 className="text-3xl font-bold">What We Are</h3>
          <p className="mx-auto max-w-5xl text-lg leading-relaxed text-slate-300">
            A Offline AI platform that combines conversational help, multimodal understanding, and emergency-focused tooling into one simple interface.
          </p>
          <div className="grid gap-10 mt-10 md:grid-cols-2" style={{ marginTop: '10px' }}>
            {capabilities.map((item) => (
              <Link
              to={item.page}
                key={item.title}
                className={`rounded-2xl border border-cyan-500/10 bg-gradient-to-br ${item.tone} p-8 shadow-[0_10px_30px_rgba(0,0,0,0.35)] space-y-5`}
              >
                <h4 className="text-2xl font-bold text-slate-100">{item.title}</h4>
                <p className="text-base leading-relaxed text-slate-300">{item.description}</p>
                
              </Link>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto w-full max-w-6xl text-center p-4 rounded-2xl border border-cyan-500/10 bg-[#041332]/60 p-8 space-y-8">
          <h3 className="text-3xl font-bold">Contact</h3>
          <p className="text-lg leading-relaxed text-slate-300">
            Want to collaborate, report issues, or request new features? Reach out and our team will get back to you.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <a href="mailto:support@runanywhere.ai" className="rounded-xl border border-cyan-500/25 bg-slate-900/65 p-6 transition hover:border-cyan-300/60 hover:bg-slate-900/80 space-y-2">
              <p className="text-xs uppercase tracking-wide text-cyan-300/75">Email</p>
              <p className="text-base font-semibold">codeverse@gmail.com</p>
            </a>
            <a href="tel:+910000000000" className="rounded-xl border border-cyan-500/25 bg-slate-900/65 p-6 transition hover:border-cyan-300/60 hover:bg-slate-900/80 space-y-2">
              <p className="text-xs uppercase tracking-wide text-cyan-300/75">Phone</p>
              <p className="text-base font-semibold">+91 00000 00000</p>
            </a>
            <div className="rounded-xl border border-cyan-500/25 bg-slate-900/65 hover:border-cyan-300/60 hover:bg-slate-900/80 p-6 space-y-2">
              <p className="text-xs uppercase tracking-wide text-cyan-300/75">Office</p>
              <p className="text-base font-semibold">Codeverse</p>
              <p className="text-sm text-slate-400">Remote-first operations</p>
            </div>
          </div>
        </section>

      </main>
    </section>
  )
}

export default Assistance
