import React from 'react';

const CategoryCard = ({ icon, title, count, colorClass, bgClass }) => (
  <div className="bg-white rounded-[20px] p-5 flex items-center space-x-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bgClass} ${colorClass} text-2xl`}>
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-gray-900 leading-tight mb-1 text-[15px]">{title}</h3>
      <p className="text-xs text-gray-500 font-medium">{count} вакансий</p>
    </div>
  </div>
);

const PopularCategories = () => {
  const categories = [
    { icon: "🎨", title: "Искусство, развлечения", count: 35, colorClass: "text-blue-600", bgClass: "bg-blue-50" },
    { icon: "💻", title: "Информационные технологии", count: 120, colorClass: "text-indigo-600", bgClass: "bg-indigo-50" },
    { icon: "📢", title: "Маркетинг и PR", count: 350, colorClass: "text-amber-500", bgClass: "bg-amber-50" },
    { icon: "🔬", title: "Наука, образование", count: 35, colorClass: "text-green-600", bgClass: "bg-green-50" },
    { icon: "📊", title: "Бухгалтерия", count: 120, colorClass: "text-gray-500", bgClass: "bg-gray-100" },
    { icon: "👥", title: "Административный персонал", count: 350, colorClass: "text-cyan-500", bgClass: "bg-cyan-50" },
    { icon: "🏥", title: "Медицина, фармацевтика", count: 12, colorClass: "text-rose-500", bgClass: "bg-rose-50" },
    { icon: "💄", title: "Фитнес, салоны красоты", count: 35, colorClass: "text-emerald-500", bgClass: "bg-emerald-50" },
    { icon: "🚚", title: "Транспорт, логистика", count: 140, colorClass: "text-orange-500", bgClass: "bg-orange-50" },
  ];

  return (
    <section className="bg-white py-20 pb-28">
      <div className="max-w-[1024px] mx-auto px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-10 text-center md:text-left pl-2">Популярные категории</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, idx) => (
            <CategoryCard key={idx} {...cat} />
          ))}
        </div>

        {/* Pagination Dots Simulator */}
        <div className="flex items-center justify-center mt-12 space-x-4">
          <span className="text-blue-600 font-bold text-sm tracking-widest">01</span>
          <div className="w-24 h-[2px] bg-gray-100 relative rounded-full overflow-hidden">
             <div className="absolute top-0 left-0 h-full w-1/6 bg-blue-600 rounded-full"></div>
          </div>
          <span className="text-gray-400 font-bold text-sm tracking-widest">06</span>
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
