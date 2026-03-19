export const LEMONFOX_CHAT_MODELS = [
  {
    id: 'llama-8b-chat',
    label: 'Llama 8B Chat',
    description: 'Fast replies for lightweight prompts and workflow help.',
  },
  {
    id: 'llama-70b-chat',
    label: 'Llama 70B Chat',
    description: 'Stronger reasoning for larger prompts and deeper assistance.',
  },
] as const;

export const LEMONFOX_TTS_LANGUAGES = [
  { id: 'en-us', label: 'English (US)' },
  { id: 'en-gb', label: 'English (UK)' },
  { id: 'es', label: 'Spanish' },
  { id: 'fr', label: 'French' },
  { id: 'it', label: 'Italian' },
  { id: 'pt-br', label: 'Portuguese (Brazil)' },
  { id: 'hi', label: 'Hindi' },
  { id: 'ja', label: 'Japanese' },
  { id: 'zh', label: 'Chinese' },
] as const;

export const LEMONFOX_TTS_VOICE_PRESETS = {
  'en-us': ['heart', 'bella', 'michael', 'alloy', 'aoede', 'jessica', 'nova', 'river', 'sarah', 'echo', 'onyx'],
  'en-gb': ['alice', 'emma', 'isabella', 'lily', 'daniel', 'fable', 'george', 'lewis'],
} as const;

export const LEMONFOX_AUDIO_FORMATS = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'opus'] as const;

export const LEMONFOX_STT_RESPONSE_FORMATS = ['json', 'verbose_json', 'text', 'srt', 'vtt'] as const;

export const LEMONFOX_IMAGE_SIZES = ['1024x1024', '1024x768', '768x1024', '768x768', '512x512'] as const;
