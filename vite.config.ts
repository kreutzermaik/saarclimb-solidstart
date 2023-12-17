import solid from "solid-start/vite";
import netlify from "solid-start-netlify";
import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa';


export default defineConfig({
  plugins: [
    solid({ 
      ssr: true,
      // islands: true,
      adapter: netlify() 
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
