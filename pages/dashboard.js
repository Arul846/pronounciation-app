import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function Dashboard() {
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState({ text: '', definition: '', sentence: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 📚 Fetches all words from the Firestore 'words' collection.
   */
  const fetchWords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, 'words'));
      const wordsData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setWords(wordsData);
    } catch (err) {
      console.error("Error fetching words:", err);
      setError("Failed to fetch words.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch words on component mount
  useEffect(() => {
    fetchWords();
  }, []);

  /**
   * ✨ Adds a new word to the Firestore 'words' collection and refreshes the list.
   */
  const addWord = async () => {
    if (!newWord.text || !newWord.definition) {
        alert("Word and Definition are required.");
        return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      // Add the new word document to the Firestore collection
      await addDoc(collection(db, 'words'), newWord);
      
      // Clear the form fields
      setNewWord({ text: '', definition: '', sentence: '' });
      
      // Refresh the word list immediately
      await fetchWords(); 

    } catch (err) {
      console.error("Error adding word:", err);
      setError("Failed to add word.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for all input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWord(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">🧑‍🏫 Teacher Dashboard</h1>
      
      {isLoading && <p className="text-blue-500">Loading data...</p>}
      {error && <p className="text-red-500 font-medium">Error: {error}</p>}
      
      {/* --- Add Word Form --- */}
      <section className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">Add New Vocabulary Word</h2>
        <div className="flex flex-col space-y-3">
          
          <input 
            name="text"
            placeholder="Word (e.g., 'Ephemeral')" 
            value={newWord.text} 
            onChange={handleInputChange} 
            className="p-2 border border-gray-300 rounded"
          />
          
          <textarea
            name="definition"
            placeholder="Definition (e.g., 'lasting for a very short time.')" 
            value={newWord.definition} 
            onChange={handleInputChange} 
            className="p-2 border border-gray-300 rounded h-20"
          />
          
          <input 
            name="sentence"
            placeholder="Example Sentence (Optional)" 
            value={newWord.sentence} 
            onChange={handleInputChange} 
            className="p-2 border border-gray-300 rounded"
          />
          
          <button 
            onClick={addWord} 
            disabled={isLoading}
            className="mt-4 p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition duration-150 disabled:bg-indigo-300"
          >
            {isLoading ? 'Adding...' : 'Add Word to Dictionary'}
          </button>
        </div>
      </section>

      {/* --- Vocabulary List --- */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">Current Vocabulary List ({words.length})</h2>
        
        {words.length === 0 && !isLoading && <p>No words added yet. Start adding some!</p>}
        
        <ul className="space-y-4">
          {words.map((word) => (
            <li key={word.id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition">
              <p className="text-lg font-bold text-gray-800">{word.text}</p>
              <p className="text-gray-600 italic">Definition: {word.definition}</p>
              {word.sentence && <p className="text-sm text-gray-500 mt-1">Example: "{word.sentence}"</p>}
            </li>
          ))}
        </ul>
      </section>

      {/* --- Assignments Section Placeholder --- */}
      <section className="mt-10 pt-6 border-t border-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-purple-600">📝 Assignment Management</h2>
        <p className="text-gray-600">
          *Similar for assignments:* Here you would implement logic to **fetch students**, allow the teacher to **select students**, **choose words/tasks** from the list above, and save the assignment data to a separate 'assignments' collection in Firestore.
        </p>
        <button className="mt-3 p-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition duration-150">
          Create New Assignment (Future Feature)
        </button>
      </section>
    </div>
  );
}