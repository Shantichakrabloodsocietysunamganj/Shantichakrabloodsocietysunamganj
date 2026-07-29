import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// সার্ভার-সাইড Cloudinary কনফিগ (secret ব্রাউজারে যায় না)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const MAX_SIZE = 5 * 1024 * 1024; // ৫ মেগাবাইট

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "কোনো ফাইল পাওয়া যায়নি" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "ছবি ৫ মেগাবাইটের বেশি নয়" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "শুধুমাত্র ছবি আপলোড করুন" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const b64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "shantichakra/donors",
      transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (e: any) {
    console.error("Upload error:", e);
    return NextResponse.json(
      { error: "ছবি আপলোডে সমস্যা হয়েছে" },
      { status: 500 },
    );
  }
}
