import { useEffect, useState } from 'react'

interface FetchState<T> {
  url: string | null
  data: T | null
  error: string | null
}

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [state, setState] = useState<FetchState<T>>({ url: null, data: null, error: null })

  useEffect(() => {
    let cancelled = false

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`)
        }
        return response.json() as Promise<T>
      })
      .then((data) => {
        if (cancelled) return
        setState({ url, data, error: null })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setState({ url, data: null, error: err instanceof Error ? err.message : 'Failed to fetch.' })
      })

    return () => {
      cancelled = true
    }
  }, [url])

  const loading = state.url !== url

  return {
    data: loading ? null : state.data,
    loading,
    error: loading ? null : state.error,
  }
}
