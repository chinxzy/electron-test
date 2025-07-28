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
    // --- Essential properties ---
    appBundleId: 'com.oditor',
    // productName: 'Oditor web pos', // REMOVED: 'productName' is not a direct property of ForgePackagerOptions
    // The product name is typically derived from the 'name' in package.json
    // or can be set at the top-level ForgeConfig if needed, but not in packagerConfig directly.
    icon: 'public/images/OditorLogo.ico', // Ensure this path is correct
    prune: true, // Prune devDependencies

    // --- CRITICAL: The ignore array to prevent packaging unnecessary files ---
    ignore: [
      // Common ignores for a Vite/Electron project
      /^\/(src|build|public|tsconfig.*|vite\.config.*|forge\.config.*|README\.md|yarn\.lock|pnpm-lock\.yaml|\.git|\.github|\.vscode|.*\.(ts|map))$/,
      // Specific ignores for Electron Forge's own modules and build tools
      /node_modules\/electron-forge/,
      /node_modules\/@electron-forge/,
      /node_modules\/vite/,
      /node_modules\/typescript/,
      /^\/src($|\/)/, // Ignore source code folder
      /^\/tests?($|\/)/, // Ignore test files
      /\.gitignore/,
      /tsconfig\.json/,
      /vite\.config\.ts/,
      /webpack\..*\.js/,
      /\.env.*$/,
      /README\.md/,
      // Add any other specific files/folders you want to exclude that are not covered above
    ],
    // --- End essential properties ---

    asar: true, // Keep ASAR packaging
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      setupIcon: 'public/images/OditorLogo.ico', // Path to the .ico file for the installer itself
      // 👉 CRITICAL FIX: Uncomment and set this to a publicly accessible URL for your icon.
      // This URL is used by Squirrel.Windows to generate the app-update.yml.
      iconUrl: 'https://stoditorfiles.blob.core.windows.net/logo-files/OditorLogo.ico', // Example: Replace with your actual public URL
      noMsi: true,
      setupExe: 'Oditor Setup.exe',
    }),
    new MakerZIP({}, ['darwin']), // Only macOS ZIP, as per simplified makers
    // If you want to build for Linux, uncomment these only if you have the necessary cross-compilation tools
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
        owner: 'chinxzy',
        name: 'electron-test',
      },
      draft: true,
      prerelease: false,
    }),
  ],
}

export default config
