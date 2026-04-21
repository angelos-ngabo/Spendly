export function getInitials(label: string) {
  const trimmed = label.trim()
  if (!trimmed) return '?'
  if (trimmed.includes('@')) {
    const local = trimmed.split('@')[0] ?? ''
    const parts = local.split(/[._-]+/).filter(Boolean)
    if (parts.length >= 2) {
      return `${parts[0]![0]!}${parts[1]![0]!}`.toUpperCase()
    }
    return local.slice(0, 2).toUpperCase() || '?'
  }
  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]![0]!}${parts[1]![0]!}`.toUpperCase()
  }
  return trimmed.slice(0, 2).toUpperCase()
}
