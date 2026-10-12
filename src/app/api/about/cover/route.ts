import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const about = await prisma.aboutInfo.findUnique({
    where: { id: 1 },
    select: {
      coverImageData: true,
      coverImageMimeType: true,
      updatedAt: true,
    },
  });

  if (!about?.coverImageData) {
    return new NextResponse("Not found", { status: 404 });
  }

  const etag = `"about-cover-${about.updatedAt.getTime()}"`;
  if (request.headers.get("if-none-match") === etag) {
    return new NextResponse(null, { status: 304 });
  }

  const body = Buffer.from(about.coverImageData);

  return new NextResponse(body, {
    headers: {
      "Content-Type": about.coverImageMimeType ?? "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: etag,
      "Content-Length": String(body.byteLength),
    },
  });
}
