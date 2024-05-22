import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTagify,
  presetTypography,
  presetUno,
  presetWebFonts,
  presetWind,
  transformerCompileClass,
  transformerDirectives,
} from "unocss";

export default defineConfig({
  shortcuts: [
    // ...
  ],
  theme: {
    colors: {
      // ...
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetTagify(),
    presetWind(),
    presetIcons({
      autoInstall: true,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        alata: "Alata",
        jetbrains: "JetBrains Mono",
      },
      provider: "bunny",
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerCompileClass(),
  ],
});
