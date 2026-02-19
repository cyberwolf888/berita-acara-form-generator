"use client"

import "photoswipe/style.css"

import { Gallery, Item } from "react-photoswipe-gallery"

// Fallback dimensions used when real image dimensions are not stored.
const FALLBACK_WIDTH = 1200
const FALLBACK_HEIGHT = 900

type ZoomableImageProps = {
  src: string
  alt: string
  /** className applied to the visible <img> element */
  imgClassName?: string
}

export function ZoomableImage({ src, alt, imgClassName }: ZoomableImageProps) {
  if (!src) return null

  return (
    <Gallery>
      <Item
        original={src}
        thumbnail={src}
        width={FALLBACK_WIDTH}
        height={FALLBACK_HEIGHT}
        alt={alt}
      >
        {({ ref, open }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={ref as React.Ref<HTMLImageElement>}
            onClick={open}
            src={src}
            alt={alt}
            className={imgClassName}
            style={{ cursor: "zoom-in" }}
          />
        )}
      </Item>
    </Gallery>
  )
}
