"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import {
  getGuestCart,
  clearGuestCart,
  getGuestWishlist,
  clearGuestWishlist,
} from "@/lib/guestStorage";

/** Login වදද localStorage guest data -> DB sync කරන component */
function GuestSyncHandler() {
  const { data: session, status } = useSession();
  const syncedRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id || syncedRef.current) return;
    syncedRef.current = true;

    const userId = session.user.id;
    const guestCart = getGuestCart();
    const guestWishlist = getGuestWishlist();

    if (guestCart.length === 0 && guestWishlist.length === 0) return;

    const syncAll = async () => {
      try {
        // ---- CART SYNC ----
        if (guestCart.length > 0) {
          await Promise.all(
            guestCart.map((item) =>
              fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId: item.productId, quantity: item.quantity }),
              })
            )
          );
          clearGuestCart();
        }

        // ---- WISHLIST SYNC ----
        // Fetch existing DB wishlist first to avoid toggling items already there
        if (guestWishlist.length > 0) {
          const res = await fetch(`/api/wishlist?userId=${userId}`);
          const existingItems: { productId: string }[] = res.ok ? await res.json() : [];
          const existingIds = new Set(existingItems.map((i) => i.productId));

          // Only add items that are NOT already in the DB
          const toAdd = guestWishlist.filter((item) => !existingIds.has(item.productId));
          await Promise.all(
            toAdd.map((item) =>
              fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId: item.productId }),
              })
            )
          );
          clearGuestWishlist();
        }

        console.log("[GuestSync] Sync complete.");
      } catch (err) {
        console.error("[GuestSync] Sync error:", err);
      }
    };

    syncAll();
  }, [status, session?.user?.id]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GuestSyncHandler />
      {children}
    </SessionProvider>
  );
}