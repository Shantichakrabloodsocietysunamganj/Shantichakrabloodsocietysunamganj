import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// সার্ভার-সাইড Cloudinary কনফিগ (secret ব্রাউজারে যায় না)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const MAX_SIZE = 200 * 1024; // ২০০ কিলোবাইট

// চিত্রের আসল magic bytes — যাতে ভুয়া content-type দিয়ে অন্য ফাইল আপলোড না হয়
const MAGIC: { type: string; bytes: number[] }[] = [
  { type: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { type: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { type: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38] },
  { type: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF....WEBP
  { type: "image/bmp", bytes: [0x42, 0x4d] },
];

function detectImage(buf: Buffer): string | null {
  for (const m of MAGIC) {
    if (m.bytes.every((b, i) => buf[i] === b)) {
      // webp RIFF container — WEBP stamp পরে থাকে
      if (m.type === "image/webp" && buf.toString("ascii", 8, 12) !== "WEBP") continue;
      return m.type;
    }
  }
  return null;
}

// সাধারণ in-memory rate limiter (best-effort; warm instance-এ কাজ করে)
const RATE_MAX = 20; // প্রতি IP ৬০ সেকেন্ডে সর্বোচ্চ ২০টি
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; first: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const e = hits.get(ip);
  if (!e || now - e.first > RATE_WINDOW_MS) {
    hits.set(ip, { count: 1, first: now });
    return false;
  }
  e.count += 1;
  return e.count > RATE_MAX;
}

export async function POST(req: NextRequest) {
  try {
    const ip = (req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local").trim();
    if (rateLimited(ip)) {
      return NextResponse.json({ error: "খুব বেশি আপলোড। একটু পরে আবার চেষ্টা করুন।" }, { status: 429 });
    }

    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "কোনো ফাইল পাওয়া যায়নি" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "ছবি ২০০ কিলোবাইটের মধ্যে হতে হবে (১০০KB-এর কাছাকাছি রাখুন)" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "শুধুমাত্র ছবি আপলোড করুন" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const realType = detectImage(buffer);
    if (!realType) {
      return NextResponse.json({ error: "ফাইলটি বৈধ ছবি নয়" }, { status: 400 });
    }

    const b64 = buffer.toString("base64");
    const dataURI = `data:${realType};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "shantichakra/donors",
      transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (e: any) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "ছবি আপলোডে সমস্যা হয়েছে" }, { status: 500 });
  }
}
