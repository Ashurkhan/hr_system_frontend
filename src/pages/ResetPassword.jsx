import React from 'react';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
  return (
    <div className="min-h-screen bg-[#f0f4fa] flex flex-col">
      <header className="py-6 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center space-x-2 w-max">
          <div className="w-8 h-8 rounded bg-blue-500 transform rotate-45 flex items-center justify-center relative shadow-sm">
             <div className="w-4 h-4 rounded-sm bg-blue-200 absolute -top-1 -right-1" />
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight ml-2">Border</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-[24px] shadow-xl shadow-gray-200/50 w-full max-w-md p-8 md:p-10 text-center relative">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Создайте пароль</h1>
          
          <form className="space-y-4">
            <div className="text-left">
               <input 
                 type="password" 
                 placeholder="Новый пароль" 
                 className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-gray-400"
               />
            </div>
            <div className="text-left">
               <input 
                 type="password" 
                 placeholder="Повторите пароль" 
                 className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-gray-400"
               />
            </div>
            
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-sm font-bold transition-colors shadow-md shadow-blue-500/20 mt-4 mb-8">
              Создать
            </button>
          </form>

          <p className="mt-8 text-sm text-gray-500 font-medium">
            Уже есть аккаунт? <Link to="/login" className="text-gray-900 font-bold hover:text-blue-600 transition-colors">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
