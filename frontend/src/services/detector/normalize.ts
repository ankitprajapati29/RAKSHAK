/**
 * RAKSHAK: Text Normalization
 * Preserves original text while creating normalized copy for pattern matching.
 */

export interface NormalizedText {
  original: string
  normalized: string
}

export function normalizeText(text: string): NormalizedText {
  const original = text

  let normalized = text
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

  normalized = normalized
    .replace(/\u2026/g, '...')
    .replace(/\u2013/g, '-')
    .replace(/\u2014/g, '-')
    .replace(/\u201c/g, '"')
    .replace(/\u201d/g, '"')
    .replace(/\u2018/g, "'")
    .replace(/\u2019/g, "'")

  normalized = normalized.replace(/\u20b9\s+/g, '\u20b9')

  normalized = normalizeHinglish(normalized)
  normalized = normalizeMisspellings(normalized)

  return { original, normalized }
}

function normalizeHinglish(text: string): string {
  const mappings: Record<string, string> = {
    'dm karo': 'dm me',
    'dm kar': 'dm me',
    'whatsapp kro': 'whatsapp me',
    'whatsapp kar': 'whatsapp me',
    'call kro': 'call me',
    'call kar': 'call me',
    'msg kro': 'message me',
    'msg kar': 'message me',
    'contact krna': 'contact me',
    'abhi karo': 'act now',
    'abhi hi karo': 'act now',
    'jaldi karo': 'hurry',
    'aaj hi': 'today only',
    'aaj khatam': 'ends today',
    'mat chuko': "don't miss",
    'bina kaam paisa': 'easy money without work',
    'jaldi paisa': 'quick money',
    'paisa kamao': 'earn money',
  }

  let result = text

  for (const [key, value] of Object.entries(mappings)) {
    result = result.split(key).join(value)
  }

  return result
}

function normalizeMisspellings(text: string): string {
  const misspellings: Record<string, string> = {
    garantee: 'guarantee',
    gurantee: 'guarantee',
    guaranted: 'guaranteed',
    garanteed: 'guaranteed',
    guranteed: 'guaranteed',
    asured: 'assured',
  }

  let result = text

  for (const [key, value] of Object.entries(misspellings)) {
    result = result.split(key).join(value)
  }

  return result
}

export function extractEvidence(
  original: string,
  keyword: string,
): string {
  const normalizedOriginal = original.toLowerCase()
  const normalizedKeyword = keyword.toLowerCase()

  const index = normalizedOriginal.indexOf(normalizedKeyword)

  if (index === -1) {
    return keyword
  }

  const sentenceStart = Math.max(
    0,
    Math.max(
      original.lastIndexOf('.', index),
      original.lastIndexOf('!', index),
      original.lastIndexOf('?', index),
      original.lastIndexOf('\n', index),
    ) + 1,
  )

  const sentenceEndCandidates = [
    original.indexOf('.', index + keyword.length),
    original.indexOf('!', index + keyword.length),
    original.indexOf('?', index + keyword.length),
    original.indexOf('\n', index + keyword.length),
  ].filter((position) => position !== -1)

  const sentenceEnd =
    sentenceEndCandidates.length > 0
      ? Math.min(...sentenceEndCandidates) + 1
      : original.length

  const evidence = original
    .slice(sentenceStart, sentenceEnd)
    .replace(/\s+/g, ' ')
    .trim()

  return evidence || keyword
}
