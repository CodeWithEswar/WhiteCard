import { TagChip } from './tag-chip'

export const STANDARD_TAGS = [
  'Identity',
  'Education',
  'Travel',
  'Vehicle',
  'Renewal',
  'Personal',
]

interface TagSelectorProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
  allowMultiple?: boolean
  className?: string
}

export function TagSelector({
  selectedTags,
  onChange,
  allowMultiple = true,
  className = '',
}: TagSelectorProps) {
  const toggleTag = (tag: string) => {
    if (!allowMultiple) {
      onChange(selectedTags.includes(tag) ? [] : [tag])
      return
    }

    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag))
    } else {
      onChange([...selectedTags, tag])
    }
  }

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {STANDARD_TAGS.map((tag) => {
        const isSelected = selectedTags.includes(tag)
        return (
          <TagChip
            key={tag}
            label={tag}
            variant={isSelected ? 'selected' : 'filter'}
            onClick={() => toggleTag(tag)}
          />
        )
      })}
    </div>
  )
}
