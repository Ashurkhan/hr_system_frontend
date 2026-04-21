import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-gray-100 mt-auto">
      <div className="max-w-[1024px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 mb-16">
          
          <div className="md:col-span-3 lg:col-span-3">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-7 h-7 rounded bg-blue-500 transform rotate-45 flex items-center justify-center relative shadow-sm">
                 <div className="w-3.5 h-3.5 rounded-[3px] bg-blue-200 absolute -top-[3px] -right-[3px]" />
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight ml-2">Border</span>
            </div>
          </div>

          <div className="md:col-span-2">
             <h4 className="font-bold text-gray-900 mb-5 text-[15px]">Контакты</h4>
             <ul className="space-y-4 text-xs font-medium text-gray-500">
               <li>Кыргызстан, г. Бишкек</li>
               <li>ул. Токтогула 112/1</li>
               <li className="text-gray-900">+996 (700) 11 22 33</li>
             </ul>
          </div>

          <div className="md:col-span-2">
             <h4 className="font-bold text-gray-900 mb-5 text-[15px]">Соискателям</h4>
             <ul className="space-y-4 text-xs font-medium text-gray-500">
               <li><a href="#" className="hover:text-blue-600 transition-colors">Личный кабинет</a></li>
               <li><a href="#" className="hover:text-blue-600 transition-colors">Вакансии</a></li>
               <li><a href="#" className="hover:text-blue-600 transition-colors">Работодатели</a></li>
             </ul>
          </div>

          <div className="md:col-span-2">
             <h4 className="font-bold text-gray-900 mb-5 text-[15px]">Работодателям</h4>
             <ul className="space-y-4 text-xs font-medium text-gray-500">
               <li><a href="#" className="hover:text-blue-600 transition-colors">Личный кабинет</a></li>
               <li><a href="#" className="hover:text-blue-600 transition-colors">Опубликовать вакансию</a></li>
               <li><a href="#" className="hover:text-blue-600 transition-colors">Кандидаты</a></li>
             </ul>
             
             <h4 className="font-bold text-gray-900 mb-5 mt-8 text-[15px]">Меню</h4>
             <ul className="space-y-4 text-xs font-medium text-gray-500">
               <li><a href="#" className="hover:text-blue-600 transition-colors">Вакансии</a></li>
               <li><a href="#" className="hover:text-blue-600 transition-colors">FAQ</a></li>
               <li><a href="#" className="hover:text-blue-600 transition-colors">Контакты</a></li>
             </ul>
          </div>

          <div className="md:col-span-3">
             <h4 className="font-bold text-gray-900 mb-5 text-[15px]">Оставить заявку</h4>
             <form className="space-y-3">
                <input type="text" placeholder="Укажите имя" className="w-full px-5 py-3 bg-[#f8fafd] rounded-xl text-xs font-medium border border-transparent outline-none focus:border-blue-200 focus:bg-white transition-all placeholder-gray-400"/>
                <input type="text" placeholder="Укажите номер телефона" className="w-full px-5 py-3 bg-[#f8fafd] rounded-xl text-xs font-medium border border-transparent outline-none focus:border-blue-200 focus:bg-white transition-all placeholder-gray-400"/>
                <input type="email" placeholder="Сообщение" className="w-full px-5 py-3 bg-[#f8fafd] rounded-xl text-xs font-medium border border-transparent outline-none focus:border-blue-200 focus:bg-white transition-all placeholder-gray-400"/>
                <button className="bg-blue-600 hover:bg-blue-700 text-white w-max px-8 py-3 rounded-full text-xs font-bold transition-colors mt-2 shadow-md shadow-blue-500/20">Отправить</button>
             </form>
          </div>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-100 text-[11px] text-gray-400 font-medium">
           <p>© 2023, Border inc., All Right Reserved</p>
           <div className="flex space-x-5 mt-4 md:mt-0">
              <a href="#" className="hover:text-gray-900 transition-colors uppercase tracking-widest">In</a>
              <a href="#" className="hover:text-gray-900 transition-colors uppercase tracking-widest">Fb</a>
              <a href="#" className="hover:text-gray-900 transition-colors uppercase tracking-widest">Tw</a>
              <a href="#" className="hover:text-gray-900 transition-colors uppercase tracking-widest">Ig</a>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
