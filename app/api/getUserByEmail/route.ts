import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { GET_USER_BY_EMAIL } from "@/sanity/lib/queries";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    const user = await client.fetch(GET_USER_BY_EMAIL, { email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
