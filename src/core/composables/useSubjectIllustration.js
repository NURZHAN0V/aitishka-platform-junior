import {
  getSubjectColor,
  getSubjectIllustrationName,
  SUBJECT_COLORS,
  SUBJECT_ILLUSTRATIONS,
} from '@/core/constants/illustrations'
import { hasIcon } from '@/utils/icons'

export function useSubjectIllustration(slug) {
  const name = getSubjectIllustrationName(slug)
  const color = getSubjectColor(slug)

  return {
    slug,
    name,
    color,
    cssVar: color ? `--subject-${slug}` : null,
    isAvailable: name ? hasIcon(name, 'avif') : false,
  }
}

export function useSubjectIllustrations() {
  return Object.entries(SUBJECT_ILLUSTRATIONS).map(([slug, name]) => ({
    slug,
    name,
    color: SUBJECT_COLORS[slug] ?? null,
    cssVar: `--subject-${slug}`,
    isAvailable: hasIcon(name, 'avif'),
  }))
}
