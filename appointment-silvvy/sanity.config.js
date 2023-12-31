import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Appointment-silvvy',

  projectId: 'v70agc0h',
  dataset: 'production',
  
  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
