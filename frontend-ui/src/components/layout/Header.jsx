import { Link } from "react-router-dom";
import { Mic } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl transition-all">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl text-white shadow-sm shadow-blue-600/20 group-hover:shadow-blue-600/40 group-hover:-translate-y-0.5 transition-all duration-300">
            <Mic className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">VoiceText</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Home</Link>
          <a href="/#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How It Works</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            to="/transcribe" 
            className="text-sm font-medium bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Mic className="w-4 h-4" /> Start Transcribing
          </Link>
        </div>
      </div>
    </header>
  );
}
