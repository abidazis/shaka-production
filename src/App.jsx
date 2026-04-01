import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  CheckCircle, 
  MessageCircle, 
  Menu, 
  X, 
  ArrowRight, 
  Info, 
  ShieldCheck, 
  Zap 
} from "lucide-react";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Data Produk Lengkap
  const products = [
    { 
      name: "Seragam Paskibra", 
      img: "/kostum.jpg", 
      desc: "Bahan Drill Premium",
      detail: "Setelan lengkap dengan potongan slim-fit yang gagah. Menggunakan bahan Drill kualitas ekspor yang tidak panas dan warna tahan lama.",
      price: "Mulai 350rb-an"
    },
    { 
      name: "Sepatu Paskibra", 
      img: "/sepatu.jpg", 
      desc: "Bahan Kulit Sintetis",
      detail: "Sol karet anti-slip, cocok untuk medan aspal maupun lapangan. Finishing mengkilap (glossy) tanpa perlu disemir setiap saat.",
      price: "Mulai 150rb-an"
    },
    { 
      name: "Topi Pet", 
      img: "/topi.jpg", 
      desc: "Jahitan Standar Tailor",
      detail: "Bentuk kokoh dengan tulang dalam yang kuat. Dilengkapi aksesoris kuningan asli yang tidak mudah berkarat.",
      price: "Mulai 75rb-an"
    },
    { 
      name: "Emblem Bordir", 
      img: "/emblem.jpg", 
      desc: "Bordir Komputer Rapi",
      detail: "Kerapatan benang tinggi (High Density). Bisa custom logo satuan maupun ribuan dengan presisi milimeter.",
      price: "Mulai 5rb-an"
    },
  ];

  const portfolio = [
    "/kostum.jpg", "/topi.jpg", "/sepatu.jpg", "/emblem.jpg"
  ];

  return (
    <div className="font-sans text-slate-900 bg-slate-50 selection:bg-red-100 selection:text-red-600 scroll-smooth">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-[100]">
        <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl italic shadow-lg shadow-red-200">S</div>
            <h1 className="font-extrabold text-xl tracking-tighter uppercase">Shaka<span className="text-red-600">Production</span></h1>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-600 uppercase tracking-widest">
            <a href="#home" className="hover:text-red-600 transition-colors">Home</a>
            <a href="#produk" className="hover:text-red-600 transition-colors">Produk</a>
            <a href="#portfolio" className="hover:text-red-600 transition-colors">Portfolio</a>
            <a href="#contact" className="hover:text-red-600 transition-colors">Contact</a>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-800">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-100 overflow-hidden flex flex-col p-6 gap-4 text-center font-bold text-slate-600 uppercase tracking-wider"
            >
              <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
              <a href="#produk" onClick={() => setMenuOpen(false)}>Produk</a>
              <a href="#portfolio" onClick={() => setMenuOpen(false)}>Portfolio</a>
              <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- HERO SECTION --- */}
      <section 
        id="home" 
        className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 overflow-hidden"
      >
        {/* Background Image dengan Overlay */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="w-full h-full"
          >
            <img 
              src="/paskibra-hero.jpg" // Ganti dengan path foto konveksi/paskibra yang keren bro
              alt="Konveksi Background" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          {/* Gradient Overlay: Bikin teks putih/gelap tetep kebaca */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-slate-50/100 z-10"></div>
        </div>

        {/* Content - Bikin z-index lebih tinggi dari background */}
        <div className="relative z-20 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8 shadow-lg shadow-red-200"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-100 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Partner Konveksi Sejak 2015
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-8xl font-black mb-6 leading-[1.1] tracking-tighter text-slate-900"
          >
            Bikin Atribut Paskibra <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Gak Pake Ribet.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mb-10 text-slate-600 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-medium"
          >
            Kami memproduksi seragam dan atribut dengan kualitas premium untuk meningkatkan kewibawaan tim Anda. Proses cepat, rapi, dan bergaransi.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(220 38 38 / 0.3)" }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/628120619997"
              className="bg-red-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-lg transition-shadow"
            >
              Mulai Konsultasi <ArrowRight size={20} />
            </motion.a>
            
            <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-2 pr-6 rounded-2xl border border-white/50">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-300 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                    </div>
                  ))}
               </div>
               <div className="text-left">
                 <p className="text-xs font-bold text-slate-900 leading-none">500+ Instansi</p>
                 <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Telah Berlangganan</p>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:block"
        >
          <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-red-600 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* --- LAYANAN UTAMA (CARDS) --- */}
      <section id="produk" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h3 className="text-4xl font-black tracking-tight mb-2 uppercase">Layanan Utama</h3>
            <p className="text-slate-500 italic">Klik untuk detail spesifikasi produk</p>
          </div>
          <div className="h-[2px] flex-grow mx-8 bg-slate-100 hidden md:block"></div>
          <span className="text-red-600 font-black text-sm uppercase tracking-widest underline underline-offset-8">Katalog 2026</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedProduct(item)}
              className="group cursor-pointer bg-white border border-slate-100 p-4 rounded-[2.5rem] hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative overflow-hidden rounded-[2rem] mb-6 aspect-[4/5]">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="bg-white p-4 rounded-full scale-50 group-hover:scale-100 transition-transform">
                      <Info className="text-red-600" size={24} />
                   </div>
                </div>
              </div>
              <div className="px-2">
                <h4 className="font-bold text-xl mb-1">{item.name}</h4>
                <p className="text-slate-400 text-xs mb-4 uppercase tracking-widest">{item.desc}</p>
                <div className="w-full py-3 bg-slate-50 group-hover:bg-red-600 group-hover:text-white rounded-2xl transition-colors text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
                  Detail Produk
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- MODAL DETAIL --- */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl z-[120]"
            >
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-600 hover:text-white transition-colors">
                <X size={20} />
              </button>
              <img src={selectedProduct.img} className="w-full h-72 object-cover" />
              <div className="p-10 text-center">
                <h4 className="text-3xl font-black mb-2">{selectedProduct.name}</h4>
                <p className="text-red-600 font-bold mb-6 tracking-widest">{selectedProduct.price}</p>
                <p className="text-slate-500 leading-relaxed mb-8">{selectedProduct.detail}</p>
                <a 
                  href={`https://wa.me/628120619997?text=Halo Shaka Production, saya tertarik dengan ${selectedProduct.name}`}
                  className="inline-flex items-center gap-3 bg-green-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-green-600 transition-transform active:scale-95 shadow-lg shadow-green-100"
                >
                  <MessageCircle size={20} /> Chat Admin Sekarang
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- KEUNGGULAN --- */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-16">
          {[
            { icon: <Zap />, title: "Produksi Kilat", desc: "Sistem manajemen produksi MIS yang terintegrasi bikin orderanmu cepat kelar." },
            { icon: <CheckCircle />, title: "QC Berlapis", desc: "Setiap jahitan dicek manual sebelum dikirim ke tangan Anda." },
            { icon: <MessageCircle />, title: "After Sales", desc: "Garansi retur jika barang tidak sesuai dengan kesepakatan desain." },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center mb-6 rotate-3 hover:rotate-0 transition-transform">
                {item.icon}
              </div>
              <h4 className="font-bold text-2xl mb-4">{item.title}</h4>
              <p className="text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- PORTFOLIO --- */}
      <section id="portfolio" className="py-24 px-6 bg-white">
        <h3 className="text-3xl font-black text-center mb-16 uppercase tracking-widest underline decoration-red-600 decoration-4 underline-offset-8">Hasil Produksi</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {portfolio.map((img, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }} className="rounded-[2rem] overflow-hidden aspect-square shadow-xl">
              <img src={img} className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer id="contact" className="bg-slate-50 pt-24 pb-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Siap Tampil Beda <br /> Bersama <span className="text-red-600">Shaka?</span></h2>
          <div className="flex justify-center gap-6 mb-20">
             <a href="https://wa.me/628120619997" className="bg-slate-900 text-white px-12 py-5 rounded-3xl font-bold text-lg hover:bg-red-600 transition-colors shadow-2xl">Hubungi Kami</a>
          </div>
          <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] gap-4">
             <p>© 2026 Shaka Production. Crafted for Excellence.</p>
             <div className="flex gap-8">
                <a href="#">Instagram</a>
                <a href="#">WhatsApp</a>
             </div>
          </div>
        </div>
      </footer>

      {/* Floating WA Button */}
      <motion.a
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        href="https://wa.me/628120619997"
        className="fixed bottom-10 right-10 bg-green-500 text-white p-5 rounded-full shadow-2xl z-[101] shadow-green-200"
      >
        <MessageCircle size={32} />
      </motion.a>
    </div>
  );
}