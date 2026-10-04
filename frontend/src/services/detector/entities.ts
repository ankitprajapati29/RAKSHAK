import type { RecognizedEntity } from '../../types'
import { ENTITY_REFERENCES } from '../../data/entities/entities'
import { normalizeText } from './normalize'

export function detectEntities(text: string): RecognizedEntity[] {
  const normalizedText = normalizeText(text).normalized

  if (!normalizedText) {
    return []
  }

  return ENTITY_REFERENCES
    .filter((entity) =>
      entity.aliases.some((alias) =>
        normalizedText.includes(alias.toLowerCase()),
      ),
    )
    .map((entity) => ({
      id: entity.id,
      name: entity.name,
      category: entity.category,
      description: entity.description,
    }))
}
