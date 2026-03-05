// src/app/api/admin/recent-orders/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        customerName: true,
        totalAmount: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(recentOrders);
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return NextResponse.json({ error: "Error fetching orders" }, { status: 500 });
  }
}
