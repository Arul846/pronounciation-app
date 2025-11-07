import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function Dashboard() {
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState({ text: '', definition: '', sentence: '' });

  useEffect(() => {
    const fetchWords = async () => {
      const querySnapshot = await getDocs(collection(db, 'words'));
      setWords(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchWords();
  }, []);

  const addWord = async () => {
    await addDoc(collection(db, 'words'), newWord);
    setNewWord({ text: '', definition: '', sentence: '' });
    // Refresh list
  };

  // Similar for assignments: Assign to students (e.g., select student, choose words/tasks)

  return (
    <div className="p-8">
      <h1>Teacher Dashboard</h1>
      {/* Add Word Form */}
      <input placeholder="Word" value={newWord.text} onChange={(e) => setNewWord({ ...newWord, text: e.target.value })} />
      {/* Other fields */}
      <button onClick={addWord}>Add Word</button>
      {/* List words, create assignments */}
    </div>
  );
}