import { Platform, Share } from 'react-native'

interface ShareContent {
  title: string
  message: string
  url: string
}

// The app's one platform branch. Web uses the browser share sheet (or the
// clipboard where there isn't one); iOS/Android use React Native's Share.
// `navigator` is only touched inside the web function, so it never runs on native.
// Returns a status message to show, or null.
export const shareHabits = Platform.select<(content: ShareContent) => Promise<string | null>>({
  web: async ({ title, message, url }) => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text: message, url })
        return null
      } catch (err) {
        // The user closed the share sheet: not an error.
        if (err instanceof DOMException && err.name === 'AbortError') return null
      }
    }
    await navigator.clipboard.writeText(`${message} ${url}`)
    return 'Link copied!'
  },
  default: async ({ title, message, url }) => {
    // Android ignores `url`, so it goes in the message too.
    await Share.share({ title, message: `${message} ${url}`, url })
    return null
  },
})
