import urllib.request
import io
import wave
import struct
import math
import uuid

# Generate a 1-second sine wave at 440 Hz
sample_rate = 16000
duration = 1
frequency = 440.0

audio_data = []
for i in range(sample_rate * duration):
    value = int(32767.0 * math.sin(2.0 * math.pi * frequency * i / sample_rate))
    audio_data.append(struct.pack('<h', value))

wav_io = io.BytesIO()
with wave.open(wav_io, 'wb') as wav_file:
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(sample_rate)
    wav_file.writeframes(b''.join(audio_data))

wav_bytes = wav_io.getvalue()

boundary = uuid.uuid4().hex
headers = {
    'Content-Type': f'multipart/form-data; boundary={boundary}'
}

body = bytearray()
body.extend(f'--{boundary}\r\n'.encode('utf-8'))
body.extend(f'Content-Disposition: form-data; name="audio"; filename="test.wav"\r\n'.encode('utf-8'))
body.extend(f'Content-Type: audio/wav\r\n\r\n'.encode('utf-8'))
body.extend(wav_bytes)
body.extend(f'\r\n--{boundary}--\r\n'.encode('utf-8'))

req = urllib.request.Request('http://127.0.0.1:5001/api/transcribe', data=body, headers=headers, method='POST')

try:
    with urllib.request.urlopen(req) as response:
        print("Response:", response.status)
        print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code)
    print(e.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
