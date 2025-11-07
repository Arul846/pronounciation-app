import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard'); // Redirect based on role (check user data in Firestore)
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl mb-4">Login</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="block mb-2 p-2 border" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="block mb-4 p-2 border" />
        <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
      </div>
    </div>
  );
}