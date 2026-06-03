import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VoiceSearch = ({ onSearch, isOpen, onClose }) => {
  const { transcript, listening, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (transcript && !listening) {
      setIsProcessing(true);
      onSearch(transcript);
     
      setTimeout(() => {
        onClose();
        resetTranscript();
        setIsProcessing(false);
      }, 1000);
    }
  }, [transcript, listening, onSearch, onClose, resetTranscript]);

  useEffect(() => {
    if (isOpen) {
      SpeechRecognition.startListening({ continuous: false, language: 'en-US' });
    } else {
      SpeechRecognition.stopListening();
      resetTranscript();
    }
  }, [isOpen, resetTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="absolute top-full right-0 mt-2 w-80 bg-red-900/90 backdrop-blur-md rounded-2xl p-4 border border-red-500/30 text-white">
        <p className="text-sm">Voice search is not supported in your browser</p>
      </div>
    );
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-[#1a1a1a] backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl z-50">
    
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${listening ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
          Voice Search
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

 
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            listening ? 'bg-purple-600/20 border-2 border-purple-500' : 'bg-gray-800 border-2 border-gray-600'
          }`}>
            <svg className={`w-6 h-6 ${listening ? 'text-purple-400 animate-pulse' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium">
              {listening ? 'Listening...' : isProcessing ? 'Processing...' : 'Click to start'}
            </p>
            <p className="text-gray-400 text-sm">
              {listening ? 'Speak clearly into your microphone' : 'Press the mic button to start'}
            </p>
          </div>
        </div>

        {listening && (
          <div className="flex items-center justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="w-1 bg-purple-500 rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 20 + 10}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )}
      </div>


      <div className="bg-black/30 rounded-lg p-3 border border-white/10 min-h-[60px]">
        <p className="text-gray-300 text-sm">
          {transcript || (
            <span className="text-gray-500 italic">Your speech will appear here...</span>
          )}
        </p>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => SpeechRecognition.startListening({ continuous: false, language: 'en-US' })}
          disabled={listening}
          className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {listening ? 'Listening...' : 'Start'}
        </button>
        <button
          onClick={() => {
            SpeechRecognition.stopListening();
            resetTranscript();
          }}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default VoiceSearch;