/// <reference types="dom-speech-recognition" />
export type SpeechOptions = {
    lang?: string;
    continuous?: boolean;
    interimResults?: boolean;
    maxAlternatives?: number;
    events?: {
        start?: () => void;
        result?: (event: SpeechRecognitionEvent) => void;
        end?: () => void;
        error?: (error: Event) => void;
    };
};
