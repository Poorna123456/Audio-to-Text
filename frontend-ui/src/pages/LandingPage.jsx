import { Link } from "react-router-dom";
import { Mic, UploadCloud, Globe, AudioWaveform, Zap, FileText, Download, Play, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full bg-slate-50">
      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-24 md:pt-32 md:pb-32 overflow-hidden">
        {/* Subtle background effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column (Text) */}
          <div className="flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/60 shadow-sm text-slate-600 text-xs font-semibold tracking-wide mb-8 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              AI-Powered Transcription
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
              Turn your voice<br/>into text, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">instantly.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-xl leading-relaxed">
              Fast, multilingual speech transcription with industry-leading accuracy. No account required.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
              <Link 
                to="/transcribe" 
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-full overflow-hidden shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600/40 transition-all duration-300 transform hover:-translate-y-0.5 w-full sm:w-auto"
              >
                <Mic className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Start Transcribing
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center gap-6 mt-12 pt-8 border-t border-slate-200/60 text-sm font-medium text-slate-600">
              <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-blue-500"/> Fast</div>
              <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-500"/> Multilingual</div>
              <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-blue-500"/> Highly Accurate</div>
            </div>
          </div>
          
          {/* Right Column (Decorative UI) */}
          <div className="hidden lg:flex justify-center items-center relative">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <Mic className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">Recording</h3>
                    <p className="text-xs text-slate-500">English • Detected</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-xs font-semibold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span> Live
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="h-2 bg-slate-100 rounded-full w-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-1/3"></div>
                </div>
                <p className="text-lg text-slate-800 font-medium leading-snug">
                  "Welcome to VoiceText, the fastest way to turn your speech into highly accurate text using advanced AI models."
                </p>
                <div className="pt-4 flex justify-between items-center text-xs text-slate-400 font-medium">
                  <span>00:14</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                    <span className="w-1 h-5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                    <span className="w-1 h-4 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                    <span className="w-1 h-6 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '450ms'}}></span>
                    <span className="w-1 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '600ms'}}></span>
                  </div>
                  <span>01:00</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Everything you need</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="group bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <Mic className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Record Audio</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                Record speech directly from your microphone with crystal clear quality and real-time visualization.
              </p>
              <div className="h-10 w-full rounded-lg bg-slate-100 flex items-center justify-center gap-1 overflow-hidden">
                 {/* Decorative waveform */}
                 {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                   <div key={i} className={`w-1.5 bg-blue-300 rounded-full`} style={{height: `${Math.max(20, Math.random() * 100)}%`}}></div>
                 ))}
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="group bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Upload Audio</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                Upload an existing audio file for instant, highly accurate transcription processing.
              </p>
              <div className="h-10 w-full rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-xs font-semibold text-slate-400 bg-white">
                Drag & Drop
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="group bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Multilingual</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                Automatically detect the spoken language and generate a native-script transcript instantly.
              </p>
              <div className="flex gap-2">
                {['EN', 'HI', 'KN', 'ES', 'FR'].map(lang => (
                  <span key={lang} className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-500 shadow-sm">{lang}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Flow */}
      <section id="how-it-works" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">How It Works</h2>
            <p className="text-lg text-slate-500">The fastest path from voice to text.</p>
          </div>
          
          <div className="max-w-5xl mx-auto relative">
            {/* Desktop Horizontal Line */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 z-0"></div>
            
            <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-4 relative z-10">
              
              {/* Step 1 */}
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs font-bold text-slate-400 mb-4 tracking-widest">01</span>
                <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-700 shadow-sm mb-6 relative">
                  <AudioWaveform className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Record / Upload</h4>
                <p className="text-sm text-slate-500 text-center">Provide your audio source.</p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs font-bold text-blue-500 mb-4 tracking-widest">02</span>
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 mb-6 relative ring-4 ring-slate-50">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Faster-Whisper</h4>
                <p className="text-sm text-blue-600 font-medium text-center">Language Detection</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs font-bold text-slate-400 mb-4 tracking-widest">03</span>
                <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-700 shadow-sm mb-6 relative">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Transcript</h4>
                <p className="text-sm text-slate-500 text-center">AI generates the text.</p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs font-bold text-slate-400 mb-4 tracking-widest">04</span>
                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-md mb-6 relative">
                  <Download className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Download</h4>
                <p className="text-sm text-slate-500 text-center">Export to TXT or SRT.</p>
              </div>

            </div>
          </div>
          
          <div className="mt-20 text-center">
            <Link 
              to="/transcribe" 
              className="inline-flex items-center justify-center px-8 py-3 text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              Try it now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
