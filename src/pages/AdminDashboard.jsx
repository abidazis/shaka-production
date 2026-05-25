// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { client, urlFor } from "../sanityClient";
import { motion } from "framer-motion";
import { LayoutDashboard, Globe, Loader2, Plus, Trash2 } from "lucide-react";

export default function AdminDashboard({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formType, setFormType] = useState("product");
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
      if (inputImage && (formType === 'product' || formType === 'portfolio')) {
        uploadedDocImage = await uploadImage(inputImage);
      }
      let doc = {};
      if (formType === "product") {
        doc = { _type: "product", name: inputName, price: inputPrice, description: inputDesc, image: uploadedDocImage };
      } else if (formType === "portfolio") {
        doc = { _type: "portfolio", title: inputName, image: uploadedDocImage };
      } else if (formType === "testimonial") {
        doc = { _type: "testimonial", name: inputName, message: inputDesc, rating: 5 };
      }
      await client.create(doc);
      alert("Data berhasil masuk!");
      setInputName(""); setInputPrice(""); setInputDesc(""); setInputImage(null);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus data ini bro?")) {
      await client.delete(id);
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center border-b border-slate-800 pb-6 mb-10">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="text-red-500" size={32} />
          <h1 className="text-2xl font-black uppercase">Shaka Custom Admin Suite</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl font-bold text-sm">
            <Globe size={16} /> Lihat Web
          </button>
          <button onClick={onLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-bold text-sm">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* FORM INPUT */}
        <div className="bg-slate-800 p-8 rounded-[2rem] border border-slate-700/50 h-fit">
          <h2 className="text-xl font-black mb-6 uppercase text-slate-300">Tambah Konten ({formType})</h2>
          <div className="grid grid-cols-3 gap-2 mb-6 bg-slate-900 p-1.5 rounded-xl text-xs font-bold text-center">
            <button onClick={() => setFormType("product")} className={`py-2 rounded-lg ${formType === 'product' ? 'bg-red-600' : 'text-slate-400'}`}>Produk</button>
            <button onClick={() => setFormType("portfolio")} className={`py-2 rounded-lg ${formType === 'portfolio' ? 'bg-red-600' : 'text-slate-400'}`}>Portfolio</button>
            <button onClick={() => setFormType("testimonial")} className={`py-2 rounded-lg ${formType === 'testimonial' ? 'bg-red-600' : 'text-slate-400'}`}>Testimoni</button>
          </div>

          <form onSubmit={handleSaveData} className="flex flex-col gap-4">
            <input required type="text" value={inputName} onChange={(e) => setInputName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm" placeholder="Nama / Judul..." />
            {formType === "product" && <input required type="text" value={inputPrice} onChange={(e) => setInputPrice(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm" placeholder="Harga..." />}
            {(formType === "product" || formType === "testimonial") && <textarea rows="3" value={inputDesc} onChange={(e) => setInputDesc(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm" placeholder="Deskripsi..."></textarea>}
            {formType !== "testimonial" && <input required type="file" accept="image/*" onChange={(e) => setInputImage(e.target.files[0])} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-400" />}
            <button type="submit" disabled={submitLoading} className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl font-bold text-sm mt-2 flex justify-center items-center gap-2">
              {submitLoading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} Simpan Konten
            </button>
          </form>
        </div>

        {/* LIST DATA */}
        <div className="bg-slate-800 p-8 rounded-[2rem] lg:col-span-2 border border-slate-700/50">
          <h2 className="text-xl font-black mb-6 uppercase text-slate-300">Data Live</h2>
          <div className="max-h-[450px] overflow-y-auto pr-2 flex flex-col gap-3">
            {formType === "product" && products.map(item => (
              <div key={item._id} className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl">
                <div className="flex items-center gap-4">
                  <img src={item.image ? urlFor(item.image).url() : "/placeholder.jpg"} className="w-12 h-12 object-cover rounded-xl" />
                  <div><h4 className="font-bold text-sm">{item.name}</h4><p className="text-xs text-red-400">{item.price}</p></div>
                </div>
                <button onClick={() => handleDelete(item._id)} className="p-2 bg-slate-800 hover:text-red-500 rounded-xl"><Trash2 size={16} /></button>
              </div>
            ))}
            {formType === "portfolio" && portfolios.map(item => (
              <div key={item._id} className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl">
                <div className="flex items-center gap-4">
                  <img src={item.image ? urlFor(item.image).url() : "/placeholder.jpg"} className="w-12 h-12 object-cover rounded-xl" />
                  <h4 className="font-bold text-sm">{item.title}</h4>
                </div>
                <button onClick={() => handleDelete(item._id)} className="p-2 bg-slate-800 hover:text-red-500 rounded-xl"><Trash2 size={16} /></button>
              </div>
            ))}
            {formType === "testimonial" && testimonials.map(item => (
              <div key={item._id} className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl">
                <div><h4 className="font-bold text-sm">{item.name}</h4><p className="text-xs text-slate-400 italic">"{item.message}"</p></div>
                <button onClick={() => handleDelete(item._id)} className="p-2 bg-slate-800 hover:text-red-500 rounded-xl"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}