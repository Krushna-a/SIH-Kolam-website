import React, { useState, useEffect } from "react";
import pottery from "../assets/AI-Generated-Pattern.png";
import pattern from "../assets/Mathematical Pottery.png";
import saree from "../assets/Sacred Geometry Saree image.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [activeDot, setActiveDot] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const kolamPatterns = [
    { name: "Symmetrical Grid", complexity: "Advanced", dots: 9 },
    { name: "Floral Mandala", complexity: "Intermediate", dots: 7 },
    { name: "Geometric Wave", complexity: "Beginner", dots: 5 }
  ];

  const marketplaceItems = [
    {
      id: 1,
      title: "Sacred Geometry Saree",
      price: "₹4,299",
      image:  saree, // "https://images.unsplash.com/photo-1610030461379-9db0b7c6a3d3?auto=format&fit=crop&w=400&h=500&q=80",
      artisan: "Weavers of Tamil Nadu",
      pattern: "Traditional Pulli Kolam"
    },
    {
      id: 2,
      title: "Mathematical Pottery",
      price: "₹2,499",
      image: pattern,//"https://images.unsplash.com/photo-1589310243389-5c43283f84f4?auto=format&fit=crop&w=400&h=500&q=80",
      artisan: "Clay Artisans Collective",
      pattern: "Fractal Design Series"
    },
    {
      id: 3,
      title: "Algorithmic Textiles",
      price: "₹3,599",
      image: pottery, //"https://images.unsplash.com/photo-1616628182501-45c776f3a7d2?auto=format&fit=crop&w=400&h=500&q=80",
      artisan: "Digital Weave Studio",
      pattern: "AI-Generated Pattern"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDE1D8] via-[#F5ECE4] to-[#E8D9CD] text-[#4C290C] overflow-hidden">
      {/* Animated Background Patterns */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-[#A24C1D] rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-[#4C290C] rotate-45 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#EFD591] rounded-full opacity-20 animate-ping"></div>
      </div>

      {/* Navigation Progress */}
      <div className="fixed top-0 left-0 w-full h-1 bg-[#EFD591] z-50">
        <div 
          className="h-full bg-[#A24C1D] transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Hero Section - Interactive Kolam Grid */}
      <section className="min-h-screen flex items-center justify-center relative px-4">
        <div className="text-center max-w-6xl mx-auto">
          {/* Animated Dot Grid Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="grid grid-cols-5 gap-8">
              {[...Array(25)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-[#4C290C] rounded-full animate-pulse" 
                  style={{ animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4C290C] to-[#A24C1D]">
              Kolam AI
            </span>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#EFD591] rounded-full animate-ping"></div>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 font-light max-w-3xl mx-auto leading-relaxed">
            Where <span className="font-semibold text-[#A24C1D]">ancient symmetry</span> meets 
            <span className="font-semibold text-[#4C290C]"> modern algorithms</span>. 
            Preserving cultural mathematics through artificial intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="group relative overflow-hidden bg-[#4C290C] text-[#EFD591] px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform duration-300">
              <span className="relative z-10" onClick={()=> navigate("/kolam")} >Analyse Kolam Designs</span>
              <div className="absolute inset-0 bg-[#A24C1D] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>
            <button className="flex items-center gap-2 text-[#4C290C] hover:text-[#A24C1D] transition-colors duration-300">
              <div className="w-12 h-12 rounded-full border-2 border-[#4C290C] flex items-center justify-center hover:border-[#A24C1D]">
                <span className="text-lg">⟳</span>
              </div>
              Watch AI Generate
            </button>
          </div>

          {/* Interactive Pattern Preview */}
          <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-8 max-w-2xl mx-auto border border-white/30">
            <div className="flex gap-4 mb-6">
              {kolamPatterns.map((pattern, index) => (
                <button
                  key={index}
                  onClick={() => setActiveDot(index)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    activeDot === index 
                      ? 'bg-[#A24C1D] text-white' 
                      : 'bg-white/80 text-[#4C290C] hover:bg-white'
                  }`}
                >
                  {pattern.name}
                </button>
              ))}
            </div>
            
            <div className="relative h-48 flex items-center justify-center">
              {/* Animated Kolam Pattern */}
              <div className="relative">
                {/* Dot Grid */}
                <div className={`grid gap-4 ${activeDot === 0 ? 'grid-cols-3' : activeDot === 1 ? 'grid-cols-4' : 'grid-cols-2'}`}>
                  {[...Array(kolamPatterns[activeDot].dots)].map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-[#A24C1D] rounded-full animate-bounce" 
                      style={{ animationDelay: `${i * 0.2}s` }}></div>
                  ))}
                </div>
                
                {/* Animated Lines */}
                <div className="absolute inset-0">
                  <div className="w-full h-0.5 bg-[#EFD591] animate-pulse"></div>
                  <div className="h-full w-0.5 bg-[#EFD591] animate-pulse mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mathematical Foundation Section */}
      <section className="min-h-screen py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The <span className="text-[#A24C1D]">Algorithm</span> of Tradition
            </h2>
            <p className="text-xl text-[#262624] max-w-3xl mx-auto">
              Every Kolam is a mathematical equation waiting to be solved. 
              Our AI deciphers the ancient code of symmetry and repetition.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Mathematical Visualization */}
            <div className="relative h-96 bg-gradient-to-br from-white/50 to-white/20 rounded-3xl p-8 backdrop-blur-sm border border-white/30">
              <div className="absolute top-8 left-8 text-2xl">Σ</div>
              <div className="absolute bottom-8 right-8 text-2xl">π</div>
              
              <div className="flex items-center justify-center h-full">
                <div className="relative">
                  {/* Animated Geometry */}
                  <div className="w-48 h-48 border-4 border-[#A24C1D] rounded-full animate-spin-slow"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border-2 border-[#EFD591] rotate-45 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mathematical Principles */}
            <div className="space-y-8">
              {[
                { symbol: "⏣", title: "Sacred Geometry", desc: "Golden ratios and Fibonacci sequences in every curve" },
                { symbol: "∞", title: "Infinite Symmetry", desc: "Rotational and reflectional symmetry patterns" },
                { symbol: "Δ", title: "Fractal Complexity", desc: "Self-repeating patterns at varying scales" }
              ].map((principle, index) => (
                <div key={index} className="flex items-start gap-4 group cursor-pointer">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {principle.symbol}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-[#A24C1D] transition-colors duration-300">
                      {principle.title}
                    </h3>
                    <p className="text-[#262624] leading-relaxed">
                      {principle.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Marketplace - Gallery Style */}
      <section className="min-h-screen py-20 px-4 bg-white/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Artisan <span className="text-[#A24C1D]">Algorithm</span>
            </h2>
            <p className="text-xl text-[#262624] max-w-3xl mx-auto">
              Where AI-generated patterns become tangible art. Each piece tells a story of cultural mathematics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {marketplaceItems.map((item, index) => (
              <div key={item.id} className="group relative">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-white/50 backdrop-blur-sm border border-white/30">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white text-sm font-light">{item.pattern}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-2">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-[#4C290C]">{item.title}</h3>
                      <span className="text-2xl font-bold text-[#A24C1D]">{item.price}</span>
                    </div>
                    <p className="text-sm text-[#262624] mb-4">by {item.artisan}</p>
                  </div>
                </div>

                {/* Floating Mathematical Annotation */}
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-[#EFD591] rounded-full flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Artisan Call to Action */}
          <div className="text-center mt-16">
            <div className="inline-block bg-gradient-to-r from-white/50 to-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30">
              <h3 className="text-2xl font-bold mb-4">Are you a mathematical artist?</h3>
              <p className="mb-6 max-w-2xl">Join our algorithm. Transform your traditional patterns into AI-assisted masterpieces.</p>
              <button className="bg-[#4C290C] text-[#EFD591] px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300" onClick={()=> navigate("/collection")}>
                Become a Digital Artisan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Process Visualization */}
      <section className="min-h-screen py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The <span className="text-[#A24C1D]">Neural</span> Kolam
            </h2>
            <p className="text-xl text-[#262624] max-w-3xl mx-auto">
              How artificial intelligence learns the language of traditional patterns
            </p>
          </div>

          <div className="relative h-96 bg-gradient-to-br from-white/30 to-white/10 rounded-3xl p-8 backdrop-blur-sm border border-white/20">
            {/* Animated Neural Network */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Network Nodes */}
                <div className="flex gap-12 mb-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-6 h-6 bg-[#A24C1D] rounded-full animate-pulse"></div>
                  ))}
                </div>
                
                {/* Connecting Lines */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#A24C1D] to-[#EFD591] animate-pulse"></div>
                
                {/* Kolam Pattern Output */}
                <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-[#4C290C] rounded-full"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;