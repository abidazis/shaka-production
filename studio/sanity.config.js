import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'shaka-production-admin',

  projectId: 'xisin4yd',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), structureTool()],

  schema: {
    types: schemaTypes,
  },
})
