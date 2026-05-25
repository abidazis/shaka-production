// studio/schemaTypes/portofolio.js
export default {
  name: 'portfolio', // Bagian name ini biarkan 'portfolio' (pakai V) karena di App.jsx React kita manggilnya pakai 'portfolio'
  title: 'Hasil Produksi',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Judul Proyek',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Foto Hasil',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
}