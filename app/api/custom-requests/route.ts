// src/app/api/custom-requests/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const newRequest = await prisma.customRequest.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        requiredDate: body.requiredDate,
        budget: body.budget,
        description: body.description,
        image: body.image,
        
        // අලුත් මිනුම් ටික මෙතනට එකතු කළා
        fullLength: body.fullLength,
        shoulder: body.shoulder,
        bust: body.bust,
        waist: body.waist,
        hips: body.hips,
        sleeveLength: body.sleeveLength,
        armhole: body.armhole,

        status: "Pending"
      },
    });
    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating custom request:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const requests = await prisma.customRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}