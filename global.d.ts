declare class SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: (() => void) | null;
    onend: (() => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: Event) => void) | null;
    start(): void;
    stop(): void;
    abort(): void;
  }
  
  declare class SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
  }
  
  declare class SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    readonly length: number;
  }
  
  declare class SpeechRecognitionResult {
    readonly isFinal: boolean;
    [index: number]: SpeechRecognitionAlternative;
    readonly length: number;
  }
  
  declare class SpeechRecognitionAlternative {
    readonly confidence: number;
    readonly transcript: string;
  }
  
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  