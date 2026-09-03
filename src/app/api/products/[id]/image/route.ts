import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      imageData: true,
      imageMimeType: true,
    },
  });

  if (!product?.imageData) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(Buffer.from(product.imageData), {
    headers: {
      "Content-Type": product.imageMimeType ?? "image/jpeg",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
