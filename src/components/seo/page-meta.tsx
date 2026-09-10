import { useEffect } from 'react'
import { SEO } from './seo-config'
import { absoluteUrl } from '../../lib/url'

export interface PageMetaProps {
  title: string
  description?: string
  canonical?: string
  image?: string
  imageAlt?: string
  noIndex?: boolean
  noFollow?: boolean
}

function updateMetaTag(name: string, content: string, isProperty = false) {
  const selector = isProperty
    ? `meta[property="${name}"]`
    : `meta[name="${name}"]`
  let element = document.querySelector(selector) as HTMLMetaElement | null

  if (!element) {
    element = document.createElement('meta')
    if (isProperty) {
      element.setAttribute('property', name)
    } else {
      element.setAttribute('name', name)
    }
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
}

export function PageMeta({
  title,
  description = SEO.defaultDescription,
  canonical,
  image = SEO.defaultImage,
  imageAlt = SEO.defaultImageAlt,
  noIndex = false,
  noFollow = false,
}: PageMetaProps) {
  useEffect(() => {
    // 1. Title
    document.title = title

    // 2. Meta description
    updateMetaTag('description', description)

    // 3. Robots directive
    const robotsContent = `${noIndex ? 'noindex' : 'index'},${noFollow ? 'nofollow' : 'follow'}`
    updateMetaTag('robots', robotsContent)

    // 4. Canonical link (only if indexable or explicitly passed)
    if (!noIndex) {
      const canonicalHref = canonical
        ? absoluteUrl(canonical)
        : absoluteUrl(window.location.pathname)
      updateLinkTag('canonical', canonicalHref)
    }

    // 5. Open Graph Metadata
    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:url', absoluteUrl(window.location.pathname), true)
    updateMetaTag('og:image', absoluteUrl(image), true)
    updateMetaTag('og:image:alt', imageAlt, true)

    // 6. Twitter Card Metadata
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', absoluteUrl(image))
  }, [title, description, canonical, image, imageAlt, noIndex, noFollow])

  return null
}
