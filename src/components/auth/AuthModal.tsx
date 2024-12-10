import { useState } from 'react';
import { X } from 'lucide-react';
import SignInForm from './SignInForm';
import RegisterForm from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignIn, setIsSignIn] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {isSignIn ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600">
            {isSignIn 
              ? 'Sign in to access member benefits' 
              : 'Join us to get exclusive discounts and benefits'}
          </p>
        </div>

        {isSignIn ? <SignInForm /> : <RegisterForm />}

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-amber-600 hover:text-amber-700"
          >
            {isSignIn 
              ? "Don't have an account? Register" 
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}