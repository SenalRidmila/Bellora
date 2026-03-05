// src/app/api/orders/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. GET - Orders ගන්න (userId query param එකක් තියේනම් user orders විතරක් ගන්නවා)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const orders = await prisma.order.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true, // Product details එක්කම ගන්න
          },
        },
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// 2. POST - අලුත් Order එකක් දැමීම (Checkout)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const newOrder = await prisma.order.create({
      data: {
        // Customer Info
        customerName: body.customerName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        userId: body.userId || null, // Login වෙලා නම් ID එක, නැත්නම් null

        // Order Info
        totalAmount: body.totalAmount, // Decimal string එකක් විදිහට එන්න ඕනේ
        status: "PENDING",
        paymentStatus: "UNPAID",

        // Order Items
        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            productImage: item.image,
            quantity: item.quantity,
            price: item.price,
            selectedSize: item.selectedSize || "Standard",
          })),
        },
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}