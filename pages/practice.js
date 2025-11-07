import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { motion } from 'framer-motion';

export default function Practice() {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const speakWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    speechSynthesis.speak(utterance);
  };

  const checkPronunciation = (targetWord) => {
    // Simple check: Compare transcript to target (improve with AI if needed)
    if (transcript.toLowerCase().includes(targetWord.toLowerCase())) {
      alert('Great job! 🎉'); // Add points/badges
    } else {
      alert('Try again!');
    }
  };

  return (
    <div className="p-8">
      <h1>Practice Pronunciation</h1>
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={() => speakWord('onomatopoeia')}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Listen to "onomatopoeia"
      </motion.button>
      <button onClick={SpeechRecognition.startListening} disabled={listening}>
        {listening ? 'Listening...' : 'Speak Now'}
      </button>
      <p>Transcript: {transcript}</p>
      <button onClick={() => checkPronunciation('onomatopoeia')}>Check</button>
      {/* Add games: Match words to images, build sentences */}
    </div>
  );
}