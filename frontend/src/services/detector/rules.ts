import type { DetectedRedFlag } from '../../types'
import { normalizeText, extractEvidence } from './normalize'
import { PATTERNS, type PatternDef } from './patterns'

function containsAny(text: string, values: string[]): boolean {
  return values.some((value) => text.includes(value))
}

function hasContext(text: string, context?: string[]): boolean {
  if (!context || context.length === 0) {
    return true
  }

  return containsAny(text, context)
}

function isExcluded(text: string, pattern: PatternDef): boolean {
  return Boolean(
    pattern.excludePatterns &&
      containsAny(text, pattern.excludePatterns),
  )
}

function patternMatches(text: string, pattern: PatternDef): boolean {
  if (pattern.id === 'suspicious_url_structure') {
    return false
  }

  if (isExcluded(text, pattern)) {
    return false
  }

  const keywordMatch =
    containsAny(text, pattern.keywords) ||
    containsAny(text, pattern.hindiKeywords ?? [])

  if (!keywordMatch) {
    return false
  }

  return hasContext(text, pattern.contextRequired)
}

function findMatchedKeyword(
  normalizedText: string,
  pattern: PatternDef,
): string {
  const allKeywords = [
    ...pattern.keywords,
    ...(pattern.hindiKeywords ?? []),
  ]

  let bestKeyword = ''
  let bestLength = 0

  for (const keyword of allKeywords) {
    const index = normalizedText.indexOf(keyword)

    if (index !== -1 && keyword.length > bestLength) {
      bestLength = keyword.length
      bestKeyword = keyword
    }
  }

  return bestKeyword
}

function createRedFlag(
  pattern: PatternDef,
  originalText: string,
  normalizedText: string,
): DetectedRedFlag {
  const matchedKeyword = findMatchedKeyword(normalizedText, pattern)

  return {
    id: pattern.id,
    name: pattern.name,
    severity: pattern.severity,
    explanation: {
      en: pattern.explanationEn,
      hi: pattern.explanationHi,
    },
    evidence: matchedKeyword
      ? extractEvidence(originalText, matchedKeyword)
      : '',
  }
}

export function detectRedFlags(text: string): DetectedRedFlag[] {
  const normalizedResult = normalizeText(text)
  const normalizedText = normalizedResult.normalized

  if (!normalizedText) {
    return []
  }

  return PATTERNS
    .filter((pattern) => patternMatches(normalizedText, pattern))
    .map((pattern) =>
      createRedFlag(
        pattern,
        normalizedResult.original,
        normalizedText,
      ),
    )
}
