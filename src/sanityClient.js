// sanityClient.js
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'v70agc0h',
  dataset: 'production',
  apiVersion: '2021-08-31', // use a UTC date string
  useCdn: true, // Use the CDN for faster responses (optional)
});

export default client;
