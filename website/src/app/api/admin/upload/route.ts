import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { isAuthed } from "@/lib/auth";

const { config } = cloudinary;

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const buf = Buffer.from(await file.arrayBuffer());
    const b64 = `data:${file.type};base64,${buf.toString("base64")}`;

    config({
      cloud_name: process.env.CLOUDINARY_APP_NAME,
      api_key: process.env.CLOUDINARY_APP_KEY,
      api_secret: process.env.CLOUDINARY_APP_SECRET,
    });

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "happytails", resource_type: "image" },
        (err, res) => (err ? reject(err) : resolve(res))
      );
      stream.end(b64);
    });

    return NextResponse.json({ ok: true, url: result.secure_url, publicId: result.public_id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Upload failed" }, { status: 500 });
  }
}
