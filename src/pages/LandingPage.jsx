// src/pages/LandingPage.jsx
import { useState, useEffect, useRef } from "react";
import { client, urlFor } from "../sanityClient";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Star, ShieldCheck, Phone, X
} from "lucide-react";

// --- KOMPONEN HYBRID AUTO-SCROLLER (BISA DI-SWIPE MANUAL) ---
const AutoScroller = ({ children, speed = 1 }) => {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let animationId;
    const scroll = () => {
      // Jika tidak sedang disentuh/di-hover, jalankan auto-scroll
      if (scrollRef.current && !isHovered) {
        scrollRef.current.scrollLeft += speed;
        // Logika Infinite Loop: Jika sudah setengah jalan, reset ke 0
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
          scrollRef.current.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };
    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered, speed]);

  return (
    <div
      ref={scrollRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      className="flex overflow-x-auto hide-scrollbar gap-4 md:gap-6 px-6 cursor-grab active:cursor-grabbing w-full pb-8"
    >
      {children}
    </div>
  );
};

export default function LandingPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await client.fetch(`*[_type == "product"] | order(_createdAt desc)`);
        const portfolioData = await client.fetch(`*[_type == "portfolio"] | order(_createdAt desc)[0..11]`);
        const testimonialData = await client.fetch(`*[_type == "testimonial"] | order(_createdAt desc)`);
        setProducts(productData);
        setPortfolios(portfolioData);
        setTestimonials(testimonialData);
        setLoading(false);
      } catch (error) {
        console.error("Error ambil data Sanity:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openProductModal = (product) => {
    document.body.style.overflow = 'hidden';
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    document.body.style.overflow = 'unset';
    setSelectedProduct(null);
  };

  // Logo WhatsApp Asli (SVG)
  const WhatsAppIcon = ({ size = 24, className = "" }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );

  return (
    <div className="font-sans text-slate-900 bg-white selection:bg-red-500 selection:text-white scroll-smooth relative overflow-hidden">
      
      {/* --- INJECT CSS CUSTOM --- */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- PREMIUM FLOATING WA BUTTON --- */}
      <motion.a 
        href="https://wa.me/6281220619997?text=Halo Shaka Production, saya tertarik untuk konsultasi atribut Paskibra."
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", repeatDelay: 1 }}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[200] bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-2xl shadow-green-500/40 flex items-center justify-center border-[3px] md:border-4 border-white hover:bg-[#1ebe57] transition-colors"
      >
        <WhatsAppIcon size={32} className="w-8 h-8 md:w-9 md:h-9" />
      </motion.a>

      {/* --- PRETRANDED NAVBAR (RESPONSIVE FIXED) --- */}
      <nav className="fixed w-full top-0 bg-white/95 backdrop-blur-xl border-b border-slate-100 z-[100] shadow-sm">
        <div className="flex justify-between items-center p-3 md:p-4 max-w-7xl mx-auto">
          {/* Logo Section */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-red-600 to-red-800 rounded-lg md:rounded-2xl flex items-center justify-center text-white font-black text-lg md:text-2xl italic shadow-md shadow-red-500/20">S</div>
            <h1 className="font-black text-lg md:text-2xl tracking-tighter uppercase text-slate-950">
              Shaka Production
            </h1>
          </div>
          
          {/* Menu Dekstop */}
          <div className="hidden lg:flex items-center gap-10 text-xs font-bold text-slate-600 uppercase tracking-[0.2em]">
            <a href="#home" className="hover:text-red-600 transition-colors">Home</a>
            <a href="#produk" className="hover:text-red-600 transition-colors">Produk</a>
            <a href="#portfolio" className="hover:text-red-600 transition-colors">Portfolio</a>
            <a href="#testimonial" className="hover:text-red-600 transition-colors">Testimoni</a>
          </div>
          
          {/* Button CTA Navbar */}
          <a href="#cta" className="bg-slate-950 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs tracking-wider uppercase hover:bg-red-600 transition-all shadow-md active:scale-95 flex items-center gap-2">
            <Phone size={14} /> 
            <span className="hidden sm:inline">Pesan Sekarang</span>
            <span className="sm:hidden">Pesan</span>
          </a>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative flex flex-col justify-center items-center text-center px-6 pt-32 pb-24 md:pt-40 md:pb-32 min-h-screen overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 z-0">
          <img src="/paskibra-hero.jpg" alt="Paskibra Background" className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-white"></div>
        </div>

        <div className="relative z-20 max-w-5xl mx-auto px-2 md:px-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur border border-slate-700 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-6 md:mb-8 shadow-2xl text-slate-300">
            <ShieldCheck size={14} className="text-red-500" /> <span className="hidden sm:inline">Partner Konveksi Atribut Paskibra Sejak 2015</span><span className="sm:hidden">Partner Atribut Paskibra Terpercaya</span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }} className="text-4xl sm:text-5xl md:text-8xl font-black mb-6 md:mb-8 leading-[1.05] tracking-tight text-white uppercase italic drop-shadow-2xl">
            Atribut Paskibra <br /> 
            <span className="text-red-600 drop-shadow-lg">Kualitas Juara.</span>
          </motion.h2>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }} className="mb-4 md:mb-4 text-slate-200 max-w-3xl mx-auto text-sm sm:text-lg md:text-xl leading-relaxed font-medium drop-shadow-md">
            Spesialis produksi seragam/kostum premium, sepatu latihan/dinas, dan atribut lengkap untuk Paskibra ataupun instansi lainnya.
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }} className="mb-10 md:mb-12 text-slate-200 max-w-3xl mx-auto text-sm sm:text-lg md:text-xl leading-relaxed font-medium drop-shadow-md">
            <b>Bahan berkualitas, Pengerjaan rapih dan cepat.</b>
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex justify-center">
            <a href="#produk" className="bg-red-600 text-white px-8 py-4 md:px-12 md:py-5 rounded-2xl font-black inline-flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base tracking-wider uppercase hover:bg-red-700 transition-all shadow-xl shadow-red-900/50 hover:scale-105 active:scale-95">
              Jelajahi Katalog <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* --- KATALOG PRODUK - HYBRID SCROLL --- */}
      <section id="produk" className="py-24 bg-white overflow-hidden relative z-30 -mt-10 md:-mt-16">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-red-600 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] block mb-2">// EXCLUSIVE COLLECTION</span>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950 uppercase">Katalog Shaka</h3>
          </div>
          <p className="text-slate-400 font-medium text-xs md:text-sm max-w-xs md:text-right hidden sm:block">Tekan kartu produk untuk melihat detail spesifikasi dan harga.</p>
        </div>

        {loading ? (
          <div className="py-10 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
          </div>
        ) : products.length > 0 ? (
          <AutoScroller speed={1}>
            {/* Array diduplikasi SEKALI saja [..products, ..products] untuk infinite scroll logic JS */}
            {[...products, ...products].map((item, index) => (
              <div
                key={index}
                onClick={() => openProductModal(item)}
                className="w-[240px] md:w-[320px] flex-shrink-0 cursor-pointer bg-white border border-slate-100 hover:border-red-100 p-3 md:p-4 rounded-[2rem] md:rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="overflow-hidden rounded-[1.5rem] md:rounded-[2rem] aspect-square mb-4 md:mb-6 bg-slate-100 relative">
                    <img 
                      src={item.image ? urlFor(item.image).url() : "/placeholder.jpg"} 
                      alt={item.name} 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 pointer-events-none" 
                    />
                  </div>
                  <h4 className="font-bold text-base md:text-lg text-slate-900 mb-1 tracking-tight line-clamp-1">{item.name}</h4>
                </div>
                <div>
                  <p className="text-red-600 font-black text-xs md:text-sm tracking-tighter uppercase mb-4">{item.price || "Hubungi Admin"}</p>
                  <div className="w-full py-2.5 md:py-3 bg-slate-50 hover:bg-slate-950 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white text-center transition-colors">
                    Detail Spesifikasi
                  </div>
                </div>
              </div>
            ))}
          </AutoScroller>
        ) : (
          <p className="text-center text-slate-400 font-bold text-sm">Belum ada produk bro.</p>
        )}
      </section>

      {/* --- PORTFOLIO GALERI PREMIUM --- */}
      <section id="portfolio" className="py-24 px-6 bg-slate-950 text-white relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 max-w-xl mx-auto">
            <span className="text-red-500 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] block mb-2">// GALLERY OF CHAMPIONS</span>
            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-3">Hasil Produksi</h3>
            <p className="text-slate-400 font-medium text-xs md:text-sm">Bukti nyata dedikasi kami dalam setiap jahitan.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {portfolios.map((item, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05, y: -5 }} className="rounded-2xl md:rounded-[2rem] overflow-hidden aspect-square border-2 border-slate-800 bg-slate-900 shadow-xl group">
                <img 
                  src={item.image ? urlFor(item.image).url() : "/placeholder.jpg"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt="Portfolio" 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONI - HYBRID SCROLL --- */}
      <section id="testimonial" className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
          <span className="text-red-600 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] block mb-2">// TRUSTED NATIONWIDE</span>
          <h3 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950 uppercase">Kepuasan Pelanggan</h3>
        </div>

        {testimonials.length > 0 && (
          <AutoScroller speed={0.8}>
            {[...testimonials, ...testimonials].map((t, index) => (
              <div 
                key={index} 
                className="w-[280px] md:w-[400px] flex-shrink-0 bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 text-yellow-400 mb-4 md:mb-6 border-b border-slate-50 pb-3 md:pb-4">
                    {[...Array(t.rating || 5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-slate-600 italic mb-6 leading-relaxed font-medium text-xs md:text-sm line-clamp-4 cursor-text">"{t.message}"</p>
                </div>
                <div className="flex items-center gap-3 md:gap-4 bg-slate-50 p-2.5 md:p-3 rounded-2xl">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-red-100 rounded-lg md:rounded-xl flex items-center justify-center text-red-600 font-black text-sm md:text-lg uppercase shadow-inner">{t.name ? t.name.charAt(0) : 'S'}</div>
                  <p className="font-black text-slate-900 uppercase text-[10px] md:text-xs tracking-wider">{t.name}</p>
                </div>
              </div>
            ))}
          </AutoScroller>
        )}
      </section>

      {/* --- CALL TO ACTION (CTA) SECTION --- */}
      <section id="cta" className="relative py-20 md:py-28 bg-red-600 overflow-hidden text-center px-6">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 left-[-10%] w-40 h-40 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-60 h-60 border-4 border-white rounded-full"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-white">
          <span className="font-black text-[10px] md:text-sm uppercase tracking-[0.4em] block mb-3 md:mb-4 text-red-200">LANGKAH SELANJUTNYA</span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 md:mb-6 uppercase tracking-tighter leading-tight drop-shadow-md">
            Wujudkan Atribut Impian <br className="hidden sm:block"/>Tim Anda Hari Ini
          </h2>
          <p className="text-sm sm:text-base md:text-xl font-medium mb-8 md:mb-12 text-red-100 max-w-2xl mx-auto drop-shadow-sm px-4">
            Dapatkan penawaran harga spesial, konsultasi bahan gratis, dan kepastian jadwal produksi khusus untuk instansi Anda.
          </p>
          
          <a 
            href="https://wa.me/6281220619997?text=Halo Shaka Production, saya ingin berdiskusi mengenai pembuatan atribut Paskibra." 
            target="_blank" rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 md:gap-3 bg-white text-red-600 w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 rounded-2xl md:rounded-full font-black text-sm md:text-lg uppercase tracking-widest hover:bg-slate-100 hover:scale-105 transition-all shadow-2xl shadow-red-900/50"
          >
            <WhatsAppIcon size={20} className="text-[#25D366] md:w-6 md:h-6" /> HUBUNGI KAMI SEKARANG
          </a>
        </div>
      </section>

      {/* --- PRODUK POP-UP MODAL --- */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10 scroll-py-8 overflow-y-auto"
          >
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={closeProductModal}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white w-full max-w-3xl rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl z-[310] border border-slate-100 flex flex-col md:grid md:grid-cols-2 max-h-[90vh]"
            >
              <button onClick={closeProductModal} className="absolute top-4 right-4 md:top-6 md:right-6 p-2.5 md:p-3 bg-white/80 md:bg-slate-100 backdrop-blur rounded-full hover:bg-red-600 hover:text-white transition-all shadow-lg z-30">
                <X size={18} />
              </button>
              
              <div className="h-56 md:h-full bg-slate-100 p-2 flex-shrink-0">
                <img src={selectedProduct.image ? urlFor(selectedProduct.image).url() : "/placeholder.jpg"} className="w-full h-full object-cover rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border-4 border-white" alt={selectedProduct.name} />
              </div>

              <div className="p-6 md:p-10 text-center md:text-left flex flex-col justify-between overflow-y-auto">
                <div>
                  <span className="text-[9px] md:text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 md:py-1.5 rounded-full uppercase tracking-widest mb-2 md:mb-3 inline-block">DETAIL ITEM</span>
                  <h4 className="text-2xl md:text-3xl font-black mb-1 md:mb-2 text-slate-900 tracking-tight uppercase">{selectedProduct.name}</h4>
                  <p className="text-red-600 font-black mb-4 md:mb-6 tracking-widest text-base md:text-lg uppercase">{selectedProduct.price || "Hubungi Admin"}</p>
                  <div className="bg-slate-50 p-4 md:p-5 rounded-2xl mb-6 md:mb-8 shadow-inner border border-slate-100 text-left">
                    <p className="text-slate-600 leading-relaxed text-xs md:text-sm font-medium">
                      {selectedProduct.description || "Spesifikasi kustom. Hubungi admin untuk detail bahan dan ukuran."}
                    </p>
                  </div>
                </div>
                <a 
                  href={`https://wa.me/6281220619997?text=Halo Shaka Production, saya tertarik dengan produk ${selectedProduct.name}.`} 
                  target="_blank" rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 md:gap-3 bg-[#25D366] text-white px-6 py-3.5 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-wider hover:bg-[#1ebe57] transition-all shadow-xl shadow-green-500/20 active:scale-95"
                >
                  <WhatsAppIcon size={18} /> PESAN VIA WHATSAPP
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 text-slate-500 py-8 md:py-10 flex flex-col items-center justify-center border-t border-slate-900 px-6">
        <div className="flex items-center gap-2 mb-3 md:mb-4">
           <div className="w-5 h-5 md:w-6 md:h-6 bg-red-600 rounded-md flex items-center justify-center text-white font-black text-[10px] md:text-xs italic">S</div>
           <p className="font-black text-xs md:text-sm tracking-tighter uppercase text-slate-400">Shaka<span className="text-red-600">Production</span></p>
        </div>
        <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-600 text-center">© {new Date().getFullYear()} Crafted by Abid S.Kom. All Rights Reserved.</p>
      </footer>
    </div>
  );
}