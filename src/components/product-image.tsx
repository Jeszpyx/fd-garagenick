"use client";

import Image from "next/image";

type ProductImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
};

export function ProductImage({
  src,
  alt,
  className = "object-cover",
  sizes,
}: ProductImageProps) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
        Нет фото
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      className={className}
      sizes={sizes}
    />
  );
}
