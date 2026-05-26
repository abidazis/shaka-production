// src/pages/AdminDashboard.jsx
import { useState, useEffect, useRef } from "react";
import { client, urlFor } from "../sanityClient";
import { 
  LayoutDashboard, Globe, Loader2, Plus, Trash2, 
  Package, Image as ImageIcon, MessageSquare, LogOut, User, Edit3, X
} from "lucide-react";

export default function AdminDashboard({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeMenu, setActiveMenu] = useState("product"); 
  
  // State Form Input
  const [inputName, setInputName] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [inputDesc, setInputDesc] = useState("");
  const [inputImage, setInputImage] = useState(null);
  
  // State Khusus Untuk Fitur EDIT
  const [editingId, setEditingId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const fileInputRef = useRef(null);

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
      console.error("Gagal load data:", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const uploadImage = async (file) => {
    if (!file) return null;
    const asset = await client.assets.upload("image", file, { filename: file.name });
    return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  };

  // Reset Form
  const resetForm = () => {
    setInputName(""); 
    setInputPrice(""); 
    setInputDesc(""); 
    setInputImage(null);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // FUNGSI LOAD DATA KE FORM SAAT TOMBOL EDIT DIKLIK
  const handleEditClick = (item) => {
    setEditingId(item._id);
    if (activeMenu === "product") {
      setInputName(item.name || "");
      setInputPrice(item.price || "");
      setInputDesc(item.description || "");
    } else if (activeMenu === "portfolio") {
      setInputName(item.title || "");
    } else if (activeMenu === "testimonial") {
      setInputName(item.name || "");
      setInputDesc(item.message || "");
    }
    // Scroll ke atas biar admin langsung lihat form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // FUNGSI SIMPAN ATAU UPDATE DATA
  const handleSaveData = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      let uploadedDocImage = null;
      if (inputImage && (activeMenu === 'product' || activeMenu === 'portfolio')) {
        uploadedDocImage = await uploadImage(inputImage);
      }
      
      let docData = {};
      if (activeMenu === "product") {
        docData = { name: inputName, price: inputPrice, description: inputDesc };
        if (uploadedDocImage) docData.image = uploadedDocImage;
      } else if (activeMenu === "portfolio") {
        docData = { title: inputName };
        if (uploadedDocImage) docData.image = uploadedDocImage;
      } else if (activeMenu === "testimonial") {
        docData = { name: inputName, message: inputDesc, rating: 5 };
      }

      if (editingId) {
        // LAKUKAN UPDATE (PATCH)
        await client.patch(editingId).set(docData).commit();
        alert("✅ MANTAP! Data berhasil di-update.");
      } else {
        // LAKUKAN CREATE BARU
        docData._type = activeMenu;
        await client.create(docData);
        alert("✅ MANTAP! Data baru berhasil ditambahkan.");
      }
      
      resetForm();
      fetchData(); 
    } catch (err) {
      console.error(err);
      alert(`❌ GAGAL MENYIMPAN!\nError: ${err.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin mau hapus konten ini dari website?")) {
      try {
        await client.delete(id);
        fetchData();
      } catch (err) {
        alert(`❌ Gagal Menghapus! Pesan Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex">
      
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6 fixed h-full z-50">
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-3 px-2">
            <LayoutDashboard className="text-red-500 animate-pulse" size={24} />
            <h1 className="text-sm font-black uppercase tracking-[0.2em] text-slate-200">Shaka Suite v1.2</h1>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 mb-2">Konten Modul</span>
            <button onClick={() => {setActiveMenu("product"); resetForm();}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeMenu === 'product' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:bg-slate-800'}`}><Package size={16} /> Kelola Produk</button>
            <button onClick={() => {setActiveMenu("portfolio"); resetForm();}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeMenu === 'portfolio' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:bg-slate-800'}`}><ImageIcon size={16} /> Kelola Portfolio</button>
            <button onClick={() => {setActiveMenu("testimonial"); resetForm();}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeMenu === 'testimonial' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:bg-slate-800'}`}><MessageSquare size={16} /> Kelola Testimoni</button>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 mt-6 mb-2">Sistem Ekstra</span>
            <div className="opacity-30 border border-dashed border-slate-700 px-4 py-3 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-wider">🔒 Menu Finansial</div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-800 pt-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400"><User size={16} /></div>
            <div>
              <p className="text-xs font-black uppercase tracking-tight text-slate-200">Owner Shaka</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase">Administrator</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-slate-800/60 hover:bg-red-600/20 text-slate-400 hover:text-red-500 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"><LogOut size={14} /> Keluar Sistem</button>
        </div>
      </div>

      <div className="flex-grow pl-64 min-h-screen">
        <div className="p-10 max-w-6xl mx-auto">
          
          <div className="flex justify-between items-center border-b border-slate-900 pb-6 mb-10">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Manajemen {activeMenu}</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Ganti, hapus, tambah, atau edit visual web secara mandiri</p>
            </div>
            <button onClick={() => window.open('/', '_blank')} className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"><Globe size={14} /> Preview Web Live</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            
            {/* FORM AREA */}
            <div className={`bg-slate-900 border p-6 rounded-2xl lg:col-span-2 transition-all ${editingId ? 'border-amber-500 shadow-lg shadow-amber-900/20' : 'border-slate-800/80'}`}>
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-5">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  {editingId ? <span className="text-amber-500 flex items-center gap-2"><Edit3 size={14}/> Edit Data Mode</span> : "Form Entri Konten"}
                </h3>
                {editingId && (
                  <button type="button" onClick={resetForm} className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 flex items-center gap-1">Batal <X size={10}/></button>
                )}
              </div>

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
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">File Gambar (Abaikan jika tidak ingin ganti foto)</label>
                    <input type={editingId ? "file" : "file"} required={!editingId} accept="image/*" onChange={(e) => setInputImage(e.target.files[0])} ref={fileInputRef} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] text-slate-500 file:bg-slate-900 file:border-0 file:text-white file:rounded-md file:px-2 file:py-1 file:mr-2 cursor-pointer" />
                  </div>
                )}

                <button type="submit" disabled={submitLoading} className={`w-full text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors flex justify-center items-center gap-2 mt-2 shadow-lg ${editingId ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/20' : 'bg-green-600 hover:bg-green-700 shadow-green-900/10'}`}>
                  {submitLoading ? <Loader2 className="animate-spin" size={14} /> : (editingId ? <Edit3 size={14} /> : <Plus size={14} />)} 
                  {editingId ? "Update Konten" : "Kirim Ke Website"}
                </button>
              </form>
            </div>

            {/* LIST AREA DENGAN TOMBOL EDIT */}
            <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl lg:col-span-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5 border-b border-slate-800 pb-3">Daftar Arsip Online</h3>
              {loading ? (
                <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-slate-600" size={24} /></div>
              ) : (
                <div className="max-h-[450px] overflow-y-auto pr-2 flex flex-col gap-2 custom-scrollbar">
                  
                  {activeMenu === "product" && products.map(item => (
                    <div key={item._id} className={`flex justify-between items-center p-3.5 rounded-xl border transition-colors ${editingId === item._id ? 'bg-slate-800 border-amber-500/50' : 'bg-slate-950 border-slate-900 hover:border-slate-700'}`}>
                      <div className="flex items-center gap-4">
                        <img src={item.image ? urlFor(item.image).url() : "/placeholder.jpg"} className="w-10 h-10 object-cover rounded-lg" />
                        <div><h4 className="font-bold text-xs text-slate-200">{item.name}</h4><p className="text-[10px] text-red-400 font-bold mt-0.5">{item.price}</p></div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditClick(item)} className="p-2 bg-slate-900 border border-slate-800 hover:bg-amber-900/20 text-slate-500 hover:text-amber-500 rounded-lg transition-colors"><Edit3 size={14} /></button>
                        <button onClick={() => handleDelete(item._id)} className="p-2 bg-slate-900 border border-slate-800 hover:bg-red-900/20 text-slate-500 hover:text-red-400 rounded-lg transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}

                  {activeMenu === "portfolio" && portfolios.map(item => (
                    <div key={item._id} className={`flex justify-between items-center p-3.5 rounded-xl border transition-colors ${editingId === item._id ? 'bg-slate-800 border-amber-500/50' : 'bg-slate-950 border-slate-900 hover:border-slate-700'}`}>
                      <div className="flex items-center gap-4"><img src={item.image ? urlFor(item.image).url() : "/placeholder.jpg"} className="w-10 h-10 object-cover rounded-lg" /><h4 className="font-bold text-xs text-slate-200">{item.title || "Untitled Project"}</h4></div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditClick(item)} className="p-2 bg-slate-900 border border-slate-800 hover:bg-amber-900/20 text-slate-500 hover:text-amber-500 rounded-lg transition-colors"><Edit3 size={14} /></button>
                        <button onClick={() => handleDelete(item._id)} className="p-2 bg-slate-900 border border-slate-800 hover:bg-red-900/20 text-slate-500 hover:text-red-400 rounded-lg transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}

                  {activeMenu === "testimonial" && testimonials.map(item => (
                    <div key={item._id} className={`flex justify-between items-center p-3.5 rounded-xl border transition-colors ${editingId === item._id ? 'bg-slate-800 border-amber-500/50' : 'bg-slate-950 border-slate-900 hover:border-slate-700'}`}>
                      <div className="max-w-xs"><h4 className="font-bold text-xs text-slate-200">{item.name}</h4><p className="text-[10px] text-slate-400 italic mt-1 line-clamp-2">"{item.message}"</p></div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditClick(item)} className="p-2 bg-slate-900 border border-slate-800 hover:bg-amber-900/20 text-slate-500 hover:text-amber-500 rounded-lg transition-colors"><Edit3 size={14} /></button>
                        <button onClick={() => handleDelete(item._id)} className="p-2 bg-slate-900 border border-slate-800 hover:bg-red-900/20 text-slate-500 hover:text-red-400 rounded-lg transition-colors"><Trash2 size={14} /></button>
                      </div>
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