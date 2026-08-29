import Waveform from "./Waveform";
import { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { Globe } from "lucide-react";


const MicRecorderComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [srtData, setSrtData] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [showWaveformPlayer, setShowWaveformPlayer] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const audioCtxRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const waveformRef = useRef(null);

  const togglePlay = () => {
    if (!waveformRef.current) return;
    waveformRef.current.playPause();
    setIsPlaying(waveformRef.current.isPlaying());
  };

  const handleAudioFinish = () => {
    setIsPlaying(false);
  };

  const drawWave = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bufferLength = analyserRef.current.fftSize;

    analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#3b82f6";
    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArrayRef.current[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    animationRef.current = requestAnimationFrame(drawWave);
  };

  const startRecording = async () => {
    setAudioURL(null);
    setShowWaveformPlayer(false);
    setIsPlaying(false);
    setIsLoading(false);
    setTranscript("");
    setSrtData("");
    setDetectedLanguage("");
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    audioCtxRef.current = new AudioContext();
    sourceRef.current = audioCtxRef.current.createMediaStreamSource(stream);
    analyserRef.current = audioCtxRef.current.createAnalyser();
    analyserRef.current.fftSize = 2048;

    const bufferLength = analyserRef.current.fftSize;
    dataArrayRef.current = new Uint8Array(bufferLength);

    sourceRef.current.connect(analyserRef.current);
    drawWave();

    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunksRef.current.push(e.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);

      setShowWaveformPlayer(true);

      cancelAnimationFrame(animationRef.current);
      if (analyserRef.current) analyserRef.current.disconnect();
      if (sourceRef.current) sourceRef.current.disconnect();
      if (audioCtxRef.current) audioCtxRef.current.close();
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioURL(url);
      setShowWaveformPlayer(true);
      setIsPlaying(false);
      setIsLoading(false);
      setTranscript("");
      setSrtData("");
      setDetectedLanguage("");
    }
  };

  const processAudio = async () => {
    if (!audioURL) return alert("Please record or upload an audio file first.");

    setIsLoading(true);
    setTranscript("");
    setSrtData("");
    setDetectedLanguage("");

    try {
      const response = await fetch(audioURL);
      const blob = await response.blob();
      // Groq requires a File object with a proper extension
      const file = new File([blob], "recording.webm", { type: "audio/webm" });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", "whisper-large-v3");
      formData.append("response_format", "verbose_json");
      if (selectedLanguage !== "auto") {
        formData.append("language", selectedLanguage);
      }

      // Call our secure Vercel API endpoint instead of Groq directly
      const groqResponse = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!groqResponse.ok) {
        const errorData = await groqResponse.json();
        throw new Error(errorData.error?.message || "Failed to transcribe audio.");
      }

      const result = await groqResponse.json();
      
      setTranscript(result.text || "");
      
      // Generate SRT from segments
      if (result.segments) {
        const formatTime = (seconds) => {
          const pad = (num, size) => num.toString().padStart(size, '0');
          const h = Math.floor(seconds / 3600);
          const m = Math.floor((seconds % 3600) / 60);
          const s = Math.floor(seconds % 60);
          const ms = Math.floor((seconds - Math.floor(seconds)) * 1000);
          return `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)},${pad(ms, 3)}`;
        };
        
        let srtContent = "";
        result.segments.forEach((segment, index) => {
          const startFmt = formatTime(segment.start);
          const endFmt = formatTime(segment.end);
          srtContent += `${index + 1}\n${startFmt} --> ${endFmt}\n${segment.text.trim()}\n\n`;
        });
        setSrtData(srtContent);
      }
      
      if (result.language) {
        setDetectedLanguage(result.language.toUpperCase());
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Error during transcription:", err);
      setIsLoading(false);
      alert("Transcription failed: " + err.message);
    }
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 p-6 sm:p-12 bg-white shadow-2xl shadow-slate-200/40 rounded-[2rem] w-full mx-auto border border-slate-100/50 transition-all relative overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>

      {/* Audio Visualizer / Player */}
      <div className="w-full relative z-10">
        {!showWaveformPlayer ? (
          <div className="relative w-full h-64 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 hover:bg-slate-100/50 hover:border-blue-300 transition-all group overflow-hidden flex flex-col items-center justify-center">
            {isRecording ? (
              <div className="flex flex-col items-center justify-center w-full h-full relative z-20">
                <div className="absolute top-6 left-6 bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 animate-pulse shadow-sm shadow-red-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Live Recording
                </div>
                <canvas ref={canvasRef} width={800} height={128} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply" />
                <div className="text-red-500 font-medium text-lg mt-12 animate-pulse z-10 relative">Recording in progress...</div>
              </div>
            ) : !audioURL ? (
              <div className="flex flex-col items-center justify-center text-center p-6 relative z-10 pointer-events-none">
                <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Drop your audio here</h3>
                <p className="text-sm text-slate-500 mb-1">or use the controls below to start</p>
                <p className="text-xs text-slate-400 font-medium mt-2">MP3 • WAV • M4A • WEBM</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="p-6 bg-white border border-slate-100 shadow-xl shadow-slate-200/30 rounded-3xl backdrop-blur-sm relative z-10">
            <Waveform ref={waveformRef} audioUrl={audioURL} onFinish={handleAudioFinish} />
            <div className="flex justify-center mt-6">
              <Button 
                onClick={togglePlay} 
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-slate-900/20 active:scale-95 flex items-center gap-2"
              >
                {isPlaying ? (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>
                ) : (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
                {isPlaying ? "Pause Audio" : "Play Audio"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row w-full justify-center items-center gap-4 mt-2 relative z-10">
        
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          className={`${isRecording ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 shadow-none" : "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5"} border border-transparent px-8 py-3.5 rounded-full font-semibold transition-all flex items-center gap-2.5 w-full sm:w-auto justify-center`}
        >
          {isRecording ? (
            <>
              <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
              Stop Recording
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
              Record
            </>
          )}
        </Button>
        
        <div className="hidden sm:block w-px h-8 bg-slate-200"></div>
        
        <label htmlFor="file-upload" className="flex items-center justify-center gap-2 cursor-pointer bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm px-8 py-3.5 rounded-full font-semibold transition-all w-full sm:w-auto">
          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          Upload File
          <input id="file-upload" type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
        </label>
        
        <div className="hidden sm:block w-px h-8 bg-slate-200"></div>

        <div className="relative w-full sm:w-auto">
          <Globe className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select 
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="appearance-none bg-white border border-slate-200 text-slate-700 pl-10 pr-10 py-3.5 rounded-full font-semibold transition-all shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-full sm:w-auto cursor-pointer hover:bg-slate-50"
          >
            <option value="auto">Auto-Detect</option>
            <option value="hi">Hindi</option>
            <option value="kn">Kannada</option>
            <option value="te">Telugu</option>
            <option value="ta">Tamil</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
          <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>

      {/* Process Button */}
      <div className="w-full mt-4 pt-6 border-t border-slate-100 relative z-10">
        <Button
          onClick={processAudio}
          disabled={!audioURL || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg px-4 py-5 rounded-2xl font-bold shadow-xl shadow-blue-600/20 transition-all hover:shadow-blue-600/30 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex justify-center items-center gap-3 overflow-hidden relative group/btn"
        >
          {isLoading ? (
            <>
              <div className="absolute inset-0 bg-blue-700/50">
                <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite]"></div>
              </div>
              <div className="flex items-center gap-2 relative z-10">
                <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{animationDelay: '0ms'}}></span>
                <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{animationDelay: '150ms'}}></span>
                <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{animationDelay: '300ms'}}></span>
              </div>
              <span className="relative z-10 tracking-wide ml-2">Processing your audio...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              <span className="tracking-wide">Transcribe Audio</span>
            </>
          )}
        </Button>
      </div>

      {/* Results Section */}
      <div className="w-full mt-6 relative z-10">
        {isLoading && !transcript && (
          <div className="w-full p-8 border border-slate-100 rounded-3xl bg-slate-50 flex flex-col items-center justify-center text-center animate-pulse">
            <Globe className="w-8 h-8 text-blue-400 mb-4 animate-[spin_3s_linear_infinite]" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">✦ Analyzing speech...</h3>
            <p className="text-slate-500 text-sm">Generating highly accurate transcript.</p>
          </div>
        )}

        {transcript && !isLoading && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden">
              {/* Header */}
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> 
                  Transcript
                </h3>
                {detectedLanguage && (
                  <span className="bg-white text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 flex items-center gap-1.5 shadow-sm uppercase">
                    {detectedLanguage} <Globe className="w-3 h-3 text-blue-500" />
                  </span>
                )}
              </div>
              
              {/* Content */}
              <div className="p-6">
                <Textarea
                  className="w-full h-64 resize-y border-0 focus:ring-0 text-slate-800 text-lg leading-relaxed p-0 bg-transparent placeholder:text-slate-300"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              {/* Footer */}
              <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-xs text-slate-400 font-medium">
                  {transcript.split(/\s+/).filter(w => w.length > 0).length} words
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => navigator.clipboard.writeText(transcript)}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    Copy
                  </Button>
                  <Button 
                    onClick={() => downloadFile(transcript, "transcript.txt", "text/plain")}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    TXT
                  </Button>
                  <Button 
                    onClick={() => downloadFile(srtData, "transcript.srt", "text/plain")}
                    disabled={!srtData}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    SRT
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MicRecorderComponent;