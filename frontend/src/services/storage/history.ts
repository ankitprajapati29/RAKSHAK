import type { AnalysisInput, AnalysisResult } from '../../types'

export interface AnalysisHistoryItem {
  id: string
  input: AnalysisInput
  result: AnalysisResult
}

const STORAGE_KEY = 'rakshak-analysis-history'
const MAX_HISTORY_ITEMS = 20

export function getAnalysisHistory(): AnalysisHistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) {
      return []
    }

    const parsed: unknown = JSON.parse(stored)

    return Array.isArray(parsed)
      ? (parsed as AnalysisHistoryItem[])
      : []
  } catch {
    return []
  }
}

export function saveAnalysisHistoryItem(
  item: AnalysisHistoryItem,
): void {
  const history = getAnalysisHistory()

  const updatedHistory = [
    item,
    ...history.filter((entry) => entry.id !== item.id),
  ].slice(0, MAX_HISTORY_ITEMS)

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedHistory),
  )
}

export function clearAnalysisHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}
