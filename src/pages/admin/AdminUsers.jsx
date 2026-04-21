import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Ban, Trash2, CheckSquare, Square, X } from 'lucide-react';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(allUsers);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  const filteredUsers = users.filter(u => 
    (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (roleFilter === '' || u.role === roleFilter)
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(u => u.id));
    }
  };

  const toggleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(sid => sid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleDeleteUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const remainingUsers = allUsers.filter(u => !selectedUsers.includes(u.id));
    localStorage.setItem('users', JSON.stringify(remainingUsers));
    setUsers(remainingUsers);
    setSelectedUsers([]);
    setShowDeleteModal(false);
    // Adjust page if current page becomes empty
    const newTotalPages = Math.ceil(remainingUsers.length / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleDeleteSingle = (id) => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const remainingUsers = allUsers.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(remainingUsers));
    setUsers(remainingUsers);
    setSelectedUsers(selectedUsers.filter(sid => sid !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Пользователи</h1>
        
        <div className="flex items-center space-x-3">
          {selectedUsers.length > 0 && (
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl border border-red-100 text-sm font-bold hover:bg-red-100 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Удалить выбранное ({selectedUsers.length})</span>
            </button>
          )}
          {selectedUsers.length > 0 && (
            <button 
              onClick={() => setSelectedUsers([])}
              className="px-4 py-2.5 text-blue-600 text-sm font-bold border border-blue-200 rounded-xl hover:bg-blue-50 transition-all"
            >
              Сбросить
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Поиск по имени или почте"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all font-medium shadow-sm"
          />
        </div>

        <div className="relative min-w-[200px]">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full appearance-none pl-5 pr-10 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold outline-none cursor-pointer focus:border-blue-500 transition-all shadow-sm"
          >
            <option value="">Все роли</option>
            <option value="employer">Работодатель</option>
            <option value="jobseeker">Соискатель</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">№</th>
                <th className="py-5 px-6 text-center w-12">
                   <button onClick={toggleSelectAll} className="text-gray-400 hover:text-blue-600 transition-colors">
                      {selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0 ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5" />}
                   </button>
                </th>
                <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">ФИО / Наименование компании</th>
                <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Роль</th>
                <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Электронная почта</th>
                <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center whitespace-nowrap">Последний визит</th>
                <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-20 text-center text-gray-400 font-bold">Ничего не найдено</td>
                </tr>
              ) : (
                paginatedUsers.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-5 px-6 text-sm text-gray-500 font-bold text-center">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                    <td className="py-5 px-6 text-center">
                       <button onClick={() => toggleSelectUser(user.id)} className="text-gray-300 hover:text-blue-500 transition-colors">
                          {selectedUsers.includes(user.id) ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5" />}
                       </button>
                    </td>
                    <td className="py-5 px-6">
                       <button onClick={() => navigate(`/admin/user/${user.id}`)} className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors text-left">
                          {user.name}
                       </button>
                    </td>
                    <td className="py-5 px-6">
                       <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest ${
                         user.role === 'employer' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                       }`}>
                         {user.role === 'employer' ? 'Работодатель' : 'Соискатель'}
                       </span>
                    </td>
                    <td className="py-5 px-6 text-sm text-gray-500 font-medium">{user.email}</td>
                    <td className="py-5 px-6 text-sm text-gray-400 font-medium text-center">15 июня, 12:43</td>
                    <td className="py-5 px-6">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="p-2 text-gray-300 hover:text-gray-900 border border-transparent hover:border-gray-100 rounded-lg transition-all" title="Блокировать">
                          <Ban className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { if(window.confirm('Удалить пользователя?')) handleDeleteSingle(user.id) }}
                          className="p-2 text-gray-300 hover:text-red-500 border border-transparent hover:border-red-50 rounded-lg transition-all" 
                          title="Удалить"
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

      {/* Real Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 py-4">
           <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
           >
             Пред.
           </button>
           
           {[...Array(totalPages)].map((_, i) => (
             <button 
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                currentPage === i + 1 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'
              }`}
             >
               {i + 1}
             </button>
           ))}

           <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="px-4 py-2 text-sm font-bold text-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
           >
             След.
           </button>
        </div>
      )}

      {/* Delete Multi Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-[40px] w-full max-w-md p-10 relative shadow-2xl animate-in zoom-in-95 duration-300">
              <button onClick={() => setShowDeleteModal(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900"><X /></button>
              <h3 className="text-xl font-black text-gray-900 mb-2 mt-4">Удалить выбранных пользователей</h3>
              <p className="text-gray-500 text-sm font-medium mb-10">Вы уверены, что хотите удалить выбранных пользователей ({selectedUsers.length})? Это действие необратимо.</p>
              
              <div className="flex space-x-4">
                 <button 
                  onClick={handleDeleteUsers}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl text-sm font-black transition-all shadow-lg shadow-red-500/30"
                 >
                   УДАЛИТЬ
                 </button>
                 <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-white border border-gray-100 text-gray-600 py-4 rounded-2xl text-sm font-black hover:bg-gray-50 transition-all"
                 >
                   ОТМЕНА
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
