import NextImage, { type ImageProps } from "next/image";

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
  const shouldDisableOptimization = isLocalImageSource(props.src);

  return (
    <NextImage
      {...props}
      unoptimized={props.unoptimized ?? shouldDisableOptimization}
    />
  );
}
