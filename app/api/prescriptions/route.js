import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "application/pdf"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("prescription");
    const customerName = String(formData.get("customerName") || "").trim();
    const mobileNumber = String(formData.get("mobileNumber") || "").replace(/\D/g, "");

    if (!customerName || customerName.length < 2) {
      return NextResponse.json(
        { error: "Customer name is required." },
        { status: 400 },
      );
    }

    if (mobileNumber.length < 10 || mobileNumber.length > 15) {
      return NextResponse.json(
        { error: "Valid mobile number is required." },
        { status: 400 },
      );
    }

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Prescription file is required." },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Upload JPG, PNG, or PDF." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be 5MB or less." },
        { status: 400 },
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "prescriptions");
    await mkdir(uploadsDir, { recursive: true });

    const extension = path.extname(file.name || "").toLowerCase() || ".bin";
    const referenceId = `RX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const safeFilename = `${referenceId}${extension}`;
    const filePath = path.join(uploadsDir, safeFilename);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    await writeFile(filePath, fileBuffer);

    return NextResponse.json(
      {
        message: "Prescription uploaded successfully.",
        referenceId,
        fileUrl: `/prescriptions/${safeFilename}`,
        customerName,
        mobileNumber,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to upload prescription right now." },
      { status: 500 },
    );
  }
}
