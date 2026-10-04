export interface VoiceResult {
  text: string
}

export interface VoiceRecognitionController {
  start: () => void
  stop: () => void
  isSupported: boolean
}

interface SpeechRecognitionResultLike {
  transcript: string
}

interface SpeechRecognitionResultListLike {
  [index: number]: {
    [index: number]: SpeechRecognitionResultLike
  }
}

interface SpeechRecognitionEventLike {
  results: SpeechRecognitionResultListLike
}

interface SpeechRecognitionErrorEventLike {
  error: string
}

interface SpeechRecognitionLike {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognitionLike
  webkitSpeechRecognition?: new () => SpeechRecognitionLike
}

export function isVoiceInputSupported(): boolean {
  const speechWindow = window as SpeechRecognitionWindow

  return Boolean(
    speechWindow.SpeechRecognition ||
      speechWindow.webkitSpeechRecognition,
  )
}

export function createVoiceRecognition(
  language: 'en' | 'hi',
  onResult: (result: VoiceResult) => void,
  onError: (message: string) => void,
  onEnd: () => void,
): VoiceRecognitionController {
  const speechWindow = window as SpeechRecognitionWindow

  const Recognition =
    speechWindow.SpeechRecognition ??
    speechWindow.webkitSpeechRecognition

  if (!Recognition) {
    return {
      start: () =>
        onError(
          'Voice input is not supported in this browser. Please use text input instead.',
        ),
      stop: () => undefined,
      isSupported: false,
    }
  }

  const recognition = new Recognition()

  recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN'
  recognition.interimResults = false
  recognition.continuous = false

  recognition.onresult = (event) => {
    const transcript =
      event.results[0]?.[0]?.transcript?.trim() ?? ''

    if (transcript) {
      onResult({ text: transcript })
    }
  }

  recognition.onerror = (event) => {
    onError(`Voice input error: ${event.error}`)
  }

  recognition.onend = onEnd

  return {
    start: () => recognition.start(),
    stop: () => recognition.stop(),
    isSupported: true,
  }
}
