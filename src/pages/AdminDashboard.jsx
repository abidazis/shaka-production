// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { client, urlFor } from "../sanityClient";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Globe, Loader2, Plus, Trash2, 
  Package, Image as ImageIcon, MessageSquare, LogOut, User
} from "lucide-react";

export default function AdminDashboard({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Navigasi internal admin pakai sidebar menu
  const [activeMenu, setActiveMenu] = useState("product"); // 'product', 'portfolio', 'testimonial'
  
  // State Form Input
  const [inputName, setInputName] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [inputDesc, setInputDesc] = useState("");
  const [inputImage, setInputImage] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchData = async () => {
    try {
      const productData = await client.fetch(`*[_type == "product"] | order(_createdAt desc)`);
      const portfolioData = await client.fetch(`*[_type == "portfolio"] | order(_createdAt desc)`);
      const testimonialData = await client.fetch(`*[_type == "testimonial"] | order(_createdAt desc)`);
      setProducts(productData);
      setPortfolios(portfolioData);
      setTestimonials(testimonialData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const uploadImage = async (file) => {
    if (!file) return null;
    const asset = await client.assets.upload("image", file, { filename: file.name });
    return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  };

  const handleSaveData = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      let uploadedDocImage = null;
      if (inputImage && (activeMenu === 'product' || activeMenu === 'portfolio')) {
        uploadedDocImage = await uploadImage(inputImage);
      }
      let doc = {};
      if (activeMenu === "product") {
        doc = { _type: "product", name: inputName, price: inputPrice, description: inputDesc, image: uploadedDocImage };
      } else if (activeMenu === "portfolio") {
        doc = { _type: "portfolio", title: inputName, image: uploadedDocImage };
      } else if (activeMenu === "testimonial") {
        doc = { _type: "testimonial", name: inputName, message: inputDesc, rating: 5 };
      }
      await client.create(doc);
      alert("Data berhasil disimpan secara real-time!");
      setInputName(""); setInputPrice(""); setInputDesc(""); setInputImage(null);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus data konten ini dari server?")) {
      await client.delete(id);
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex">
      
      {/* === PROFESSIONAL SIDEBAR MENU BAR === */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6 fixed h-full z-50">
        <div className="flex flex-col gap-10">
          {/* LOGO BRANDING */}
          <div className="flex items-center gap-3 px-2">
            <LayoutDashboard className="text-red-500 animate-pulse" size={24} />
            <h1 className="text-sm font-black uppercase tracking-[0.2em] text-slate-200">Shaka Suite v1.2</h1>
          </div>

          {/* LIST MENU BAR */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 mb-2">Konten Modul</span>
            
            <button onClick={() => setActiveMenu("product")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeMenu === 'product' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Package size={16} /> Kelola Produk
            </button>
            
            <button onClick={() => setActiveMenu("portfolio")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeMenu === 'portfolio' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <ImageIcon size={16} /> Kelola Portfolio
            </button>
            
            <button onClick={() => setActiveMenu("testimonial")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeMenu === 'testimonial' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <MessageSquare size={16} /> Kelola Testimoni
            </button>

            {/* SLOT MENU BAR DI MASA DEPAN */}
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 mt-6 mb-2">Sistem Masa Depan</span>
            <div className="opacity-30 border border-dashed border-slate-700 px-4 py-3 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-wider">🔒 Menu Finansial</div>
            <div className="opacity-30 border border-dashed border-slate-700 px-4 py-3 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-wider">🔒 Antrean Invoice</div>
          </div>
        </div>

        {/* PROFILE & LOGOUT BANNER */}
        <div className="flex flex-col gap-4 border-t border-slate-800 pt-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400"><User size={16} /></div>
            <div>
              <p className="text-xs font-black uppercase tracking-tight text-slate-200">Owner Shaka</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase">Administrator</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-slate-800/60 hover:bg-red-600/20 text-slate-400 hover:text-red-500 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors">
            <LogOut size={14} /> Keluar Sistem
          </button>
        </div>
      </div>

      {/* === CONTAINER CONTENT DASHBOARD === */}
      <div className="flex-grow pl-64 min-h-screen">
        <div className="p-10 max-w-6xl mx-auto">
          
          {/* DASHBOARD TOP BAR */}
          <div className="flex justify-between items-center border-b border-slate-900 pb-6 mb-10">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Manajemen {activeMenu}</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Ganti, hapus, atau tambah komponen visual web secara mandiri</p>
            </div>
            <button onClick={() => window.open('/', '_blank')} className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all">
              <Globe size={14} /> Preview Web Live
            </button>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            
            {/* COMPACT FORM DESIGN */}
            <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl lg:col-span-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5 border-b border-slate-800 pb-3">Form Entri Konten</h3>
              <form onSubmit={handleSaveData} className="flex flex-col gap-4">
                
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">Nama Konten / Judul</label>
                  <input required type="text" value={inputName} onChange={(e) => setInputName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:border-red-500 transition-colors text-white" placeholder="Ketik di sini..." />
                </div>

                {activeMenu === "product" && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">Harga Katalog</label>
                    <input required type="text" value={inputPrice} onChange={(e) => setInputPrice(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:border-red-500 transition-colors text-white" placeholder="Contoh: Rp 350.000" />
                  </div>
                )}

                {(activeMenu === "product" || activeMenu === "testimonial") && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">Deskripsi / Teks Review</label>
                    <textarea rows="3" value={inputDesc} onChange={(e) => setInputDesc(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:border-red-500 transition-colors text-white" placeholder="Ketik keterangan panjang..."></textarea>
                  </div>
                )}

                {activeMenu !== "testimonial" && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">File Gambar (PNG/JPG)</label>
                    <input required type="file" accept="image/*" onChange={(e) => setInputImage(e.target.files[0])} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] text-slate-500 file:bg-slate-900 file:border-0 file:text-white file:rounded-md file:px-2 file:py-1 file:mr-2 cursor-pointer" />
                  </div>
                )}

                <button type="submit" disabled={submitLoading} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors flex justify-center items-center gap-2 mt-2 shadow-lg shadow-green-900/10">
                  {submitLoading ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />} Kirim Ke Website
                </button>
              </form>
            </div>

            {/* MONITORING LIST */}
            <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl lg:col-span-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5 border-b border-slate-800 pb-3">Daftar Arsip Online</h3>
              
              {loading ? (
                <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-slate-600" size={24} /></div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto pr-2 flex flex-col gap-2 custom-scrollbar">
                  {activeMenu === "product" && products.map(item => (
                    <div key={item._id} className="flex justify-between items-center bg-slate-950 p-3.5 rounded-xl border border-slate-900">
                      <div className="flex items-center gap-4">
                        <img src={item.image ? urlFor(item.image).url() : "/placeholder.jpg"} className="w-10 h-10 object-cover rounded-lg" />
                        <div><h4 className="font-bold text-xs text-slate-200">{item.name}</h4><p className="text-[10px] text-red-400 font-bold mt-0.5">{item.price}</p></div>
                      </div>
                      <button onClick={() => handleDelete(item._id)} className="p-2 bg-slate-900 border border-slate-800 hover:bg-red-900/20 text-slate-500 hover:text-red-400 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  ))}

                  {activeMenu === "portfolio" && portfolios.map(item => (
                    <div key={item._id} className="flex justify-between items-center bg-slate-950 p-3.5 rounded-xl border border-slate-900">
                      <div className="flex items-center gap-4">
                        <img src={item.image ? urlFor(item.image).url() : "/placeholder.jpg"} className="w-10 h-10 object-cover rounded-lg" />
                        <h4 className="font-bold text-xs text-slate-200">{item.title || "Untitled Project"}</h4>
                      </div>
                      <button onClick={() => handleDelete(item._id)} className="p-2 bg-slate-900 border border-slate-800 hover:bg-red-900/20 text-slate-500 hover:text-red-400 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  ))}

                  {activeMenu === "testimonial" && testimonials.map(item => (
                    <div key={item._id} className="flex justify-between items-center bg-slate-950 p-3.5 rounded-xl border border-slate-900">
                      <div className="max-w-xs"><h4 className="font-bold text-xs text-slate-200">{item.name}</h4><p className="text-[10px] text-slate-400 italic mt-1">"{item.message}"</p></div>
                      <button onClick={() => handleDelete(item._id)} className="p-2 bg-slate-900 border border-slate-800 hover:bg-red-900/20 text-slate-500 hover:text-red-400 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}