// src/pages/LandingPage.jsx
import { useState, useEffect } from "react";
import { client, urlFor } from "../sanityClient";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Info, Zap, CheckCircle, MessageCircle, Loader2, Star } from "lucide-react";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await client.fetch(`*[_type == "product"]`);
        const portfolioData = await client.fetch(`*[_type == "portfolio"]`);
        const testimonialData = await client.fetch(`*[_type == "testimonial"]`);
        setProducts(productData);
        setPortfolios(portfolioData);
        setTestimonials(testimonialData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="font-sans text-slate-900 bg-slate-50 scroll-smooth">
      {/* NAVBAR */}
      <nav className="fixed w-full top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-[100]">
        <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl italic shadow-lg shadow-red-200">S</div>
            <h1 className="font-extrabold text-xl uppercase tracking-tighter">Shaka<span className="text-red-600">Production</span></h1>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-600 uppercase tracking-widest">
            <a href="#home" className="hover:text-red-600 text-xs">Home</a>
            <a href="#produk" className="hover:text-red-600 text-xs">Produk</a>
            <a href="#portfolio" className="hover:text-red-600 text-xs">Portfolio</a>
            <a href="#testimonial" className="hover:text-red-600 text-xs">Testimoni</a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/paskibra-hero.jpg" alt="Hero" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-slate-50/100"></div>
        </div>
        <div className="relative z-20 max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-8xl font-black mb-6 leading-[1.1] text-slate-900">Atribut Paskibra <br /><span className="text-red-600">Kualitas Juara.</span></h2>
          <p className="mb-10 text-slate-600 max-w-2xl mx-auto text-lg font-medium">Produksi seragam premium dengan pengerjaan kilat, rapi, dan bergaransi.</p>
          <a href="#produk" className="bg-red-600 text-white px-10 py-4 rounded-2xl font-bold inline-flex items-center gap-2 text-lg">Lihat Katalog <ArrowRight size={20} /></a>
        </div>
      </section>

      {/* LAYANAN UTAMA */}
      <section id="produk" className="py-24 px-6 max-w-7xl mx-auto">
        <h3 className="text-4xl font-black mb-12 uppercase tracking-tight">Layanan Utama</h3>
        {loading ? (
          <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-red-600" size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((item, index) => (
              <div key={index} onClick={() => setSelectedProduct(item)} className="bg-white border p-4 rounded-[2.5rem] cursor-pointer hover:shadow-xl transition-all">
                <div className="overflow-hidden rounded-[2rem] aspect-[4/5] mb-4 bg-slate-100">
                  <img src={item.image ? urlFor(item.image).url() : "/placeholder.jpg"} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <h4 className="font-bold text-xl text-slate-800">{item.name}</h4>
                <p className="text-red-600 font-black text-sm">{item.price || "Hubungi Admin"}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="py-24 px-6 bg-white">
        <h3 className="text-4xl font-black text-center mb-16 uppercase italic tracking-widest">Hasil Produksi</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {portfolios.map((item, i) => (
            <div key={i} className="rounded-[2.5rem] overflow-hidden aspect-square border-4 shadow-md">
              <img src={item.image ? urlFor(item.image).url() : "/placeholder.jpg"} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONI */}
      <section id="testimonial" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-center text-4xl font-black mb-16 uppercase text-slate-300">Kepuasan Pelanggan</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border">
                <p className="text-slate-600 italic mb-8">"{t.message}"</p>
                <p className="font-black text-slate-900 uppercase text-xs">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL DETAIL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" />
            <div className="relative bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl z-[120] p-10 text-center">
              <img src={selectedProduct.image ? urlFor(selectedProduct.image).url() : "/placeholder.jpg"} className="w-full h-64 object-cover rounded-2xl mb-6" />
              <h4 className="text-3xl font-black mb-2">{selectedProduct.name}</h4>
              <p className="text-red-600 font-black text-xl mb-6">{selectedProduct.price}</p>
              <p className="text-slate-500 text-sm mb-8">{selectedProduct.description}</p>
              <a href={`https://wa.me/628120619997?text=Halo Shaka Production, saya tertarik dengan ${selectedProduct.name}`} className="bg-green-500 text-white px-10 py-4 rounded-2xl font-bold inline-flex items-center gap-2"><MessageCircle size={20} /> PESAN VIA WHATSAPP</a>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}