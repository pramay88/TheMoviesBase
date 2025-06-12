import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black to-gray-900 px-4">
      <form
        onSubmit={loginHandler}
        className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
      >
        <h1 className="text-white text-3xl font-bold text-center">Welcome Back</h1>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
        >
          Login
        </button>

        <p className="text-gray-300 text-sm text-center">
          Don't have an account?{' '}
          <a href="/signup" className="text-green-400 hover:underline">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
