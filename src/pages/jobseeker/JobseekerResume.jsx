import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';

export default function JobseekerResume() {
  const { currentUser } = useAuth();

  // Check if profile is filled enough to make a resume
  const hasProfile = currentUser?.firstName && currentUser?.phone;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Моё резюме</h1>
      </div>

      {!hasProfile ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[360px]">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Резюме не заполнено</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xs">
            Сначала заполните профиль — личную информацию и профессиональные навыки. После этого вы сможете создать резюме.
          </p>
          <Link
            to="/jobseeker/profile"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Заполнить профиль</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          {/* Resume preview */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">
                {currentUser.firstName} {currentUser.lastName}
              </h2>
              {currentUser.position && (
                <p className="text-blue-600 font-semibold mt-1">{currentUser.position}</p>
              )}
            </div>
            <Link to="/jobseeker/profile" className="text-sm text-blue-600 hover:underline font-semibold">
              Редактировать
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 text-sm">
            {/* Contact Info */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Контакты</p>
              <div className="space-y-1.5">
                {currentUser.phone && <p><span className="font-semibold text-gray-500">Телефон:</span> <span className="text-gray-800">{currentUser.phone}</span></p>}
                <p><span className="font-semibold text-gray-500">Email:</span> <span className="text-gray-800">{currentUser.email}</span></p>
                {currentUser.city && <p><span className="font-semibold text-gray-500">Город:</span> <span className="text-gray-800">{currentUser.city}, {currentUser.country}</span></p>}
              </div>
            </div>

            {/* Skills */}
            {currentUser.skills && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Навыки</p>
                <p className="text-gray-700">{currentUser.skills}</p>
              </div>
            )}

            {/* Experience */}
            {currentUser.experience && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Опыт работы</p>
                <p className="text-gray-700 whitespace-pre-line">{currentUser.experience}</p>
              </div>
            )}

            {/* Education */}
            {currentUser.education && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Образование</p>
                <p className="text-gray-700 whitespace-pre-line">{currentUser.education}</p>
              </div>
            )}

            {/* About */}
            {currentUser.about && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">О себе</p>
                <p className="text-gray-700 whitespace-pre-line">{currentUser.about}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
