// Fetch phonetic data from Free Dictionary API (free, no API key required)
export async function fetchPhonetics(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    if (!response.ok) {
      return null
    }
    const data = await response.json()
    if (data && data.length > 0) {
      const entry = data[0]
      // Get phonetic text (IPA)
      const phonetic = entry.phonetic || 
                      (entry.phonetics && entry.phonetics.find(p => p.text)?.text) ||
                      (entry.phonetics && entry.phonetics[0]?.text) ||
                      ''
      
      // Get audio URL (prefer UK pronunciation for more natural sound)
      const audio = entry.phonetics && entry.phonetics.find(p => p.audio && p.audio.includes('uk'))?.audio ||
                   entry.phonetics && entry.phonetics.find(p => p.audio)?.audio ||
                   ''
      
      return { phonetic, audio }
    }
    return null
  } catch (error) {
    console.error('Error fetching phonetics:', error)
    return null
  }
}

// Play real audio from URL (natural human pronunciation)
export function playAudio(audioUrl) {
  if (!audioUrl) {
    console.log('No audio URL provided')
    return false
  }
  
  try {
    const audio = new Audio(audioUrl)
    audio.play()
    return true
  } catch (error) {
    console.error('Error playing audio:', error)
    return false
  }
}

// Text-to-speech using Web Speech API (built into browsers, free) - fallback
export function speakWord(word, lang = 'en-US') {
  console.log('Attempting to speak:', word)
  
  if ('speechSynthesis' in window) {
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = lang
      utterance.rate = 0.8 // Slightly slower for learning
      utterance.pitch = 1
      utterance.volume = 1
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices()
      console.log('Available voices:', voices.length)
      
      // Try to use an English voice
      const englishVoice = voices.find(voice => voice.lang.startsWith('en-US') || voice.lang.startsWith('en-GB'))
      if (englishVoice) {
        utterance.voice = englishVoice
        console.log('Using voice:', englishVoice.name, englishVoice.lang)
      } else {
        console.warn('No English voice found, using default')
      }
      
      // Add event listeners for debugging
      utterance.onstart = () => console.log('Speech started')
      utterance.onend = () => console.log('Speech ended')
      utterance.onerror = (e) => console.error('Speech error:', e)
      
      window.speechSynthesis.speak(utterance)
      return true
    } catch (error) {
      console.error('Error in speech synthesis:', error)
      return false
    }
  }
  console.error('Speech synthesis not supported in this browser')
  return false
}

// Check if speech synthesis is available
export function isSpeechSynthesisAvailable() {
  return 'speechSynthesis' in window
}

// Initialize voices (call this on app mount)
export function initSpeechSynthesis() {
  if ('speechSynthesis' in window) {
    console.log('Initializing speech synthesis')
    // Load voices
    const voices = window.speechSynthesis.getVoices()
    console.log('Initial voices loaded:', voices.length)
    
    // Some browsers need this event
    window.speechSynthesis.onvoiceschanged = () => {
      const voices = window.speechSynthesis.getVoices()
      console.log('Voices changed:', voices.length)
    }
  } else {
    console.warn('Speech synthesis not available')
  }
}
