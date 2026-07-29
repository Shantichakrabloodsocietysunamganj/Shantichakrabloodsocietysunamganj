import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function GET() {
  try {
    const res = await cloudinary.api.resources({ type: "upload", max_results: 50 });
    const list = res.resources.map((r: any) => ({ id: r.public_id, url: r.secure_url }));
    return NextResponse.json({ images: list });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
