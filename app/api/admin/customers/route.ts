// src/app/api/admin/customers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Get all users with their order count and total spent
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: { orders: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate total spent for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orders = await prisma.order.findMany({
          where: { userId: user.id },
          select: { totalAmount: true },
        });

        const totalSpent = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          orderCount: user._count.orders,
          totalSpent,
        };
      })
    );

    return NextResponse.json(usersWithStats);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ error: "Error fetching customers" }, { status: 500 });
  }
}
