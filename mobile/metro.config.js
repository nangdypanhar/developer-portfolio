const path = require('node:path')
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

// The web app's src/ folder, whose habit logic and types this app reuses.
const sharedDir = path.resolve(__dirname, '../src')

const config = getDefaultConfig(__dirname)

config.watchFolders = [sharedDir]

// Prefer "*.expo.ts" over "*.ts", so the shared habits.ts gets the Expo Supabase
// client (supabase.expo.ts) instead of the Vite one. Vite never sees .expo files.
config.resolver.sourceExts = [
  ...config.resolver.sourceExts.map((ext) => `expo.${ext}`),
  ...config.resolver.sourceExts,
]

// Packages imported from ../src resolve from mobile/node_modules, not the web
// app's, so there is only one copy of React Native, Supabase, etc.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const fromShared = context.originModulePath.startsWith(sharedDir + path.sep)
  const isPackage = !moduleName.startsWith('.') && !path.isAbsolute(moduleName)
  if (fromShared && isPackage) {
    return context.resolveRequest(
      { ...context, originModulePath: path.join(__dirname, 'package.json') },
      moduleName,
      platform,
    )
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = withNativeWind(config, { input: './global.css' })
