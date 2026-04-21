import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Save, Building, Camera, Edit3 } from 'lucide-react';

export default function Profile() {
  const { currentUser, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    companyName: currentUser?.companyName || '',
    aboutCompany: currentUser?.aboutCompany || '',
    photo: currentUser?.photo || null
  });
  const fileInputRef = React.useRef(null);

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setMessage('Профиль успешно обновлен!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center space-x-6 mb-10 pb-8 border-b border-gray-50">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-white shadow-md flex items-center justify-center text-blue-600 text-2xl font-bold overflow-hidden">
            {formData.photo ? (
              <img src={formData.photo} alt="profile" className="w-full h-full object-cover" />
            ) : (
              formData.name.substring(0,2).toUpperCase() || 'US'
            )}
          </div>
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all border-2 border-white"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handlePhotoChange} 
            className="hidden" 
            accept="image/*" 
          />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Настройки профиля</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Персонализируйте информацию о вашей компании</p>
        </div>
      </div>

      {message && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm font-medium">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Имя / Название профиля</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <User className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-11 pr-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Mail className="w-5 h-5" />
            </div>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              readOnly
              className="w-full pl-11 pr-5 py-3.5 bg-gray-100 border border-gray-200 rounded-xl text-sm outline-none text-gray-500 font-medium cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">Email нельзя изменить после регистрации</p>
        </div>

        {currentUser?.role === 'employer' && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Название компании</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Building className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full pl-11 pr-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                  placeholder="ООО Ромашка"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">О компании</label>
              <div className="relative">
                <div className="absolute top-4 left-4 pointer-events-none text-gray-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <textarea 
                  name="aboutCompany"
                  value={formData.aboutCompany}
                  onChange={handleChange}
                  placeholder="Расскажите о вашей компании, её ценностях и преимуществах..."
                  className="w-full pl-11 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium h-40 resize-none"
                />
              </div>
            </div>
          </>
        )}

        <div className="pt-4">
          <button type="submit" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/20">
            <Save className="w-4 h-4" />
            <span>Сохранить изменения</span>
          </button>
        </div>
      </form>
    </div>
  );
}
