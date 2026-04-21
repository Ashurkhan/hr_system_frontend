import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useVacancy } from '../contexts/VacancyContext';

const JobCard = ({ vacancy, onClick }) => {
  const { company, city, position, category, salary, employmentType, experience } = vacancy;
  
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer group animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      {/* Company Info */}
      <div className="flex items-center space-x-4 w-full md:w-1/4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-blue-600 bg-blue-50 border border-blue-100 font-bold text-xl shadow-sm uppercase">
          {company?.charAt(0) || 'C'}
        </div>
        <div>
          <p className="text-[11px] text-gray-400 mb-0.5 uppercase tracking-wider font-semibold">Компания</p>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{company}</h3>
          <p className="text-sm text-gray-500 flex items-center mt-0.5 font-medium">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {city}
          </p>
        </div>
      </div>

      {/* Job Title & Category */}
      <div className="w-full md:w-[30%]">
        <p className="text-[11px] text-gray-400 mb-0.5 uppercase tracking-wider font-semibold">Должность</p>
        <h3 className="font-bold text-gray-900 line-clamp-1">{position}</h3>
        <span className="inline-block mt-2 px-3 py-1 bg-[#f0f4fa] text-gray-600 rounded-lg text-xs font-semibold">
          {category}
        </span>
      </div>

      {/* Salary & Type */}
      <div className="w-full md:w-1/4">
        <p className="text-[11px] text-gray-400 mb-0.5 uppercase tracking-wider font-semibold">Оклад</p>
        <div className="font-bold text-gray-900">{salary || 'По договоренности'}</div>
        <div className="text-sm text-gray-500 flex items-center mt-0.5 font-medium line-clamp-1">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          {employmentType}
        </div>
      </div>
      
      {/* Experience */}
      <div className="w-full md:w-[15%]">
         <p className="text-[11px] text-gray-400 mb-0.5 uppercase tracking-wider font-semibold">Опыт работы</p>
         <div className="font-semibold text-gray-800">{experience}</div>
      </div>
    </div>
  );
};

const RecentJobs = () => {
  const { vacancies } = useVacancy();
  const navigate = useNavigate();

  // Get the 3 latest vacancies
  const latestJobs = [...vacancies].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);

  return (
    <section className="bg-[#f8fafd] py-20 relative z-10 border-t border-gray-100">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8">
        <div className="mb-10 lg:pl-4">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Последние вакансии</h2>
          <p className="text-gray-500 font-medium">Найдите работу, которая соответствует вашим требованиям</p>
        </div>
        
        <div className="space-y-4">
          {latestJobs.length > 0 ? (
            latestJobs.map((job) => (
              <JobCard 
                key={job.id} 
                vacancy={job} 
                onClick={() => navigate(`/jobseeker/vacancy/${job.id}`)}
              />
            ))
          ) : (
             <div className="bg-white p-10 rounded-3xl text-center border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-medium">Вакансий пока нет. Будьте первым!</p>
             </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => navigate('/jobseeker')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-black text-sm tracking-tight transition-all shadow-xl shadow-blue-500/25 hover:-translate-y-1 active:scale-95"
          >
            Посмотреть все вакансии
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecentJobs;
