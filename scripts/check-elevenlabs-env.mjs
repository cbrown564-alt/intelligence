const apiKey = process.env.ELEVENLABS_API_KEY?.trim();

if (!apiKey || apiKey === 'replace_with_your_key') {
  console.error('ELEVENLABS_API_KEY is missing. Copy .env.example to .env and add the key.');
  process.exitCode = 1;
} else {
  console.log('ElevenLabs credentials are available. No API request was made.');
}
