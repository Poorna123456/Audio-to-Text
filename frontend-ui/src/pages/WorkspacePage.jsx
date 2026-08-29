import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MicRecorderComponent from "../components/ui/MicRecorder";

export default function WorkspacePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-5xl">
      <div className="mb-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        
        <div className="text-center sm:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Audio-to-Text Workspace</h1>
          <p className="mt-3 text-slate-500 max-w-2xl text-lg">
            Record your voice or upload an audio file to generate a fast, highly accurate transcript.
          </p>
        </div>
      </div>
      
      <div className="w-full flex justify-center">
        <MicRecorderComponent />
      </div>
    </div>
  );
}
