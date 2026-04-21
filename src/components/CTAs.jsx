import React from 'react';
import { Link } from 'react-router-dom';

const CTAs = () => {
  return (
    <section className="bg-white pb-24">
      <div className="max-w-[1024px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Employer Card */}
          <div className="bg-[#2D3192] rounded-[32px] p-10 md:p-12 relative overflow-hidden flex flex-col justify-center min-h-[320px] shadow-xl shadow-blue-900/20 group">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
            <div className="relative z-10 w-[70%]">
              <h3 className="text-2xl md:text-[28px] font-bold text-white mb-3">Работодатель</h3>
              <p className="text-blue-200/90 mb-10 font-medium leading-relaxed">Ищете в свою команду<br/>новых людей?</p>
              <Link to="/register" className="bg-white text-[#2D3192] px-7 py-3 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors inline-block w-max shadow-lg">
                Зарегистрироваться
              </Link>
            </div>
            {/* Image Placeholder */}
            <div className="absolute right-0 bottom-0 w-[45%] h-full flex items-end justify-end">
               <div className="w-full h-[85%] bg-gradient-to-t from-blue-900/80 to-blue-800 rounded-tl-full border-t-8 border-l-8 border-[#2D3192] flex items-center justify-center flex-col shadow-inner">
                   <div className="text-[40px] mb-2">👨‍💼</div>
                   <div className="text-white/40 text-xs font-semibold uppercase tracking-widest">Фото</div>
               </div>
            </div>
          </div>

          {/* Job Seeker Card */}
          <div className="bg-[#50BFA5] rounded-[32px] p-10 md:p-12 relative overflow-hidden flex flex-col justify-center min-h-[320px] shadow-xl shadow-emerald-500/20 group">
             <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
             <div className="relative z-10 w-[70%]">
              <h3 className="text-2xl md:text-[28px] font-bold text-white mb-3">Соискатель</h3>
              <p className="text-teal-50/90 mb-10 font-medium leading-relaxed">Ищете достойную<br/>работу?</p>
              <Link to="/register" className="bg-white text-[#50BFA5] px-7 py-3 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors inline-block w-max shadow-lg">
                Зарегистрироваться
              </Link>
            </div>
            {/* Image Placeholder */}
            <div className="absolute right-0 bottom-0 w-[45%] h-full flex items-end justify-end">
               <div className="w-full h-[85%] bg-gradient-to-t from-teal-700/60 to-teal-500 rounded-tl-full border-t-8 border-l-8 border-[#50BFA5] flex items-center justify-center flex-col shadow-inner">
                   <div className="text-[40px] mb-2">🧑‍💻</div>
                   <div className="text-white/40 text-xs font-semibold uppercase tracking-widest">Фото</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTAs;
