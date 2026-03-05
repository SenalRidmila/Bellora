// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all products (optimized with pagination)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit");
    const page = searchParams.get("page");

    // Pagination parameters
    const take = limit ? parseInt(limit) : undefined;
    const skip = page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined;

    const products = await prisma.product.findMany({
      where: {
        ...(category && { category }),
        ...(status && { status }),
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(take && { take }),
      ...(skip && { skip }),
      select: {
        id: true,
        name: true,
        price: true,
        discountPrice: true,
        category: true,
        images: true, // Only first image needed for card
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
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
      sizes,
    } = body;

    // Validation
    if (!name || !price || !category) {
      return NextResponse.json(
        { error: "Name, price, and category are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        category,
        images: images || [],
        stock: parseInt(stock) || 0,
        status: status || "Active",
        allowCustomDesign: allowCustomDesign || false,
        sizes: sizes || [],
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
