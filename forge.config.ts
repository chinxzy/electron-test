import type { ForgeConfig } from '@electron-forge/shared-types'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerRpm } from '@electron-forge/maker-rpm'
import { VitePlugin } from '@electron-forge/plugin-vite'
import { FusesPlugin } from '@electron-forge/plugin-fuses'
import { FuseV1Options, FuseVersion } from '@electron/fuses'
import { PublisherGithub } from '@electron-forge/publisher-github'

const config: ForgeConfig = {
  packagerConfig: {
    appBundleId: 'com.oditor',
    icon: 'public/images/OditorLogo.ico', // Ensure this path is correct relative to your project root
    prune: true, // Prune devDependencies
    asar: true, // Keep ASAR packaging

    // --- REVISED: Simplified ignore array ---
    // This ignore array is more standard and less likely to accidentally exclude vital app files.
    // VitePlugin handles bundling, so you generally don't need to ignore your source code here.
    ignore: [
      /^\/(src|build|public|tsconfig.*|vite\.config.*|forge\.config.*|README\.md|yarn\.lock|pnpm-lock\.yaml|\.git|\.github|\.vscode|.*\.(ts|map))$/,
      // Keep other specific files you know should be ignored, but be careful with broad regexes.
      // Example: If 'src' contains only source code and is bundled, you might not need to ignore it here.
      // If 'public' contains assets you want to include, don't ignore it.
      // The initial regex `^\/(src|build|public|...)` is already quite comprehensive.
      // Let's remove the redundant `/^\/src($|\/)/` to be safe.
      /\.env.*$/, // Ignore .env files
    ],
    // --- End revised ignore array ---
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      setupIcon: 'public/images/OditorLogo.ico', // Path to the .ico file for the installer itself
      iconUrl: 'https://stoditorfiles.blob.core.windows.net/logo-files/OditorLogo.ico', // Ensure this is a public, valid URL
      noMsi: true,
      setupExe: 'Oditor Setup.exe',
    }),
    new MakerZIP({}, ['darwin']), // Only macOS ZIP, as per simplified makers
    // Uncomment these if you intend to build for Linux and have the necessary tools
    // new MakerRpm({}),
    // new MakerDeb({})
  ],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: 'electron/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'electron/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),

    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  publishers: [
    new PublisherGithub({
      repository: {
        owner: 'chinxzy', // Double-check this is your exact GitHub username/org
        name: 'electron-test', // Double-check this is your exact repo name
      },
      // --- CRITICAL FIX: Change draft to false ---
      draft: false, // Change this to false to create a public release
      prerelease: false, // Keep this as false for a standard release
    }),
  ],
}

export default config
