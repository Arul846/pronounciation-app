import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';  // Ensure this import works (from lib/firebase.js)
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion';  // For animations (install if needed: npm install framer-motion)

export default function Assignments() {  // This is the required default export
  const [assignments, setAssignments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (student)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchAssignments(currentUser.uid);  // Fetch assignments for this student
      } else {
        setLoading(false);  // Not logged in
      }
    });
    return unsubscribe;
  }, []);

  const fetchAssignments = async (studentId) => {
    try {
      const q = query(collection(db, 'assignments'), where('studentId', '==', studentId));
      const querySnapshot = await getDocs(q);
      const assignmentList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAssignments(assignmentList);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (assignmentId) => {
    try {
      const assignmentRef = doc(db, 'assignments', assignmentId);
      await updateDoc(assignmentRef, { completed: true });
      // Refresh list or update state
      setAssignments(assignments.map(ass => ass.id === assignmentId ? { ...ass, completed: true } : ass));
      alert('Assignment completed! 🎉');  // Fun feedback; replace with a modal or sound
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  if (loading) return <div className="p-8">Loading assignments...</div>;
  if (!user) return <div className="p-8">Please log in to view assignments.</div>;

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Your Assignments</h1>
      {assignments.length === 0 ? (
        <p>No assignments yet. Check back later!</p>
      ) : (
        <div className="grid gap-4">
          {assignments.map((assignment) => (
            <motion.div
              key={assignment.id}
              className="bg-white p-4 rounded shadow-md"
              whileHover={{ scale: 1.02 }}
            >
              <h2 className="text-xl font-semibold">{assignment.type === 'homework' ? 'Homework' : 'Classwork'}: {assignment.description}</h2>
              <p>Words to practice: {assignment.words ? assignment.words.join(', ') : 'None'}</p>
              {assignment.completed ? (
                <p className="text-green-500">✅ Completed!</p>
              ) : (
                <motion.button
                  onClick={() => markCompleted(assignment.id)}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                  whileTap={{ scale: 0.95 }}
                >
                  Mark as Completed
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      )}
      {/* Fun element: Add a progress bar or badge system here */}
    </div>
  );
}