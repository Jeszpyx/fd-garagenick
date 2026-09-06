import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      imageData: true,
      imageMimeType: true,
      updatedAt: true,
    },
  });

  if (!product?.imageData) {
    return new NextResponse("Not found", { status: 404 });
  }

  const etag = `"${id}-${product.updatedAt.getTime()}"`;
  if (request.headers.get("if-none-match") === etag) {
    return new NextResponse(null, { status: 304 });
  }

  const body = Buffer.from(product.imageData);

  return new NextResponse(body, {
    headers: {
      "Content-Type": product.imageMimeType ?? "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: etag,
      "Content-Length": String(body.byteLength),
    },
  });
}
