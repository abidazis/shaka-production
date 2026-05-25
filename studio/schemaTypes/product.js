// studio/schemaTypes/product.js
export default {
  name: 'product',
  title: 'Produk Shaka',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nama Produk',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'price',
      title: 'Harga',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Deskripsi',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Foto Produk',
      type: 'image',
      options: {
        hotspot: true // Biar bisa crop foto langsung di admin
      }
    }
  ]
}