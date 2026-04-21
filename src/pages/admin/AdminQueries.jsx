import React, { useState, useEffect } from 'react';
import { Trash2, MessageSquare, Square, CheckSquare, Search, ChevronDown, Check } from 'lucide-react';

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem('admin_queries') || '[]');
    if (existing.length === 0) {
      const mock = [
        { id: 1, name: 'Айжан', phone: '+996 (706) 306-750', message: 'Добрый день! Я не могу зайти в свой личный кабинет. Это по какой причине может быть?', date: '15 июня, 12:43', status: 'new' },
        { id: 2, name: 'Алина', phone: '+996 (706) 306-750', message: 'Добрый день! Я не могу зайти в свой личный кабинет. Это по какой причине может быть?', date: '15 июня, 12:43', status: 'new' },
        { id: 3, name: 'Акылай', phone: '+996 (706) 306-750', message: 'Добрый день! Я не могу зайти в свой личный кабинет. Это по какой причине может быть?', date: '15 июня, 12:43', status: 'new' },
      ];
      localStorage.setItem('admin_queries', JSON.stringify(mock));
      setQueries(mock);
    } else {
      setQueries(existing);
    }
  }, []);

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleMarkAsRead = (id) => {
    const updated = queries.map(q => q.id === id ? { ...q, status: 'read' } : q);
    localStorage.setItem('admin_queries', JSON.stringify(updated));
    setQueries(updated);
  };

  const handleDelete = (id) => {
    const updated = queries.filter(q => q.id !== id);
    localStorage.setItem('admin_queries', JSON.stringify(updated));
    setQueries(updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Запросы на поддержку</h1>
        <div className="flex items-center space-x-3">
           {selected.length > 0 && (
              <button className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl border border-red-100 text-sm font-bold hover:bg-red-100 transition-all">
                <Trash2 className="w-4 h-4" />
                <span>Удалить ({selected.length})</span>
              </button>
           )}
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">№</th>
                <th className="py-5 px-6 text-center w-12">
                   <button className="text-gray-300 hover:text-blue-600 transition-colors">
                      <Square className="w-5 h-5" />
                   </button>
                </th>
                <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">ИМЯ</th>
                <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-wrap max-w-xs">ТЕЛЕФОН / EMAIL</th>
                <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">СООБЩЕНИЕ</th>
                <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">ДАТА ОТПРАВКИ</th>
                <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">ДЕЙСТВИЯ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {queries.length === 0 ? (
                <tr>
                   <td colSpan="7" className="py-20 text-center text-gray-400 font-bold">Запросов пока нет</td>
                </tr>
              ) : (
                queries.map((q, idx) => (
                  <tr key={q.id} className={`hover:bg-gray-50/50 transition-colors ${q.status === 'read' ? 'opacity-60' : ''}`}>
                    <td className="py-6 px-6 text-sm text-gray-500 font-bold text-center">{idx + 1}</td>
                    <td className="py-6 px-6 text-center">
                       <button onClick={() => toggleSelect(q.id)} className="text-gray-300 hover:text-blue-500 transition-colors">
                          {selected.includes(q.id) ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5" />}
                       </button>
                    </td>
                    <td className="py-6 px-6 text-sm font-bold text-gray-900">{q.name}</td>
                    <td className="py-6 px-6 text-sm text-gray-500 font-medium whitespace-nowrap">{q.phone}</td>
                    <td className="py-6 px-6">
                       <p className="text-xs font-bold text-gray-600 leading-relaxed max-w-md line-clamp-2">
                         {q.message}
                       </p>
                    </td>
                    <td className="py-6 px-6 text-xs text-gray-400 font-bold text-center whitespace-nowrap">{q.date}</td>
                    <td className="py-6 px-6">
                      <div className="flex items-center justify-center space-x-2">
                        {q.status === 'new' ? (
                          <button 
                            onClick={() => handleMarkAsRead(q.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all"
                          >
                            Ответить
                          </button>
                        ) : (
                          <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase">
                             <Check className="w-3 h-3" />
                             <span>Принято</span>
                          </div>
                        )}
                        <button 
                          onClick={() => handleDelete(q.id)}
                          className="p-2 text-gray-300 hover:text-red-500 border border-transparent hover:border-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
