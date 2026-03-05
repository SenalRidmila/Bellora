// src/app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Next.js 15 වල params Promise එකක් විදිහට එන්නේ
type Props = {
  params: Promise<{ id: string }>;
};

// 1. GET - තනි Product එකක් ලබා ගැනීම (Frontend එකට අවශ්‍ය මේ කොටසයි)
export async function GET(req: Request, props: Props) {
  try {
    const params = await props.params; // params await කරන්න
    
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// 2. PUT - Product එක Update කිරීම (Admin Panel එකට)
export async function PUT(req: Request, props: Props) {
  try {
    const params = await props.params;
    
    const body = await req.json();
    const { 
      name, 
      description, 
      price, 
      discountPrice, 
      category, 
      images, 
      stock, 
      status, 
      allowCustomDesign, 
      sizes 
    } = body;

    const updatedProduct = await prisma.product.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        description,
        // Price Decimal නිසා parseFloat කරන්න ඕනේ
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        category,
        images,
        stock: parseInt(stock),
        status,
        allowCustomDesign,
        sizes
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("[PRODUCT_UPDATE]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// 3. DELETE - Product එක Delete කිරීම (Admin Panel එකට)
export async function DELETE(req: Request, props: Props) {
  try {
    const params = await props.params;

    const deletedProduct = await prisma.product.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(deletedProduct);
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}