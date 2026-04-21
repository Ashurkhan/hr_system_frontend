import React from 'react';
import { useVacancy } from '../../contexts/VacancyContext';
import { TrendingUp, Users, Briefcase, Zap, Globe, MousePointer2 } from 'lucide-react';

export default function AdminAnalytics() {
  const { vacancies } = useVacancy();
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Real stats calculation
  const employers = users.filter(u => u.role === 'employer');
  const jobseekers = users.filter(u => u.role === 'jobseeker');

  // Calculate companies with their vacancy counts
  const companyStats = employers.map(emp => ({
    name: emp.companyName || emp.name,
    count: vacancies.filter(v => v.company === emp.companyName).length
  })).sort((a, b) => b.count - a.count).slice(0, 4);

  const stats = [
    { label: 'ПОЛЬЗОВАТЕЛИ', value: users.length, diff: '+12%', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'НОВЫЕ ПОЛЬЗОВАТЕЛИ', value: jobseekers.length, diff: '+5%', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'КОЛИЧЕСТВО ВАКАНСИЙ', value: vacancies.length, diff: '+8%', color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Сводка отчетов</h1>
        <div className="flex items-center space-x-2 text-xs font-black text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-gray-50">
           <Zap className="w-3 h-3 text-yellow-500" />
           <span>Обновлено только что</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-50 p-10 shadow-xl shadow-gray-200/20 relative overflow-hidden">
          <div className="grid grid-cols-3 gap-8">
             {stats.map((stat, i) => (
                <div key={i} className="space-y-1">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{stat.label}</p>
                   <div className="flex items-baseline space-x-2">
                     <span className="text-4xl font-black text-gray-900 leading-none tracking-tighter">{stat.value}</span>
                     <span className={`text-[10px] font-black ${stat.color} bg-white px-2 py-0.5 rounded-full border border-gray-50`}>{stat.diff}</span>
                   </div>
                </div>
             ))}
          </div>

          {/* Simple Chart Visualization */}
          <div className="mt-16 h-48 flex items-end justify-between space-x-2 opacity-50">
             {[35, 45, 30, 55, 40, 65, 50, 75, 45, 60, 40, 85].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-lg bg-blue-600/10 hover:bg-blue-600/30 transition-all cursor-pointer relative group" style={{ height: `${h}%` }}>
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity">
                      {h*12}
                   </div>
                </div>
             ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-black text-gray-300 uppercase tracking-widest px-1">
             <span>26 июня</span>
             <span>30</span>
             <span>01 июл.</span>
             <span>02</span>
             <span>03</span>
             <span>04</span>
             <span>05</span>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white rounded-[40px] border border-gray-50 p-8 shadow-xl shadow-gray-200/20">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ПОЛЬЗОВАТЕЛЕЙ ЗА ПОСЛЕДНИЕ 30 МИНУТ</p>
              <h4 className="text-3xl font-black text-gray-900 tracking-tighter">12</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">ПОЛЬЗОВАТЕЛЕЙ В МИНУТУ</p>
              <div className="mt-4 flex items-end space-x-1 h-12">
                 {[2,4,3,5,2,4,6,3,5,4,7,3,5,4,6,2,4,5,3,4].map((h, i) => (
                    <div key={i} className="flex-1 bg-blue-600 rounded-sm" style={{ height: `${h*10}%` }}></div>
                 ))}
              </div>
           </div>

           <div className="bg-blue-600 rounded-[40px] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
              <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
              <h4 className="text-sm font-black mb-2 uppercase tracking-widest">Подсказки</h4>
              <p className="text-white/70 text-xs font-bold leading-relaxed mb-6">Скоро здесь появится ваша статистика. Пока данных нет, вы можете использовать новую специальную статистику.</p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all">Создать</button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="bg-white rounded-[40px] border border-gray-50 p-8 shadow-xl shadow-gray-200/20">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">ОТКУДА ПРИШЛИ НОВЫЕ ПОЛЬЗОВАТЕЛИ?</h4>
            <div className="space-y-4">
               {[
                  { label: 'Прямые заходы', val: '45%', color: 'bg-blue-600' },
                  { label: 'Соцсети', val: '25%', color: 'bg-indigo-500' },
                  { label: 'Поиск', val: '20%', color: 'bg-orange-500' },
                  { label: 'Другое', val: '10%', color: 'bg-gray-200' },
               ].map((item, i) => (
                  <div key={i} className="space-y-1.5">
                     <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-gray-400 uppercase tracking-wider">{item.label}</span>
                        <span className="text-gray-900">{item.val}</span>
                     </div>
                     <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: item.val }}></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-xl shadow-gray-200/20">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 uppercase">Ваши основные компании</h4>
            <div className="space-y-4">
               {companyStats.length === 0 ? (
                 <p className="text-xs font-bold text-gray-400 py-4 text-center">Компаний пока нет</p>
               ) : (
                companyStats.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer group">
                     <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-[10px] font-black">{item.name[0]}</div>
                        <span className="text-xs font-bold text-gray-900">{item.name}</span>
                     </div>
                     <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-lg group-hover:bg-white">{item.count} вак.</span>
                  </div>
                ))
               )}
            </div>
         </div>

         <div className="bg-white rounded-[40px] border border-gray-50 p-8 shadow-xl shadow-gray-200/20">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">СТРАНЫ ПОЛЬЗОВАТЕЛЕЙ</h4>
            <div className="space-y-5">
               {[
                  { country: 'Кыргызстан', val: 78, icon: '🇰🇬' },
                  { country: 'Казахстан', val: 12, icon: '🇰🇿' },
                  { country: 'Россия', val: 6, icon: '🇷🇺' },
                  { country: 'Другие', val: 4, icon: '🌍' },
               ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                     <div className="flex items-center space-x-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-xs font-bold text-gray-900">{item.country}</span>
                     </div>
                     <div className="flex items-center space-x-2">
                        <div className="w-24 h-1.5 bg-gray-50 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600 rounded-full" style={{ width: `${item.val}%` }}></div>
                        </div>
                        <span className="text-[10px] font-black text-gray-400 w-8">{item.val}%</span>
                     </div>
                  </div>
               ))}
            </div>
            <div className="mt-8 pt-8 border-t border-gray-50 flex justify-center">
               <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center space-x-2 hover:text-blue-700 transition-all">
                  <Globe className="w-3 h-3" />
                  <span>Посмотреть страны</span>
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
