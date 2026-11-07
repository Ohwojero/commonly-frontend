/**
 * Bullet points & item details helpers
 * Handles clean reconstruction of items that were fragmented by comma-splitting or sentence-splitting,
 * strips leading numbers and bullet glyphs, and formats items cleanly as Key: Value pairs.
 */

/**
 * Reconstructs an array of items, stitching back together any entries that were
 * accidentally split across commas or sentences by previous database saves.
 */
export function reconstructItems(rawItems: string[] = []): string[] {
  if (!rawItems || rawItems.length === 0) return []

  // Flatten any lines if items contain embedded newlines
  const lines: string[] = []
  for (const raw of rawItems) {
    if (typeof raw !== 'string') continue
    const parts = raw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
    lines.push(...parts)
  }

  const result: string[] = []

  for (const item of lines) {
    // Strip leading numbers (e.g. "1.", "1)", "(1)"), bullets ("•", "-", "*", "o", "◦")
    const clean = item
      .replace(/^(?:(?:\d+\s*[.):\-]|\(\s*\d+\s*\)|[•\-\*o\u2022\u25E6])\s*)+/, '')
      .trim()
    if (!clean) continue

    // Check if this line is a continuation of the previous item (e.g. from comma fragmentation)
    if (result.length > 0) {
      const prev = result[result.length - 1]
      const startsWithLower = /^[a-z]/.test(clean)
      const startsWithConjunction = /^(?:and|or|but|with|so|including|plus|to|for|while)\b/i.test(clean)
      const prevDoesNotEndSentence = !/[.!?]$/.test(prev)
      const colonIdx = clean.indexOf(':')
      const hasNoLabel = colonIdx === -1 || colonIdx > 45

      if ((startsWithLower || startsWithConjunction || prevDoesNotEndSentence) && hasNoLabel) {
        result[result.length - 1] = `${prev}, ${clean}`
        continue
      }
    }

    result.push(clean)
  }

  return result
}

/**
 * Parses a bullet string into an optional label and value.
 * Example: "Multi-adjustable 3D armrests: Offers height..."
 * -> { label: "Multi-adjustable 3D armrests", value: "Offers height..." }
 */
export function parseBullet(text: string): { label: string; value: string } {
  if (!text) return { label: '', value: '' }
  const clean = text
    .replace(/^(?:(?:\d+\s*[.):\-]|\(\s*\d+\s*\)|[•\-\*o\u2022\u25E6])\s*)+/, '')
    .trim()

  const colonIdx = clean.indexOf(':')
  // Ensure the colon is within a reasonable title length (<= 65 chars) and doesn't contain sentence punctuation
  if (colonIdx > 0 && colonIdx <= 65) {
    const potentialLabel = clean.slice(0, colonIdx).trim()
    if (!/[.!?]/.test(potentialLabel)) {
      return {
        label: potentialLabel,
        value: clean.slice(colonIdx + 1).trim(),
      }
    }
  }

  return { label: '', value: clean }
}

/**
 * Parses product description into structured bullets or paragraphs.
 * If the description contains bullets (•, -, *), Chinese/Japanese brackets (【...】),
 * multiple lines, or multiple sentences of the form "Feature: writeup",
 * it splits them into clean points with boldable labels.
 */
export function parseDescription(desc: string = ''): { isList: boolean; items: { label: string; value: string }[] } {
  if (!desc) return { isList: false, items: [] }
  const text = desc.trim()
  if (!text) return { isList: false, items: [] }

  let rawLines = text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)

  // If text is a single block without newlines, check if it contains multiple bullets or "Label: "
  if (rawLines.length === 1) {
    if (/[•\u2022\u25E6]/.test(text)) {
      rawLines = text.split(/[•\u2022\u25E6]/).map((s) => s.trim()).filter(Boolean)
    } else if (/【[^】]+】/.test(text)) {
      rawLines = text.split(/(?=【[^】]+】)/).map((s) => s.trim()).filter(Boolean)
    } else if (/(?<=[.!?])\s+(?=[A-Za-z0-9\s/&-]{2,35}:\s)/.test(text)) {
      rawLines = text.split(/(?<=[.!?])\s+(?=[A-Za-z0-9\s/&-]{2,35}:\s)/).map((s) => s.trim()).filter(Boolean)
    }
  }

  const items: { label: string; value: string }[] = []
  let hasAnyLabelOrBullet = false

  for (const line of rawLines) {
    // Strip leading bullets (•, -, *, etc.)
    const clean = line.replace(/^[•\-\*o\u2022\u25E6\s]+/, '').trim()
    if (!clean) continue

    // Check for 【LABEL】- or 【LABEL】:
    const bracketMatch = clean.match(/^【([^】]+)】\s*[-:]?\s*(.*)$/)
    if (bracketMatch) {
      hasAnyLabelOrBullet = true
      items.push({
        label: bracketMatch[1].trim(),
        value: bracketMatch[2].trim(),
      })
      continue
    }

    // Check for Label: Value where label is <= 45 chars
    const colonIdx = clean.indexOf(':')
    if (colonIdx > 0 && colonIdx <= 45) {
      const potentialLabel = clean.slice(0, colonIdx).trim()
      if (!/[.!?]/.test(potentialLabel)) {
        hasAnyLabelOrBullet = true
        items.push({
          label: potentialLabel,
          value: clean.slice(colonIdx + 1).trim(),
        })
        continue
      }
    }

    if (line !== clean) {
      hasAnyLabelOrBullet = true
    }

    items.push({
      label: '',
      value: clean,
    })
  }

  const isList = rawLines.length > 1 || hasAnyLabelOrBullet

  return { isList, items }
}

/**
 * Parses Item Details specs into structured rows for key-value display.
 * Supports:
 * - Tab separation (\t), e.g. "Brand\tMarsail", "Product Dimensions\t27.5\"D x 27.7\"W x 45.3\"H"
 * - Colon separation (:), e.g. "Brand: DRAGONN", "Color: Black"
 * - Flattening embedded newlines from database entries
 * - Merging comma-fragmented values (e.g. "Nylon", "mental", "mesh" -> "Nylon, mental, mesh")
 * - Alternating line pairs (Line 1: Key, Line 2: Value)
 */
export function parseItemDetails(rawItems: string[] = []): { hasLabel: boolean; label: string; value: string }[] {
  if (!rawItems || rawItems.length === 0) return []

  // Step 1: Flatten all newlines inside rawItems
  const rawLines: string[] = []
  for (const raw of rawItems) {
    if (typeof raw !== 'string') continue
    const lines = raw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
    rawLines.push(...lines)
  }

  // Step 2: Extract label and value, supporting both TAB (\t) and COLON (:)
  // Also heal lines that are continuations (e.g. "mental", "mesh" from comma splits)
  const rows: { hasLabel: boolean; label: string; value: string }[] = []

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i]
    const tabIdx = line.indexOf('\t')
    const colonIdx = line.indexOf(':')

    // 1. Tab separated (Amazon table copy: "Brand\tMarsail")
    if (tabIdx > 0 && (colonIdx === -1 || tabIdx < colonIdx)) {
      const label = line.slice(0, tabIdx).trim()
      const value = line.slice(tabIdx + 1).trim()
      rows.push({ hasLabel: true, label, value })
      continue
    }

    // 2. Colon separated ("Brand: DRAGONN")
    if (colonIdx > 0 && colonIdx <= 45) {
      const label = line.slice(0, colonIdx).trim()
      const value = line.slice(colonIdx + 1).trim()
      rows.push({ hasLabel: true, label, value })
      continue
    }

    // 3. Alternating lines (Line i: Key, Line i+1: Value)
    if (
      line.length <= 35 &&
      !/[.!?,:;\t]/.test(line) &&
      i + 1 < rawLines.length &&
      !rawLines[i + 1].includes('\t') &&
      !rawLines[i + 1].includes(':')
    ) {
      const label = line.trim()
      const value = rawLines[i + 1].trim()
      rows.push({ hasLabel: true, label, value })
      i++ // Skip next line since it was consumed as value
      continue
    }

    // 4. Continuation line from comma split (e.g. "mental", "mesh")
    if (rows.length > 0) {
      rows[rows.length - 1].value += `, ${line.trim()}`
    } else {
      rows.push({ hasLabel: false, label: '', value: line.trim() })
    }
  }

  return rows
}

/**
 * Parses multi-line or bulleted textarea input from the admin dashboard.
 * Supports:
 * - One item per line (newlines)
 * - Pasted bullets (•, -, *, o)
 * - Pasted numbered lists (1. ... 2. ...)
 * - Semicolon separated lists
 * - Preserves commas inside sentences so they are NOT shattered into pieces.
 */
export function parseListInput(v: string): string[] {
  if (!v) return []
  const text = v.trim()
  if (!text) return []

  // 1. If input contains newlines, split by line!
  if (text.includes('\n')) {
    return text
      .split(/\r?\n/)
      .map((line) => line.replace(/^(?:(?:\d+\s*[.):\-]|\(\s*\d+\s*\)|[•\-\*o\u2022\u25E6])\s*)+/, '').trim())
      .filter(Boolean)
  }

  // 2. If single-line with bullet glyphs (•, etc.)
  if (/[•\u2022\u25E6]/.test(text)) {
    return text
      .split(/[•\u2022\u25E6]/)
      .map((part) => part.replace(/^(?:(?:\d+\s*[.):\-]|\(\s*\d+\s*\)|[\-\*])\s*)+/, '').trim())
      .filter(Boolean)
  }

  // 3. If single-line with numbered bullets like "1. Item A 2. Item B"
  if (/(?:^|\s+)\d+[\.)]\s+/.test(text)) {
    return text
      .split(/(?:^|\s+)(?=\d+[\.)]\s+)/)
      .map((part) => part.replace(/^(?:(?:\d+\s*[.):\-]|\(\s*\d+\s*\))\s*)+/, '').trim())
      .filter(Boolean)
  }

  // 4. If semicolons are used
  if (text.includes(';')) {
    return text.split(';').map((s) => s.trim()).filter(Boolean)
  }

  // 5. If commas are used:
  // If there are colons (e.g. "Brand: DRAGONN, Material: Mesh Metal"), only split before "Label:"
  if (text.includes(',')) {
    if (text.includes(':')) {
      const parts = text.split(/,\s*(?=[A-Za-z0-9\s-]{2,30}:)/)
      if (parts.length > 1) {
        return parts.map((s) => s.trim()).filter(Boolean)
      }
    }
    // Fallback: simple tags like "Developers, Remote Workers"
    return text.split(',').map((s) => s.trim()).filter(Boolean)
  }

  return [text]
}
