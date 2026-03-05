// src/app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // අද දින නානාව ගන්න
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // මුළු ඇණවුම් ගණන සහ ආදායම
    const totalOrdersCount = await prisma.order.count();
    const allOrders = await prisma.order.findMany({
      select: { totalAmount: true },
    });
    const totalRevenue = allOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

    // Pending ඇණවුම් ගණන
    const pendingOrders = await prisma.order.count({
      where: { status: "PENDING" },
    });

    // අද ඇණවුම් සහ ආදායම
    const todayOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      select: { totalAmount: true },
    });

    const todayRevenue = todayOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const todayOrdersCount = todayOrders.length;

    // Low Stock Count (Stock < 5)
    const lowStockCount = await prisma.product.count({
      where: {
        stock: {
          lt: 5,
        },
        status: "Active",
      },
    });

    return NextResponse.json({
      totalRevenue,
      totalOrders: totalOrdersCount,
      pendingOrders,
      lowStockCount,
      todayRevenue,
      todayOrders: todayOrdersCount,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Error fetching stats" }, { status: 500 });
  }
}
