import React from 'react';
import { Link } from 'react-router-dom';

const Verification = () => {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Код подтверждения</h1>
          <p className="text-gray-500 mb-8 text-sm font-medium">Код отправлен на почту example@mail.ru</p>
          
          <form className="space-y-6">
            <div className="flex justify-center space-x-2 md:space-x-4">
              {[...Array(6)].map((_, i) => (
                <input 
                  key={i}
                  type="text" 
                  maxLength="1"
                  className="w-10 h-12 md:w-12 md:h-14 text-center text-xl font-bold bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all text-blue-600"
                />
              ))}
            </div>
            
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-sm font-bold transition-colors shadow-md shadow-blue-500/20 mt-4">
              Подтвердить
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Verification;
