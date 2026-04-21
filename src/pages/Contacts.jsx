import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Camera, Globe } from 'lucide-react';

export default function Contacts() {
  const [formData, setFormData] = useState({ name: '', email: '', topic: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: 'success', text: 'Спасибо! Ваше сообщение отправлено, мы ответим вам в ближайшее время.' });
    setFormData({ name: '', email: '', topic: '', message: '' });
    setTimeout(() => setStatus({ type: '', text: '' }), 5000);
  };

  const infoItem = (icon, label, value, subValue) => (
    <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="p-3 bg-blue-50 rounded-xl">
        {React.cloneElement(icon, { className: "w-5 h-5 text-blue-600" })}
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-black text-gray-900">{value}</p>
        {subValue && <p className="text-xs text-gray-500 font-medium mt-1">{subValue}</p>}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-16">
        <h1 className="text-[40px] font-black text-gray-900 leading-tight tracking-tight mb-4">Контакты</h1>
        <p className="text-gray-500 text-base max-w-2xl font-medium">
          Мы всегда на связи и готовы обсудить ваши предложения или помочь с возникшими трудностями. Выберите удобный способ связи.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-12">
        
        {/* Left Side: Info & Socials */}
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {infoItem(<Mail />, "ЭЛЕКТРОННАЯ ПОЧТА", "support@border.kg", "Отвечаем в течение 2 часов")}
            {infoItem(<Phone />, "ТЕЛЕФОН ПОДДЕРЖКИ", "+996 555 12-34-56", "Пн-Пт, с 09:00 до 18:00")}
            {infoItem(<MapPin />, "НАШ ОФИС", "г. Бишкек, ул. Горького 1/1", "Технопарк, 3 этаж")}
            {infoItem(<Globe />, "ВЕБ-САЙТ", "www.border.kg", "Официальный портал")}
          </div>

          <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-10">
               <Send className="w-40 h-40" />
             </div>
             <h3 className="text-xl font-black mb-2">Наши социальные сети</h3>
             <p className="text-gray-400 text-sm mb-8 max-w-xs font-medium">Подписывайтесь на нас в соцсетях, чтобы быть в курсе последних обновлений.</p>
             <div className="flex space-x-6">
                <a href="#" className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"><MessageCircle className="w-5 h-5"/></div>
                  <span className="text-xs font-bold">Telegram</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-white hover:text-pink-400 transition-colors">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"><Camera className="w-5 h-5"/></div>
                  <span className="text-xs font-bold">Instagram</span>
                </a>
             </div>
          </div>
        </div>

        {/* Right Side: Feedback Form */}
        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-xl shadow-blue-900/5 animate-in fade-in slide-in-from-right-4 duration-500">
          <h3 className="text-xl font-black text-gray-900 mb-6">Напишите нам</h3>
          {status.text && (
            <div className={`mb-6 p-4 rounded-xl text-xs font-bold ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700'}`}>
              {status.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">ВАШЕ ИМЯ</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Иван Иванов" 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium mt-1.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">EMAIL</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="help@mail.kg" 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium mt-1.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">ТЕМА ОБРАЩЕНИЯ</label>
              <input 
                type="text" 
                value={formData.topic}
                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                placeholder="Предложение по сотрудничеству" 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium mt-1.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">СООБЩЕНИЕ</label>
              <textarea 
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Введите ваше сообщение здесь..."
                className="w-full h-32 px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium mt-1.5 resize-none"
              ></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-sm font-black transition-all shadow-lg shadow-blue-500/25 mt-4 flex items-center justify-center space-x-2">
              <Send className="w-4 h-4" />
              <span>ОТПРАВИТЬ</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
