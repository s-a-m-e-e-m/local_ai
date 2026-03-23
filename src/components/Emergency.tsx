import { VisionTab } from './VisionTab';
import { VoiceTab } from './VoiceTab';

export default function Emergency() {
  return (
    <div className="flex flex-col gap-8 p-6 bg-gray-900 min-h-screen text-white" style={{ "margin": "0.3rem", padding: "0.5rem" }}>
      {/* Tabs Section */}
      <h3 className='mt-6 text-center text-xl font-semibold' >In an Emergency! Don't Panic Just Ask the Assistant and get instant help.</h3>
      <div className="flex gap-6 justify-center flex-col md:flex-row">
        <div style={{ margin: "0.5rem" }}>
          <h2>Start the Voice Assistant for audio guidance</h2>
          <VoiceTab />
        </div>
        <div style={{ margin: "0.5rem" }}>
          <h2>Start the Vision Assistant to analyze your environment</h2>
          <VisionTab />
        </div>
      </div>

      {/* Emergency Heading */}
      <h2 className="text-2xl font-bold text-center text-red-400" style={{ marginTop: "1.5rem" }}>
        🚨 Call Emergency Services
      </h2>

      {/* Emergency Buttons Grid */}
      <div className="mt-6 grid w-fit max-w-6xl grid-cols-1 justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3" style={{ margin: 'auto' }}>
        <a href="tel:1077" className="block w-[320px] max-w-[90vw] rounded-lg py-4 px-6 text-lg font-semibold 
           bg-red-600 hover:bg-red-700 active:bg-red-800 
           text-center shadow-lg transform hover:scale-105 
           transition duration-200 ease-in-out"><span className='block'>Disaster Helpline</span><span>Number: 1077</span></a>
        <a href="tel:1091" className="block w-[320px] max-w-[90vw] rounded-lg py-4 px-6 text-lg font-semibold 
           bg-red-600 hover:bg-red-700 active:bg-red-800 
           text-center shadow-lg transform hover:scale-105 
           transition duration-200 ease-in-out"><span className='block'>Women Helpline</span><span>Number: 1091</span></a>
        <a href="tel:1098" className="block w-[320px] max-w-[90vw] rounded-lg py-4 px-6 text-lg font-semibold 
           bg-red-600 hover:bg-red-700 active:bg-red-800 
           text-center shadow-lg transform hover:scale-105 
           transition duration-200 ease-in-out"><span className='block'>Child Helpline</span><span>Number: 1098</span></a>
        <a href="tel:112" className="block w-[320px] max-w-[90vw] rounded-lg py-4 px-6 text-lg font-semibold 
           bg-red-600 hover:bg-red-700 active:bg-red-800 
           text-center shadow-lg transform hover:scale-105 
           transition duration-200 ease-in-out"><span className='block'>Police</span><span>Number: 112</span></a>
        <a href="tel:101" className="block w-[320px] max-w-[90vw] rounded-lg py-4 px-6 text-lg font-semibold 
           bg-red-600 hover:bg-red-700 active:bg-red-800 
           text-center shadow-lg transform hover:scale-105 
           transition duration-200 ease-in-out"><span className='block'>Fire & Rescue</span><span>Number: 101</span></a>
        <a href="tel:102" className="flex w-[320px] max-w-[90vw] flex-col items-center justify-center rounded-lg py-4 px-6 text-lg font-semibold 
           bg-red-600 hover:bg-red-700 active:bg-red-800 
           text-center shadow-lg transform hover:scale-105 
           transition duration-200 ease-in-out"><span className='block'>Ambulance</span><span>Number: 102</span></a>
      </div>
    </div>
  );
}
