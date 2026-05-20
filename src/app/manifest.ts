import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MASZ-Africa',
    short_name: 'MASZ-Africa',
    description: 'Mining Equipment & Services in Ghana and West Africa',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#016BF2',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
