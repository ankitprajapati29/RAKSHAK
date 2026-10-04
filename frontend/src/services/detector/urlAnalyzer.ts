export interface UrlAnalysis {
  warnings: string[]
  suspicious: boolean
}

const URL_PATTERN = /https?:\/\/[^\s<>"']+/gi

function analyzeSingleUrl(rawUrl: string): string[] {
  const warnings: string[] = []

  let url: URL

  try {
    url = new URL(rawUrl)
  } catch {
    return warnings
  }

  const hostname = url.hostname.toLowerCase()

  if (url.username || url.password || rawUrl.includes('@')) {
    warnings.push('The URL contains an @ symbol or embedded credentials.')
  }

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
    warnings.push('The URL uses an IP address instead of a domain name.')
  }

  if (rawUrl.length > 120) {
    warnings.push('The URL is unusually long.')
  }

  const labels = hostname.split('.').filter(Boolean)

  if (labels.length >= 5) {
    warnings.push('The URL contains an unusually deep subdomain structure.')
  }

  if (hostname.includes('xn--')) {
    warnings.push('The domain uses punycode encoding.')
  }

  if (url.protocol !== 'https:') {
    warnings.push('The URL does not use HTTPS.')
  }

  return warnings
}

export function analyzeUrls(text: string): UrlAnalysis {
  const urls = text.match(URL_PATTERN) ?? []
  const warnings = urls.flatMap(analyzeSingleUrl)

  return {
    warnings: [...new Set(warnings)],
    suspicious: warnings.length > 0,
  }
}
