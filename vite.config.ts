import solid from "solid-start/vite";
import vercel from "solid-start-vercel";
import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa';


export default defineConfig({
  plugins: [
    solid({ 
      ssr: false,
      adapter: vercel()
    }),   
    VitePWA({
      manifest: {
        icons: [
          {
            src: "logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    })
  ],
});
