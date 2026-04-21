import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/jobseeker?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/jobseeker');
    }
  };

  const tagSearch = (tag) => {
    navigate(`/jobseeker?search=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left Content */}
      <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
        <h1 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold text-gray-900 leading-[1.15] tracking-tight">
          ПОИСК РАБОТЫ ПО <br className="hidden md:block" /> ВСЕМУ КЫРГЫСТАНУ
        </h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="bg-white p-1.5 rounded-full shadow-lg shadow-gray-200/60 flex items-center border border-gray-100 max-w-xl">
          <div className="pl-5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Какую работу ищете?" 
            className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-gray-700 placeholder-gray-400 font-medium"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-md shadow-blue-500/30 hover:shadow-lg hover:-translate-y-0.5">
            Найти
          </button>
        </form>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-gray-500 font-medium mr-1 text-sm">Часто ищут:</span>
          <span onClick={() => tagSearch('Информационные технологии')} className="px-4 py-1.5 rounded-full border border-blue-200 text-blue-600 bg-blue-50 cursor-pointer hover:bg-blue-100 hover:border-blue-300 transition-colors text-xs font-semibold">Информационные технологии</span>
          <span onClick={() => tagSearch('Бухгалтерия')} className="px-4 py-1.5 rounded-full border border-pink-200 text-pink-600 bg-pink-50 cursor-pointer hover:bg-pink-100 hover:border-pink-300 transition-colors text-xs font-semibold">Бухгалтерия</span>
          <span onClick={() => tagSearch('Маркетинг')} className="px-4 py-1.5 rounded-full border border-yellow-200 text-yellow-600 bg-yellow-50 cursor-pointer hover:bg-yellow-100 hover:border-yellow-300 transition-colors text-xs font-semibold">Маркетинг и PR</span>
        </div>
      </div>

      {/* Right Content / Illustration */}
      <div className="relative flex justify-center lg:justify-end mt-10 lg:mt-0 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="relative w-full max-w-lg aspect-[4/3]">
             {/* Main Photo of the Girl */}
             <div className="relative z-10 w-full h-full rounded-[40px] shadow-2xl overflow-hidden border-8 border-white">
                <img 
                  src="/hero-girl.png" 
                  alt="Hero" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000";
                  }}
                />
             </div>

             {/* Floating Elements (mimicking Figma) */}
             <div className="absolute top-10 -left-6 bg-white p-4 rounded-2xl shadow-2xl shadow-blue-900/10 flex items-center space-x-3 z-20 border border-gray-50 transform -rotate-3 hover:rotate-0 transition-all">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">10+</div>
                <div>
                   <p className="text-xs font-black text-gray-900">Новых вакансий</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Сегодня</p>
                </div>
             </div>

             <div className="absolute bottom-16 -right-8 bg-white px-6 py-5 rounded-3xl shadow-2xl shadow-blue-900/10 z-20 border border-gray-50 transform rotate-2 hover:rotate-0 transition-all max-w-[200px]">
                <div className="flex items-center space-x-2 mb-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold">Online</span>
                </div>
                <div className="font-black text-gray-900 text-sm">Вахтанг и еще 5 рекрутеров смотрят ваше резюме 👀</div>
             </div>

             {/* Decorative Background Blobs */}
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -z-10"></div>
             <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
