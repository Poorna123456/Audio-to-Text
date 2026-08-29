import argparse
import jiwer
from faster_whisper import WhisperModel
import os

def calculate_wer(reference_text: str, hypothesis_text: str) -> float:
    """Calculates Word Error Rate (WER) using jiwer."""
    # Preprocess text (lowercase, remove punctuation, etc.) for fair comparison
    transformation = jiwer.Compose([
        jiwer.ToLowerCase(),
        jiwer.RemovePunctuation(),
        jiwer.RemoveWhiteSpace(replace_by_space=True),
        jiwer.RemoveMultipleSpaces(),
        jiwer.ReduceToListOfListOfWords(word_delimiter=" ")
    ])
    
    return jiwer.wer(
        reference_text, 
        hypothesis_text, 
        truth_transform=transformation, 
        hypothesis_transform=transformation
    )

def evaluate_audio(audio_path: str, reference_transcript_path: str, model_size: str = "large-v3"):
    """Transcribes audio and compares it to a reference transcript to compute WER."""
    print(f"Loading reference transcript from {reference_transcript_path}...")
    with open(reference_transcript_path, 'r', encoding='utf-8') as f:
        reference_text = f.read().strip()
        
    print(f"Loading WhisperModel ({model_size})...")
    device = "cuda" if os.environ.get("CUDA_VISIBLE_DEVICES") != "-1" else "auto"
    compute_type = "float16" if device == "cuda" else "int8"
    
    try:
        model = WhisperModel(model_size, device=device, compute_type=compute_type)
    except Exception as e:
        print(f"Failed to load on {device}, falling back to CPU. Error: {e}")
        model = WhisperModel(model_size, device="cpu", compute_type="int8")

    print(f"Transcribing {audio_path}...")
    segments, info = model.transcribe(audio_path, beam_size=5)
    
    hypothesis_text = " ".join([segment.text.lstrip() for segment in segments]).strip()
    
    print("\n--- Transcription Complete ---")
    print(f"Detected Language: {info.language} (Probability: {info.language_probability:.2f})")
    print(f"\nReference Text:\n{reference_text}")
    print(f"\nHypothesis Text:\n{hypothesis_text}")
    
    wer = calculate_wer(reference_text, hypothesis_text)
    
    print("\n--- Evaluation Results ---")
    print(f"Word Error Rate (WER): {wer:.4f} ({wer * 100:.2f}%)")
    print(f"Accuracy (1 - WER): {1 - wer:.4f} ({(1 - wer) * 100:.2f}%)")
    
    return wer

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate Faster-Whisper transcription accuracy using WER.")
    parser.add_argument("audio", help="Path to the audio file")
    parser.add_argument("reference", help="Path to the reference transcript (.txt)")
    parser.add_argument("--model", default="large-v3", help="Whisper model size (default: large-v3)")
    
    args = parser.parse_args()
    
    if not os.path.exists(args.audio):
        print(f"Error: Audio file not found at {args.audio}")
        exit(1)
        
    if not os.path.exists(args.reference):
        print(f"Error: Reference file not found at {args.reference}")
        exit(1)
        
    evaluate_audio(args.audio, args.reference, args.model)
