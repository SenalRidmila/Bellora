// src/app/api/wishlist/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. GET - User කෙනෙක්ගේ Wishlist එක ගැනීම
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId"); // URL එකෙන් userId එක ගන්නවා

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  try {
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: true, // Product විස්තරත් එක්කම එවන්න
      },
    });
    return NextResponse.json(wishlist);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching wishlist" }, { status: 500 });
  }
}

// 2. POST - Wishlist එකට එකතු කිරීම (Toggle)
// තියෙනවා නම් අයින් කරනවා, නැත්නම් දානවා
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, productId } = body;

    console.log("🔍 Wishlist POST request:", { userId, productId });

    if (!userId || !productId) {
      return NextResponse.json({ error: "userId and productId required" }, { status: 400 });
    }

    // කලින් දාලා තියෙනවද බලන්න
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    console.log("📦 Existing item:", existingItem);

    if (existingItem) {
      // තිබුනොත් Delete කරනවා (Remove)
      await prisma.wishlistItem.delete({
        where: { id: existingItem.id },
      });
      console.log("✅ Removed from wishlist");
      return NextResponse.json({ message: "Removed from wishlist", added: false });
    } else {
      // නැත්නම් Add කරනවා
      const newItem = await prisma.wishlistItem.create({
        data: { userId, productId },
      });
      console.log("✅ Added to wishlist:", newItem);
      return NextResponse.json({ message: "Added to wishlist", added: true });
    }
  } catch (error) {
    console.error("❌❌ Wishlist API Error:", error);
    return NextResponse.json({ 
      error: "Error updating wishlist", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}