import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import RecentJobs from '../components/RecentJobs';
import CTAs from '../components/CTAs';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-[#f0f4fa] via-white to-white flex flex-col min-h-screen">
      <Header />
      <Hero />
      <RecentJobs />
      <CTAs />
      <Footer />
    </div>
  );
};

export default Home;
