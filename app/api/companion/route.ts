import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
debugger
  try {
    const body = await req.json();
    const user = await currentUser();
    console.log(user, "user111")
    const { src, name, description, instruction, seed, categoryId } = body;
    if (!user || !user.id || !user.username) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    if (
      !src ||
      !name ||
      !description ||
      !instruction ||
      !seed ||
      !categoryId
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    //   TODO: check for subscriptions

    const companion = await prismadb.companion.create({
      data: {
        categoryId,
        userId: user.id,
        userName: user.firstName || "",
        src,
        seed,
        name,
        description,
        instructions: instruction,
      },
    });
    return NextResponse.json(companion);
  } catch (error) {
    console.log("[COMPANION_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
