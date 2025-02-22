import React from 'react';
import { useState, useEffect } from 'react';
import { Home, LogOut, Calculator, ArrowLeft } from 'lucide-react';
import MarkupCalculator from './components/MarkupCalculator';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

function App() {
  const [activeTab, setActiveTab] = useState('markup');
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user !== undefined) {
      setLoading(false);
    }
  }, [user]);

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acceso no autorizado</h1>
          <p className="text-gray-600">Por favor, inicia sesión para acceder a las herramientas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <ArrowLeft className="h-6 w-6 mr-2 cursor-pointer hover:text-indigo-200 transition-colors duration-200" />
              <Home className="h-6 w-6 mr-2 text-indigo-200" />
              <span className="font-semibold text-xl">Herramientas de Cálculo</span>
            </div>
            <div className="flex items-center space-x-4 text-indigo-100">
              <span className="font-medium">{user.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 hover:text-white transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('markup')}
              className={`${
                activeTab === 'markup'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <Calculator className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Calculadora de Markup</span>
              <span className="sm:hidden">Markup</span>
            </button>
            {/* Add more tabs here as needed */}
          </nav>
        </div>

        {/* Content Area */}
        <div className="py-6 px-4 sm:px-0">
          {activeTab === 'markup' && <MarkupCalculator />}
        </div>
      </div>
    </div>
  );
}

export default App;
