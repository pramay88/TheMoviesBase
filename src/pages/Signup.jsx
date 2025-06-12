import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const signupHandler = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black to-gray-900 px-4">
      <form 
        onSubmit={signupHandler} 
        className="flex flex-col space-y-4 bg-[#2C2C2C] p-8 rounded-lg shadow-md w-96"
      >
        <h1 className="text-white text-3xl text-center font-bold mb-4">Sign Up</h1>

        {error && (
          <div className="text-red-400 text-sm text-center">{error}</div>
        )}

        <input
          type="text"
          placeholder="Full Name"
          className="px-4 py-2 rounded bg-white text-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="px-4 py-2 rounded bg-white text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="px-4 py-2 rounded bg-white text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button 
          type="submit" 
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Create Account
        </button>

        <p className="text-white text-sm text-center">
          Already have an account? <a href="/login" className="text-blue-400 underline">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Signup;
