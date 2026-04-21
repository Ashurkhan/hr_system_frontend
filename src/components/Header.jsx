import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { currentUser } = useAuth();

  return (
    <header className="flex items-center justify-between py-6 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center space-x-12">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-blue-600 transform rotate-45 flex items-center justify-center relative">
            <div className="w-4 h-4 bg-white absolute" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
          </div>
          <span className="text-2xl font-black text-[#1e293b] tracking-tight ml-2">Border</span>
        </Link>
        
        {/* Nav Links */}
        <nav className="hidden md:flex space-x-8">
          <Link to="/jobseeker" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Вакансии</Link>
          <Link to="/faq" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">FAQ</Link>
          <Link to="/contacts" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Контакты</Link>
        </nav>
      </div>

      {/* Auth Section */}
      <div className="flex items-center space-x-4">
        {currentUser ? (
          <Link 
            to={currentUser.role === 'employer' ? '/vacancies' : '/jobseeker'} 
            className="px-6 py-2.5 text-sm font-black text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-all border border-blue-100"
          >
            Личный кабинет
          </Link>
        ) : (
          <>
            <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-blue-600 bg-white hover:bg-gray-50 rounded-full transition-colors border border-transparent hover:border-gray-100">
              Войти
            </Link>
            <Link to="/register" className="px-6 py-2.5 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5">
              Регистрация
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
