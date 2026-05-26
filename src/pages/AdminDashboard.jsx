// src/pages/AdminDashboard.jsx
import { useState, useEffect, useRef } from "react";
import { client, urlFor } from "../sanityClient";
import { 
  LayoutDashboard, Globe, Loader2, Plus, Trash2, 
  Package, Image as ImageIcon, MessageSquare, LogOut, User, Edit3, X, Key, Menu
} from "lucide-react";

export default function AdminDashboard({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeMenu, setActiveMenu] = useState("product"); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State untuk Mobile Sidebar
  
  // State Form Input
  const [inputName, setInputName] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [inputDesc, setInputDesc] = useState("");
  const [inputImage, setInputImage] = useState(null);
  
  // State Khusus Untuk Fitur EDIT
  const [editingId, setEditingId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const fileInputRef = useRef(null);

  // State Khusus Pengaturan Akun
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const resetForm = () => {
    setInputName(""); 
    setInputPrice(""); 
    setInputDesc(""); 
    setInputImage(null);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
    // Scroll aman untuk mobile dan desktop
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsSidebarOpen(false); // Tutup sidebar di mobile setelah klik menu edit
  };

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
        await client.patch(editingId).set(docData).commit();
        alert("✅ MANTAP! Data berhasil di-update.");
      } else {
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

  const handleUpdateCredentials = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("❌ GAGAL: Konfirmasi password tidak cocok bro!");
      return;
    }
    if (newUsername.length < 5 || newPassword.length < 5) {
      alert("❌ GAGAL: Username dan Password minimal harus 5 karakter!");
      return;
    }
    localStorage.setItem("shaka_admin_user", newUsername);
    localStorage.setItem("shaka_admin_pass", newPassword);
    alert("✅ MANTAP! Sandi berhasil diubah. Silakan login ulang.");
    onLogout(); 
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

  // Helper untuk pindah menu (tutup sidebar otomatis di mobile)
  const changeMenu = (menu) => {
    setActiveMenu(menu);
    resetForm();
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col md:flex-row">
      
      {/* === MOBILE NAVBAR (Hanya Muncul di Layar HP) === */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="text-red-500 animate-pulse" size={20} />
          <h1 className="text-xs font-black uppercase tracking-widest text-slate-200">Shaka Admin</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-800 rounded-lg text-slate-300">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* === PROFESSIONAL SIDEBAR MENU BAR === */}
      <div className={`w-64 bg-slate-900 border-r border-slate-800 flex-col justify-between p-6 fixed h-full z-50 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:flex`}>
        <div className="flex flex-col gap-8 md:gap-10">
          
          <div className="hidden md:flex items-center gap-3 px-2">
            <LayoutDashboard className="text-red-500 animate-pulse" size={24} />
            <h1 className="text-sm font-black uppercase tracking-[0.2em] text-slate-200">Shaka Panel</h1>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 mb-2">Konten Modul</span>
            <button onClick={() => changeMenu("product")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeMenu === 'product' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:bg-slate-800'}`}><Package size={16} /> Kelola Produk</button>
            <button onClick={() => changeMenu("portfolio")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeMenu === 'portfolio' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:bg-slate-800'}`}><ImageIcon size={16} /> Kelola Portfolio</button>
            <button onClick={() => changeMenu("testimonial")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeMenu === 'testimonial' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:bg-slate-800'}`}><MessageSquare size={16} /> Kelola Testimoni</button>
            
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 mt-6 mb-2">Sistem Ekstra</span>
            <button onClick={() => changeMenu("settings")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeMenu === 'settings' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-slate-400 hover:bg-slate-800'}`}>
              <Key size={16} /> Pengaturan Akun
            </button>
            <div className="opacity-30 border border-dashed border-slate-700 px-4 py-3 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-wider">🔒 Menu Finansial</div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-800 pt-6 mt-8">
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

      {/* OVERLAY MOBILE BACKGROUND (Gelap saat menu samping terbuka) */}
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" />
      )}

      {/* === CONTAINER CONTENT DASHBOARD === */}
      <div className="flex-grow md:pl-64 min-h-screen">
        <div className="p-4 md:p-10 max-w-6xl mx-auto mt-4 md:mt-0">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-900 pb-6 mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">Manajemen {activeMenu}</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Ganti, hapus, tambah, atau edit visual web secara mandiri</p>
            </div>
            <button onClick={() => window.open('/', '_blank')} className="flex items-center justify-center sm:justify-start gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-3 sm:py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"><Globe size={14} /> Preview Web Live</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 items-start">
            
            {/* JIKA MENU PENGATURAN AKUN AKTIF */}
            {activeMenu === "settings" ? (
              <div className="bg-slate-900 border border-amber-500/50 p-6 md:p-8 rounded-2xl lg:col-span-5 shadow-xl shadow-amber-900/10 max-w-2xl mx-auto w-full">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500"><Key size={20} /></div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-white">Ganti Akses Login</h3>
                    <p className="text-xs text-slate-400 mt-1">Perbarui username dan password khusus untuk perangkat ini.</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateCredentials} className="flex flex-col gap-4 md:gap-5">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">Username Baru</label>
                    <input required type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:outline-none focus:border-amber-500 transition-colors text-white" placeholder="Masukkan username baru..." />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">Password Baru</label>
                    <input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:outline-none focus:border-amber-500 transition-colors text-white" placeholder="Masukkan password baru..." />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">Konfirmasi Password Baru</label>
                    <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:outline-none focus:border-amber-500 transition-colors text-white" placeholder="Ketik ulang password baru..." />
                  </div>
                  <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-wider transition-colors flex justify-center items-center gap-2 mt-2 shadow-lg shadow-amber-900/20">
                    <Key size={16} /> Simpan Sandi & Login Ulang
                  </button>
                </form>
              </div>
            ) : (
              // JIKA MENU KONTEN AKTIF (PRODUK / PORTFOLIO / TESTIMONI)
              <>
                {/* FORM AREA */}
                <div className={`bg-slate-900 border p-5 md:p-6 rounded-2xl lg:col-span-2 transition-all ${editingId ? 'border-amber-500 shadow-lg shadow-amber-900/20' : 'border-slate-800/80'}`}>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-5">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                      {editingId ? <span className="text-amber-500 flex items-center gap-2"><Edit3 size={14}/> Edit Data Mode</span> : "Form Entri Konten"}
                    </h3>
                    {editingId && (
                      <button type="button" onClick={resetForm} className="text-[10px] bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-300 flex items-center gap-1 font-bold tracking-widest uppercase">Batal <X size={10}/></button>
                    )}
                  </div>

                  <form onSubmit={handleSaveData} className="flex flex-col gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">Nama Konten / Judul</label>
                      <input required type="text" value={inputName} onChange={(e) => setInputName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs focus:outline-none focus:border-red-500 transition-colors text-white" placeholder="Ketik di sini..." />
                    </div>

                    {activeMenu === "product" && (
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">Harga Katalog</label>
                        <input required type="text" value={inputPrice} onChange={(e) => setInputPrice(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs focus:outline-none focus:border-red-500 transition-colors text-white" placeholder="Contoh: Rp 350.000" />
                      </div>
                    )}

                    {(activeMenu === "product" || activeMenu === "testimonial") && (
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">Deskripsi / Teks Review</label>
                        <textarea rows="3" value={inputDesc} onChange={(e) => setInputDesc(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs focus:outline-none focus:border-red-500 transition-colors text-white" placeholder="Ketik keterangan panjang..."></textarea>
                      </div>
                    )}

                    {activeMenu !== "testimonial" && (
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">File Gambar (Abaikan jika tidak ganti)</label>
                        <input type={editingId ? "file" : "file"} required={!editingId} accept="image/*" onChange={(e) => setInputImage(e.target.files[0])} ref={fileInputRef} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-[10px] text-slate-500 file:bg-slate-900 file:border-0 file:text-white file:font-bold file:rounded-lg file:px-3 file:py-1.5 file:mr-3 cursor-pointer" />
                      </div>
                    )}

                    <button type="submit" disabled={submitLoading} className={`w-full text-white font-bold py-4 rounded-xl text-xs uppercase tracking-wider transition-colors flex justify-center items-center gap-2 mt-2 shadow-lg ${editingId ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/20' : 'bg-green-600 hover:bg-green-700 shadow-green-900/10'}`}>
                      {submitLoading ? <Loader2 className="animate-spin" size={14} /> : (editingId ? <Edit3 size={14} /> : <Plus size={14} />)} 
                      {editingId ? "Simpan Perubahan" : "Upload Ke Website"}
                    </button>
                  </form>
                </div>

                {/* LIST AREA DENGAN TOMBOL EDIT */}
                <div className="bg-slate-900 border border-slate-800/80 p-5 md:p-6 rounded-2xl lg:col-span-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5 border-b border-slate-800 pb-3">Daftar Arsip Online</h3>
                  {loading ? (
                    <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-slate-600" size={24} /></div>
                  ) : (
                    <div className="max-h-[450px] overflow-y-auto pr-2 flex flex-col gap-3 custom-scrollbar">
                      
                      {activeMenu === "product" && products.map(item => (
                        <div key={item._id} className={`flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between sm:items-center p-4 rounded-xl border transition-colors ${editingId === item._id ? 'bg-slate-800 border-amber-500/50' : 'bg-slate-950 border-slate-900 hover:border-slate-700'}`}>
                          <div className="flex items-center gap-4">
                            <img src={item.image ? urlFor(item.image).url() : "/placeholder.jpg"} className="w-12 h-12 md:w-10 md:h-10 object-cover rounded-lg shadow-sm" />
                            <div><h4 className="font-bold text-sm md:text-xs text-slate-200">{item.name}</h4><p className="text-[11px] md:text-[10px] text-red-400 font-bold mt-0.5">{item.price}</p></div>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button onClick={() => handleEditClick(item)} className="flex-1 sm:flex-none flex justify-center p-2.5 md:p-2 bg-slate-900 border border-slate-800 hover:bg-amber-900/20 text-slate-400 hover:text-amber-500 rounded-lg transition-colors"><Edit3 size={16} /></button>
                            <button onClick={() => handleDelete(item._id)} className="flex-1 sm:flex-none flex justify-center p-2.5 md:p-2 bg-slate-900 border border-slate-800 hover:bg-red-900/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      ))}

                      {activeMenu === "portfolio" && portfolios.map(item => (
                        <div key={item._id} className={`flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between sm:items-center p-4 rounded-xl border transition-colors ${editingId === item._id ? 'bg-slate-800 border-amber-500/50' : 'bg-slate-950 border-slate-900 hover:border-slate-700'}`}>
                          <div className="flex items-center gap-4"><img src={item.image ? urlFor(item.image).url() : "/placeholder.jpg"} className="w-12 h-12 md:w-10 md:h-10 object-cover rounded-lg shadow-sm" /><h4 className="font-bold text-sm md:text-xs text-slate-200">{item.title || "Untitled Project"}</h4></div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button onClick={() => handleEditClick(item)} className="flex-1 sm:flex-none flex justify-center p-2.5 md:p-2 bg-slate-900 border border-slate-800 hover:bg-amber-900/20 text-slate-400 hover:text-amber-500 rounded-lg transition-colors"><Edit3 size={16} /></button>
                            <button onClick={() => handleDelete(item._id)} className="flex-1 sm:flex-none flex justify-center p-2.5 md:p-2 bg-slate-900 border border-slate-800 hover:bg-red-900/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      ))}

                      {activeMenu === "testimonial" && testimonials.map(item => (
                        <div key={item._id} className={`flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between sm:items-center p-4 rounded-xl border transition-colors ${editingId === item._id ? 'bg-slate-800 border-amber-500/50' : 'bg-slate-950 border-slate-900 hover:border-slate-700'}`}>
                          <div className="max-w-xs"><h4 className="font-bold text-sm md:text-xs text-slate-200">{item.name}</h4><p className="text-xs md:text-[10px] text-slate-400 italic mt-1 line-clamp-2">"{item.message}"</p></div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button onClick={() => handleEditClick(item)} className="flex-1 sm:flex-none flex justify-center p-2.5 md:p-2 bg-slate-900 border border-slate-800 hover:bg-amber-900/20 text-slate-400 hover:text-amber-500 rounded-lg transition-colors"><Edit3 size={16} /></button>
                            <button onClick={() => handleDelete(item._id)} className="flex-1 sm:flex-none flex justify-center p-2.5 md:p-2 bg-slate-900 border border-slate-800 hover:bg-red-900/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      ))}

                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}