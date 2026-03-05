// src/app/api/cart/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. GET - User කෙනෙක්ගේ Cart එක ගැනීම
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true, // Product විස්තරත් එක්කම එවන්න
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("❌ Error fetching cart:", error);
    return NextResponse.json({ error: "Error fetching cart" }, { status: 500 });
  }
}

// 2. POST - Cart එකට එකතු කිරීම
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, productId, quantity = 1, size } = body;

    console.log("🛒 Cart POST request:", { userId, productId, quantity, size });

    if (!userId || !productId) {
      return NextResponse.json({ error: "userId and productId required" }, { status: 400 });
    }

    // කලින් දාලා තියෙනවද බලන්න (same product + same size) 
    // Size එක null විදිහට handle කරන්න special where condition එකක් use කරන්න
    const whereClause = size 
      ? { userId_productId_size: { userId, productId, size } }
      : { userId, productId, size: null };

    const existingItem = await prisma.cartItem.findFirst({
      where: whereClause,
    });

    if (existingItem) {
      // තිබුනොත් Quantity එක වැඩි කරන්න
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      });
      console.log("✅ Updated cart item quantity:", updatedItem);
      return NextResponse.json({ 
        message: "Cart updated", 
        item: updatedItem,
        action: "updated" 
      });
    } else {
      // නැත්නම් අලුතින් Add කරන්න
      const newItem = await prisma.cartItem.create({
        data: { 
          userId, 
          productId, 
          quantity, 
          size: size || null  // Explicitly set null if size is undefined/empty
        },
        include: { product: true },
      });
      console.log("✅ Added to cart:", newItem);
      return NextResponse.json({ 
        message: "Added to cart", 
        item: newItem,
        action: "added" 
      });
    }
  } catch (error) {
    console.error("❌❌ Cart API Error:", error);
    return NextResponse.json({ 
      error: "Error updating cart",
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}

// 3. DELETE - Cart Item එකක් Remove කිරීම
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cartItemId = searchParams.get("itemId");

    if (!cartItemId) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 });
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    console.log("✅ Removed from cart:", cartItemId);
    return NextResponse.json({ message: "Removed from cart" });
  } catch (error) {
    console.error("❌ Error removing from cart:", error);
    return NextResponse.json({ error: "Error removing from cart" }, { status: 500 });
  }
}

// 4. PUT - Cart Item Quantity Update කිරීම
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { itemId, quantity } = body;

    if (!itemId || quantity === undefined) {
      return NextResponse.json({ error: "Item ID and quantity required" }, { status: 400 });
    }

    if (quantity <= 0) {
      // Quantity 0 නම් delete කරන්න
      await prisma.cartItem.delete({
        where: { id: itemId },
      });
      return NextResponse.json({ message: "Removed from cart" });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: true },
    });

    console.log("✅ Updated cart quantity:", updatedItem);
    return NextResponse.json({ message: "Cart updated", item: updatedItem });
  } catch (error) {
    console.error("❌ Error updating cart:", error);
    return NextResponse.json({ error: "Error updating cart" }, { status: 500 });
  }
}
