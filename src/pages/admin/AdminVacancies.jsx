import React, { useState } from 'react';
import { useVacancy } from '../../contexts/VacancyContext';
import { Search, Trash2, Eye, EyeOff, MapPin, Building2, Calendar } from 'lucide-react';

export default function AdminVacancies() {
  const { vacancies, deleteVacancy } = useVacancy();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVacancies = vacancies.filter(v => 
    (v.position?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     v.company?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Все вакансии</h1>
        <div className="text-sm font-bold text-gray-400 bg-white px-4 py-2 rounded-xl border border-gray-100">
          Всего вакансий: <span className="text-blue-600">{vacancies.length}</span>
        </div>
      </div>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Поиск по названию или компании"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all font-medium shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredVacancies.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-gray-50 shadow-sm font-bold text-gray-400">
            Ни одной вакансии не найдено
          </div>
        ) : (
          filteredVacancies.map((vacancy) => (
            <div key={vacancy.id} className="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start space-x-5">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                  <Building2 className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div className="space-y-1 mt-1">
                  <h3 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">{vacancy.position}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-gray-400">
                    <span className="flex items-center space-x-1 uppercase tracking-wider">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{vacancy.company}</span>
                    </span>
                    <span className="flex items-center space-x-1 uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{vacancy.location}</span>
                    </span>
                    <span className="flex items-center space-x-1 uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{vacancy.postedAt || '15.06.2026'}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 md:self-center self-end">
                <button className="flex items-center space-x-2 bg-gray-50 text-gray-600 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all border border-gray-100">
                  <EyeOff className="w-4 h-4" />
                  <span>СКРЫТЬ</span>
                </button>
                <button 
                  onClick={() => { if(window.confirm('Удалить вакансию навсегда?')) deleteVacancy(vacancy.id) }}
                  className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-red-100 transition-all border border-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>УДАЛИТЬ</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
