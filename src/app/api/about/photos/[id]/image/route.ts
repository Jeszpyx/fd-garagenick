import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const photo = await prisma.aboutPhoto.findFirst({
    where: { id, aboutId: 1 },
    select: {
      imageData: true,
      imageMimeType: true,
      updatedAt: true,
    },
  });

  if (!photo?.imageData) {
    return new NextResponse("Not found", { status: 404 });
  }

  const etag = `"about-photo-${id}-${photo.updatedAt.getTime()}"`;
  if (request.headers.get("if-none-match") === etag) {
    return new NextResponse(null, { status: 304 });
  }

  const body = Buffer.from(photo.imageData);

  return new NextResponse(body, {
    headers: {
      "Content-Type": photo.imageMimeType ?? "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: etag,
      "Content-Length": String(body.byteLength),
    },
  });
}
