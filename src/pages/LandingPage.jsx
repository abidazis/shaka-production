// src/pages/LandingPage.jsx
import { useState, useEffect } from "react";
import { client, urlFor } from "../sanityClient";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Info, Zap, CheckCircle, MessageCircle, 
  Loader2, Star, ShieldCheck, Sparkles, Award, Target, Phone, X
} from "lucide-react";

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
        // Query GROQ teroptimasi dengan limit dan ordering
        const productData = await client.fetch(`*[_type == "product"] | order(_createdAt desc)[0..7]`);
        const portfolioData = await client.fetch(`*[_type == "portfolio"] | order(_createdAt desc)[0..11]`);
        const testimonialData = await client.fetch(`*[_type == "testimonial"] | order(_createdAt desc)[0..5]`);
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

  // Handler aman untuk membuka modal produk
  const openProductModal = (product) => {
    document.body.style.overflow = 'hidden'; // Kunci scroll layar utama
    setSelectedProduct(product);
  };

  // Handler aman untuk menutup modal produk
  const closeProductModal = () => {
    document.body.style.overflow = 'unset'; // Buka kembali scroll layar
    setSelectedProduct(null);
  };

  return (
    <div className="font-sans text-slate-900 bg-white selection:bg-red-500 selection:text-white scroll-smooth relative">
      
      {/* =========================================
          PREMIUM FLOATING WA BUTTON (STAY)
          ========================================= */}
      <motion.a 
        href="https://wa.me/628120619997?text=Halo Shaka Production, saya tertarik untuk konsultasi atribut Paskibra."
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", repeatDelay: 1 }}
        className="fixed bottom-8 right-8 z-[200] bg-green-500 text-white p-5 rounded-full shadow-2xl shadow-green-500/30 flex items-center justify-center border-4 border-white hover:bg-green-600 transition-colors active:shadow-inner"
        title="Chat Admin Shaka via WhatsApp"
      >
        <MessageCircle size={32} fill="currentColor" className="text-white" />
      </motion.a>

      {/* --- PRETRANDED NAVBAR --- */}
      <nav className="fixed w-full top-0 bg-white/70 backdrop-blur-2xl border-b border-slate-100 z-[100] shadow-sm">
        <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-red-600 to-red-800 rounded-2xl flex items-center justify-center text-white font-black text-2xl italic shadow-md shadow-red-500/20">S</div>
            <h1 className="font-black text-2xl tracking-tighter uppercase text-slate-950">Shaka<span className="text-red-600">Production</span></h1>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-xs font-bold text-slate-600 uppercase tracking-[0.2em]">
            <a href="#home" className="hover:text-red-600 transition-colors">Home</a>
            <a href="#produk" className="hover:text-red-600 transition-colors">Produk</a>
            <a href="#portfolio" className="hover:text-red-600 transition-colors">Portfolio</a>
            <a href="#testimonial" className="hover:text-red-600 transition-colors">Testimoni</a>
          </div>

          <a href="https://wa.me/628120619997" className="bg-slate-950 text-white px-6 py-3 rounded-2xl font-black text-xs tracking-wider uppercase hover:bg-red-600 transition-all shadow-md active:scale-95 flex items-center gap-2">
            <Phone size={14} /> Pesan Sekarang
          </a>
        </div>
      </nav>

      {/* --- HERO SECTION - DRAMATIC DARK CRYSTAL --- */}
      <section id="home" className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24 overflow-hidden bg-slate-950 text-white">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="/paskibra-hero.jpg" 
            alt="Paskibra Hero Background" 
            className="w-full h-full object-cover opacity-10" // Dibuat sangat transparan untuk tema gelap
          />
          {/* Gradients Kristal Gahar */}
          <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-red-600/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] right-[0%] w-[40vw] h-[40vw] bg-red-900/10 rounded-full blur-[120px]" />
          <div className="absolute top-[30%] right-[20%] w-[20vw] h-[20vw] bg-amber-500/5 rounded-full blur-[100px]" />
          
          {/* Overlay gradasi untuk memastikan keterbacaan teks putih */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-white/100 z-10"></div>
        </div>

        <div className="relative z-20 max-w-5xl mx-auto px-4 mt-20">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2.5 bg-slate-900 border border-slate-800 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-10 shadow-inner text-slate-300">
            <ShieldCheck size={14} className="text-red-500 animate-pulse" /> Partner Konveksi Atribut Paskibra Tepercaya Sejak 2015
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }} className="text-5xl md:text-8xl font-black mb-8 leading-[1.05] tracking-tight text-white uppercase italic">
            Atribut Paskibra <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Kualitas Juara.</span>
          </motion.h2>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }} className="mb-14 text-slate-400 max-w-3xl mx-auto text-lg md:text-2xl leading-relaxed font-medium">
            Spesialis produksi seragam premium, sepatu PDU, dan atribut lengkap untuk Paskibraka instansi, sekolah, dan perguruan tinggi. Pengerjaan cepat, hasil presisi, dan bergaransi.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.a whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }} href="#produk" className="bg-red-600 text-white px-12 py-5 rounded-2xl font-black inline-flex items-center justify-center gap-3 text-base tracking-wider uppercase hover:bg-red-700 transition-all shadow-xl shadow-red-900/30">
              Lihat Katalog Produk <ArrowRight size={18} />
            </motion.a>
            <div className="flex items-center gap-2 text-slate-600 font-bold text-sm tracking-wide bg-white px-4 py-2 rounded-xl shadow-inner border border-slate-100">
              <Award className="text-amber-500" size={18} /> Melayani Pesanan Seluruh Indonesia
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- KATALOG PRODUK - UI UX ENHANCED --- */}
      <section id="produk" className="py-32 px-6 max-w-7xl mx-auto bg-white">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-red-600 font-black text-xs uppercase tracking-[0.2em] block mb-3">// KATEGORI ATRIBUT</span>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight text-slate-950 uppercase">Katalog Shaka</h3>
          </div>
          <p className="text-slate-400 font-medium text-sm max-w-xs md:text-right">Tekan kartu produk untuk melihat detail spesifikasi, harga, dan cara pemesanan.</p>
        </div>

        {loading ? (
          <div className="py-32 flex flex-col items-center gap-4"><Loader2 className="animate-spin text-red-600" size={40} /><p className="text-xs font-bold uppercase tracking-widest text-slate-400">Menghubungkan ke server...</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8, shadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)" }}
                transition={{ duration: 0.4 }}
                onClick={() => openProductModal(item)}
                className="group cursor-pointer bg-white border border-slate-100 hover:border-white p-5 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-400 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="overflow-hidden rounded-[2rem] aspect-[4/5] mb-6 bg-slate-100 shadow-inner relative group">
                    <img 
                      src={item.image ? urlFor(item.image).url() : "/placeholder.jpg"} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-white p-4 rounded-full scale-50 group-hover:scale-100 transition-transform shadow-xl">
                        <Zap className="text-red-600" size={24} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <h4 className="font-bold text-xl text-slate-900 mb-1 tracking-tight px-1 group-hover:text-red-600 transition-colors">{item.name}</h4>
                </div>
                <div>
                  <p className="text-red-600 font-black text-sm tracking-tighter uppercase px-1 mb-5">{item.price || "Price by Inquiry"}</p>
                  <div className="w-full py-3 bg-slate-50 group-hover:bg-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white text-center transition-colors shadow-inner group-hover:shadow-lg">
                    Detail Spesifikasi
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* --- PORTFOLIO GALERI PREMIUM --- */}
      <section id="portfolio" className="py-32 px-6 bg-slate-950 text-white relative">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-900 opacity-50 z-0" style={{ backgroundImage: "url('/pattern.png')", backgroundSize: "300px" }}></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 max-w-xl mx-auto">
            <span className="text-red-500 font-black text-xs uppercase tracking-[0.3em] block mb-3">// GALLERY OF CHAMPIONS</span>
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">Hasil Produksi Kami</h3>
            <p className="text-slate-500 font-medium text-sm">Bukti nyata dedikasi Shaka Production dalam setiap jahitan atribut tim Paskibra.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {portfolios.map((item, i) => (
              <motion.div key={i} whileHover={{ scale: 1.03, y: -5, rotate: 1 }} className="rounded-[2.5rem] overflow-hidden aspect-square border-4 border-white/90 shadow-2xl bg-slate-900 shadow-slate-950/30 group">
                <img 
                  src={item.image ? urlFor(item.image).url() : "/placeholder.jpg"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt="Portfolio Shaka Production" 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONI PREMIUM CARDS --- */}
      <section id="testimonial" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 max-w-xl mx-auto">
            <span className="text-red-600 font-black text-xs uppercase tracking-[0.2em] block mb-3">// TESTIMONI NYATA</span>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight text-slate-950 uppercase">Kepuasan Pelanggan</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-white p-10 rounded-[3rem] shadow-xl shadow-black/5 border border-slate-100 hover:border-white hover:shadow-2xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1.5 text-yellow-400 mb-8 border-b border-slate-100 pb-5">
                    {[...Array(t.rating || 5)].map((_, i) => <Star key={i} size={18} fill="currentColor" className="text-yellow-400" />)}
                  </div>
                  <p className="text-slate-600 italic mb-8 leading-relaxed font-medium text-base">"{t.message}"</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center text-red-600 font-black text-xl uppercase shadow-inner border border-red-200">{t.name ? t.name.charAt(0) : 'S'}</div>
                  <p className="font-black text-slate-900 uppercase text-sm tracking-tight">— {t.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

 {/* =========================================
          PRODUK POP-UP MODAL (FIXED & UX ENHANCED)
          ========================================= */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10 scroll-py-8 overflow-y-auto"
          >
            {/* Backdrop dengan Blur */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={closeProductModal} // Tutup modal jika klik backdrop
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
            />
            
            {/* Konten Modal */}
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl z-[310] border border-slate-100"
            >
              {/* Tombol Tutup Modern */}
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                onClick={closeProductModal} 
                className="absolute top-8 right-8 p-3 bg-slate-100 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-lg z-30 active:scale-95"
              >
                <X size={18} />
              </motion.button>
              
              <div className="grid md:grid-cols-2 items-stretch gap-0">
                {/* Sisi Gambar */}
                <div className="h-72 md:h-full bg-slate-100 shadow-inner p-2 border-r border-slate-100">
                  <img 
                    src={selectedProduct.image ? urlFor(selectedProduct.image).url() : "/placeholder.jpg"} 
                    className="w-full h-full object-cover rounded-[2rem] shadow-md border-4 border-white" 
                    alt={selectedProduct.name}
                  />
                </div>

                {/* Sisi Teks & Tombol */}
                <div className="p-10 text-center flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-black bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">DETAIL PRODUK</span>
                    <h4 className="text-3xl md:text-4xl font-black mb-3 text-slate-900 tracking-tighter uppercase">{selectedProduct.name}</h4>
                    <p className="text-red-600 font-black mb-8 tracking-widest text-lg uppercase italic border-b border-slate-100 pb-5">{selectedProduct.price || "Hubungi Admin"}</p>
                    <div className="bg-slate-50 p-6 rounded-2xl mb-10 max-h-48 overflow-y-auto text-left shadow-inner border border-slate-100">
                      <p className="text-slate-600 leading-relaxed text-sm font-medium">
                        {selectedProduct.description || "Spesifikasi kustom tingkat tinggi. Hubungi admin untuk detail bahan, ukuran, jumlah pesanan, dan tenggat waktu produksi."}
                      </p>
                    </div>
                  </div>
                  <motion.a 
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    href={`https://wa.me/628120619997?text=Halo Shaka Production, saya tertarik dengan produk ${selectedProduct.name}.`} 
                    target="_blank"
                    className="w-full inline-flex items-center justify-center gap-4 bg-green-500 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 active:shadow-green-500/10 active:shadow-inner"
                  >
                    <MessageCircle size={22} /> CHAT ADMIN SEKARANG
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PREMIUM FOOTER --- */}
      <footer id="contact" className="bg-slate-950 text-white pt-24 pb-10 border-t border-slate-900 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 whileInView={{ scale: [0.95, 1] }} className="text-4xl md:text-7xl font-black mb-10 leading-tight tracking-tighter text-white uppercase italic">Siap Tampil Mewah <br /> Bersama <span className="text-red-600">Shaka?</span></motion.h2>
          <div className="flex justify-center gap-6 mb-24 mt-12 flex-col sm:flex-row">
             <a href="https://wa.me/628120619997" className="bg-white text-slate-950 px-16 py-6 rounded-[2.5rem] font-black text-xl hover:bg-red-600 hover:text-white transition-all shadow-2xl hover:-translate-y-2 uppercase tracking-tight">Klaim Pesanan</a>
             <div className="flex items-center justify-center gap-4 bg-slate-900 border border-slate-800 p-3 pr-8 rounded-[2.5rem]">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-lg"><Star size={24} fill="currentColor" /></div>
                <div className="text-left leading-none"><p className="text-xs font-bold text-slate-100">4.9/5 Rating Instansi</p><p className="text-[10px] text-slate-500 uppercase tracking-tighter">Kepuasan Pelanggan adalah Target Kami</p></div>
             </div>
          </div>
          <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.4em] gap-6 px-4">
             <p>© {new Date().getFullYear()} Shaka Production x Abid IT Solution. All Rights Reserved.</p>
             <div className="flex gap-10">
                <a href="#" className="hover:text-red-600">Instagram</a>
                <a href="#" className="hover:text-red-600">WhatsApp</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}