import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { useVacancy } from '../../contexts/VacancyContext';
import { useAuth } from '../../contexts/AuthContext';

const CATEGORIES = [
  'Автомобильный бизнес',
  'Административный персонал',
  'Безопасность',
  'Высший и средний менеджмент',
  'Добыча сырья',
  'Домашний обслуживающий персонал',
  'Закупки'
];
const POSITIONS = [
  'Административный ассистент',
  'Бухгалтер',
  'Веб-разработчик',
  'Главный бухгалтер',
  'Дизайнер',
  'Контент-менеджер'
];
const EXPERIENCES = ['Нет опыта', 'От 1 года до 3 лет', 'От 3 до 6 лет', 'Более 6 лет'];
const EMP_TYPES = ['Полная занятость', 'Частичная занятость', 'Проектная работа', 'Стажировка', 'Временная занятость'];
const ITEMS_PER_PAGE = 5;

export default function JobseekerDashboard() {
  const { vacancies } = useVacancy();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [activeTab, setActiveTab] = useState('vacancies');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    position: '',
    country: '',
    city: '',
    period: '',
    experience: '',
    employmentType: '',
    salarySort: 'down',
    pubDateSort: 'new'
  });

  // Sync search from URL
  useEffect(() => {
    if (initialSearch) {
      setFilters(prev => ({ ...prev, search: initialSearch }));
    }
  }, [initialSearch]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1); // reset to page 1 on filter change
  };

  const handleResetFilters = () => {
    setFilters({
      search: '', category: '', position: '', country: '', city: '', period: '',
      experience: '', employmentType: '', salarySort: 'down', pubDateSort: 'new'
    });
    setCurrentPage(1);
  };

  // Mock: my applications
  const myApplications = JSON.parse(localStorage.getItem(`applications_${currentUser?.id}`) || '[]');

  // Apply filters — show ALL vacancies with status 'Открыто', including employer-created ones
  let filteredVacancies = vacancies.filter(v => v.status === 'Открыто');

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filteredVacancies = filteredVacancies.filter(v =>
      v.position?.toLowerCase().includes(q) ||
      (v.company && v.company.toLowerCase().includes(q))
    );
  }
  if (filters.category) filteredVacancies = filteredVacancies.filter(v => v.category === filters.category);
  if (filters.experience) filteredVacancies = filteredVacancies.filter(v => v.experience === filters.experience);
  if (filters.employmentType) filteredVacancies = filteredVacancies.filter(v => v.employmentType === filters.employmentType);
  if (filters.country) filteredVacancies = filteredVacancies.filter(v => v.country === filters.country);

  // Sorting
  filteredVacancies = [...filteredVacancies].sort((a, b) => {
    if (filters.pubDateSort === 'new') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredVacancies.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedVacancies = filteredVacancies.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  // Page numbers to show (max 5 buttons)
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(1, safePage - delta);
    const right = Math.min(totalPages, safePage + delta);
    for (let i = left; i <= right; i++) pages.push(i);
    return pages;
  };

  const filterSelectCls = "w-full outline-none text-sm text-gray-700 bg-transparent flex-1 appearance-none cursor-pointer";
  const filterLabelCls = "block text-[10px] uppercase font-bold text-gray-500 mb-1.5";
  const selectBoxWrapper = "flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 cursor-pointer";

  return (
    <div className="flex gap-8 relative items-start">
      
      {/* LEFT SIDEBAR - FILTERS */}
      <div className="w-[280px] flex-shrink-0 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-24">
        <label className={filterLabelCls}>Поиск вакансий</label>
        <div className="relative mb-5">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Поиск"
            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500 focus:bg-white transition-all placeholder-gray-400"
          />
        </div>

        <div className="space-y-5">
          <div>
            <label className={filterLabelCls}>Отрасль</label>
            <div className={selectBoxWrapper}>
              <select name="category" value={filters.category} onChange={handleFilterChange} className={filterSelectCls}>
                <option value="">- Выберите -</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className="text-gray-400 text-[10px]">▼</span>
            </div>
          </div>

          <div>
            <label className={filterLabelCls}>Позиция</label>
            <div className={selectBoxWrapper}>
              <select name="position" value={filters.position} onChange={handleFilterChange} className={filterSelectCls}>
                <option value="">- Выберите -</option>
                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <span className="text-gray-400 text-[10px]">▼</span>
            </div>
          </div>

          <div>
            <label className={filterLabelCls}>Страна</label>
            <div className={selectBoxWrapper}>
              <select name="country" value={filters.country} onChange={handleFilterChange} className={filterSelectCls}>
                <option value="">- Выберите -</option>
                <option value="Кыргызстан">Кыргызстан</option>
                <option value="Казахстан">Казахстан</option>
              </select>
              <span className="text-gray-400 text-[10px]">▼</span>
            </div>
          </div>

          <div>
            <label className={filterLabelCls}>Опыт работы</label>
            <div className={selectBoxWrapper}>
              <select name="experience" value={filters.experience} onChange={handleFilterChange} className={filterSelectCls}>
                <option value="">- Выберите -</option>
                {EXPERIENCES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <span className="text-gray-400 text-[10px]">▼</span>
            </div>
          </div>

          <div>
            <label className={filterLabelCls}>Вид занятости</label>
            <div className={selectBoxWrapper}>
              <select name="employmentType" value={filters.employmentType} onChange={handleFilterChange} className={filterSelectCls}>
                <option value="">- Выберите -</option>
                {EMP_TYPES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <span className="text-gray-400 text-[10px]">▼</span>
            </div>
          </div>

          <div className="pt-2">
            <label className={filterLabelCls}>Заработная плата</label>
            <div className="space-y-2 mt-2">
              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" name="salarySort" value="down" checked={filters.salarySort === 'down'} onChange={handleFilterChange} className="accent-blue-600" />
                <span>По убыванию</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" name="salarySort" value="up" checked={filters.salarySort === 'up'} onChange={handleFilterChange} className="accent-blue-600" />
                <span>По возрастанию</span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <label className={filterLabelCls}>Дата публикации</label>
            <div className="space-y-2 mt-2">
              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" name="pubDateSort" value="new" checked={filters.pubDateSort === 'new'} onChange={handleFilterChange} className="accent-blue-600" />
                <span>Самые свежие</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" name="pubDateSort" value="old" checked={filters.pubDateSort === 'old'} onChange={handleFilterChange} className="accent-blue-600" />
                <span>Последние</span>
              </label>
            </div>
          </div>
        </div>

        <button 
          onClick={handleResetFilters}
          className="w-full mt-8 py-2.5 border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl text-sm font-semibold transition-colors"
        >
          Сбросить
        </button>
      </div>

      {/* RIGHT SIDE - CONTENT */}
      <div className="flex-1 w-full max-w-full overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-2xl px-6 pt-2">
          <button
            className={`pb-4 px-6 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'vacancies'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('vacancies')}
          >
            Вакансии
          </button>
          <button
            className={`pb-4 px-6 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'applications'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('applications')}
          >
            Мои Отклики {myApplications.length > 0 && <span className="ml-1 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">{myApplications.length}</span>}
          </button>
        </div>

        {/* Vacancies Tab */}
        {activeTab === 'vacancies' && (
          <div className="space-y-4">
            {/* Result count */}
            {filteredVacancies.length > 0 && (
              <p className="text-xs text-gray-400 font-semibold px-1">
                Найдено вакансий: <span className="text-blue-600 font-bold">{filteredVacancies.length}</span>
              </p>
            )}

            {filteredVacancies.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
                <Briefcase className="w-12 h-12 text-gray-200 mb-4" />
                <p className="text-gray-500 font-bold mb-2">Вакансий по вашему запросу не найдено</p>
                <button onClick={handleResetFilters} className="text-sm font-semibold text-blue-600 hover:underline mt-2">
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              paginatedVacancies.map((v) => (
                <div 
                  key={v.id} 
                  onClick={() => navigate(`/jobseeker/vacancy/${v.id}`)}
                  className="bg-white rounded-2xl border-2 border-transparent hover:border-blue-400 hover:shadow-md transition-all cursor-pointer p-5 flex items-center shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full border border-gray-100 bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">
                      {v.company ? v.company.substring(0, 2).toUpperCase() : v.position.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="ml-5 flex-1 grid grid-cols-3 gap-6">
                    {/* Col 1 */}
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Компания</p>
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{v.company || '—'}</p>
                      <div className="flex items-center space-x-1.5 mt-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">{[v.country, v.city].filter(Boolean).join(', ') || 'Локация не указана'}</span>
                      </div>
                    </div>
                    
                    {/* Col 2 */}
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Позиция</p>
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{v.position}</p>
                      <div className="flex items-center space-x-1.5 mt-2">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">{v.category || 'Отрасль не указана'}</span>
                      </div>
                    </div>
                    
                    {/* Col 3 */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Оклад</p>
                        <p className="text-sm font-bold text-gray-900">{v.salary || 'По договорённости'}</p>
                        <div className="flex items-center space-x-1.5 mt-2">
                          <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-500">{v.employmentType || '—'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Опыт работы</p>
                        <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md whitespace-nowrap">
                          {v.experience || '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* Working Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-1.5 pt-6">
                {/* Prev */}
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    safePage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Пред</span>
                </button>

                {/* First page + ellipsis */}
                {getPageNumbers()[0] > 1 && (
                  <>
                    <button onClick={() => setCurrentPage(1)} className="w-8 h-8 rounded-full text-sm font-bold text-gray-500 hover:bg-gray-100 flex items-center justify-center">1</button>
                    {getPageNumbers()[0] > 2 && <span className="text-gray-300 px-1">...</span>}
                  </>
                )}

                {/* Page numbers */}
                {getPageNumbers().map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center transition-colors ${
                      page === safePage
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Last page + ellipsis */}
                {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                  <>
                    {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && <span className="text-gray-300 px-1">...</span>}
                    <button onClick={() => setCurrentPage(totalPages)} className="w-8 h-8 rounded-full text-sm font-bold text-gray-500 hover:bg-gray-100 flex items-center justify-center">{totalPages}</button>
                  </>
                )}

                {/* Next */}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    safePage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  <span>След</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm min-h-[400px] p-6 lg:p-10">
            {myApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full pt-10 pb-20">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-gray-800 font-bold text-lg mb-2">У вас пока нет откликов</p>
                <p className="text-sm text-gray-500 mb-6 max-w-sm text-center">
                  Найдите подходящую вакансию и откликнитесь на неё, чтобы следить за статусом прямо здесь.
                </p>
                <button
                  onClick={() => setActiveTab('vacancies')}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all shadow-md shadow-blue-500/20"
                >
                  Найти вакансию
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myApplications.map((app) => (
                  <div key={app.id} onClick={() => navigate(`/jobseeker/vacancy/${app.vacancyId}`)} className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer hover:border-blue-200 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{app.company || 'Компания'}</p>
                      <h3 className="font-bold text-gray-900 text-base">{app.position}</h3>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5"><MapPin className='w-3 h-3'/> Дата отклика: {app.appliedAt}</p>
                    </div>
                    <div className="mt-3 md:mt-0 flex flex-col md:items-end">
                      <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-600 border border-blue-200 inline-block mb-1">
                        {app.status || 'На рассмотрении'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
