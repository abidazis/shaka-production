export default {
  name: 'testimonial',
  title: 'Testimoni Customer',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nama Customer/Instansi', type: 'string' },
    { name: 'message', title: 'Isi Testimoni', type: 'text' },
    { name: 'rating', title: 'Rating (1-5)', type: 'number' }
  ]
}