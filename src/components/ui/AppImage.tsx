import NextImage, { type ImageProps } from "next/image";

function normalizeImageSource(src: ImageProps["src"]): ImageProps["src"] {
  if (typeof src !== "string") {
    return src;
  }

  // Temporary safety net for typo'd upstream host from CMS data/env.
  return src
    .replace(/^https?:\/\/assets\.mymaiya\.id/i, "https://assets.mymaiyah.id")
    .replace(/^https?:\/\/mymaiya\.id/i, "https://mymaiyah.id");
}

function isLocalImageSource(src: ImageProps["src"]): boolean {
  if (typeof src !== "string") {
    return false;
  }

  return (
    src.startsWith("http://localhost/") ||
    src.startsWith("https://localhost/") ||
    src.startsWith("http://127.0.0.1/") ||
    src.startsWith("https://127.0.0.1/")
  );
}

export default function AppImage(props: ImageProps) {
  const normalizedSrc = normalizeImageSource(props.src);
  const shouldDisableOptimization = isLocalImageSource(normalizedSrc);

  return (
    <NextImage
      {...props}
      src={normalizedSrc}
      unoptimized={props.unoptimized ?? shouldDisableOptimization}
    />
  );
}
