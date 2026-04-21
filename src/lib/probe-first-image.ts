export function probeImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('fail'))
    img.src = url
  })
}

export async function firstLoadableImageUrl(urls: readonly string[]): Promise<string | null> {
  for (const url of urls) {
    try {
      await probeImage(url)
      return url
    } catch {
      /* try next */
    }
  }
  return null
}
