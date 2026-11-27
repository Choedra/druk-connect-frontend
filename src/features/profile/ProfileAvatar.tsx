"use client";

import Image from "next/image";
import { useState } from "react";

export function ProfileAvatar({ name, imageUrl, className = "h-12 w-12" }: { name: string; imageUrl?: string | null; className?: string }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const src = imageUrl?.startsWith("/") ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${imageUrl}` : imageUrl;
  return (
    <span className={`relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-sky-soft font-bold text-sky ${className}`}>
      {src && failedUrl !== src ? <Image src={src} alt={`${name}'s profile`} fill sizes="96px" unoptimized className="object-cover" onError={() => setFailedUrl(src)} /> : name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "U"}
    </span>
  );
}
