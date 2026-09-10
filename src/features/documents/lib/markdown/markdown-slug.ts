export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove special characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // remove duplicate hyphens
}

export class Slugger {
  private occurrences = new Map<string, number>()

  slug(value: string): string {
    const raw = slugify(value) || 'heading'
    const count = this.occurrences.get(raw) || 0
    this.occurrences.set(raw, count + 1)

    if (count === 0) {
      return raw
    }
    return `${raw}-${count}`
  }

  reset(): void {
    this.occurrences.clear()
  }
}
