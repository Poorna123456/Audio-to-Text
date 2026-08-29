import os
from dotenv import load_dotenv
load_dotenv()

import time
import gradio as gr
import spaces
import torch # CRITICAL: PyTorch must be imported before CTranslate2 to load libcublas.so.12 from pip into the global symbol table
from faster_whisper import WhisperModel

# Global Whisper Model config
model_size = os.getenv("WHISPER_MODEL_SIZE", "small")
device = "cuda"
compute_type = "float16"

def format_time(seconds: float) -> str:
    """Format seconds into SRT timestamp format (HH:MM:SS,mmm)"""
    hours = int(seconds / 3600)
    minutes = int((seconds % 3600) / 60)
    secs = int(seconds % 60)
    millis = int(round((seconds - int(seconds)) * 1000))
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

@spaces.GPU(duration=30)
def process_speech_to_text(uploaded_audio_path: str, language: str):
    if not uploaded_audio_path:
        return "Error: No audio provided", "", ""

    # CTranslate2 manages its own CUDA memory entirely outside of PyTorch.
    # Because ZeroGPU dynamically attaches and detaches the GPU between requests, 
    # a persistent global CTranslate2 model would hold invalid CUDA pointers after the first request.
    # Therefore, we MUST instantiate the model locally per request so it cleans up properly.
    print(f"Loading '{model_size}' model onto GPU...")
    whisper_model = WhisperModel(model_size, device=device, compute_type=compute_type)
    
    # Handle auto language
    lang_param = language if language != "auto" and language else None
    
    print(f"Processing audio at {uploaded_audio_path}...")
    
    # beam_size=1 is fast, but on GPU we can afford beam_size=5 for maximum accuracy
    segments, info = whisper_model.transcribe(
        uploaded_audio_path, 
        beam_size=5,
        language=lang_param,
        vad_filter=True,
        vad_parameters=dict(min_silence_duration_ms=500),
        condition_on_previous_text=False
    )
    
    final_text_output = ""
    srt_content = ""
    
    for i, segment in enumerate(segments, start=1):
        start_fmt = format_time(segment.start)
        end_fmt = format_time(segment.end)
        text = segment.text.lstrip()
        
        final_text_output += text + " "
        srt_content += f"{i}\n{start_fmt} --> {end_fmt}\n{text}\n\n"
        
    detected_language_str = f"{info.language.upper()} ({(info.language_probability * 100):.1f}%)"
    
    return final_text_output.strip(), srt_content, detected_language_str

# Build the Gradio Interface
with gr.Blocks(title="VoiceText API") as demo:
    gr.Markdown("# VoiceText Transcription API")
    gr.Markdown("VoiceText Backend Server - Powered by Whisper AI.")
    
    with gr.Row():
        audio_input = gr.Audio(
            sources=["upload", "microphone"],
            type="filepath", 
            label="Upload or Record Audio"
        )
        language_input = gr.Dropdown(
            choices=["auto", "en", "hi", "kn", "te", "ta"], 
            value="auto", 
            label="Language"
        )
        
    process_btn = gr.Button("Process Audio")
    
    with gr.Row():
        transcript_output = gr.Textbox(label="Transcript", lines=10)
        srt_output = gr.Textbox(label="SRT Subtitles", lines=10)
        lang_output = gr.Textbox(label="Detected Language")
        
    process_btn.click(
        fn=process_speech_to_text,
        inputs=[audio_input, language_input],
        outputs=[transcript_output, srt_output, lang_output],
        api_name="process" # This automatically exposes an API at /call/process
    )

if __name__ == "__main__":
    demo.launch()