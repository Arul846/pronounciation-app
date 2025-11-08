// app/layout.tsx
'use client';  // Needed for client-side Firebase

import { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCNrCZP-z1-Z7keeNv8lgWGgTVNJVPKDyw",
  authDomain: "pronunciationapp-93d67.firebaseapp.com",
  projectId: "pronunciationapp-93d67",
  storageBucket: "pronunciationapp-93d67.firebasestorage.app",
  messagingSenderId: "1013588686815",
  appId: "1:1013588686815:web:5175c84f53f6982a00f66a",
  measurementId: "G-TZTRQVHMSP"
};

// Initialize Firebase (only once)
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);  // Export for use in components
export const db = getFirestore(app);  // Export for use in components

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Optional: Add any global Firebase setup here, like auth state listeners
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}