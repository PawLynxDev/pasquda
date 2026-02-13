import { NextRequest, NextResponse, after } from "next/server";
import { generateResumeRoast } from "@/lib/ai";
import {
  createPendingRoast,
  completeRoast,
  failRoast,
  uploadFile,
} from "@/lib/supabase";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Please upload a PDF file." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted. Nice try though." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Max 5MB. Your resume shouldn't be that long anyway." },
        { status: 400 }
      );
    }

    // Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    // Keep a Buffer copy for Supabase upload (unpdf detaches the ArrayBuffer)
    const buffer = Buffer.from(uint8);

    const { extractText } = await import("unpdf");
    const { text: rawTextParts } = await extractText(new Uint8Array(uint8));
    const resumeText = (Array.isArray(rawTextParts) ? rawTextParts.join("\n") : String(rawTextParts)).slice(0, 10000);

    if (resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Could not extract text from the PDF. Is this actually a resume?" },
        { status: 400 }
      );
    }

    // Upload PDF to storage
    const filename = `resume-${Date.now()}.pdf`;
    const fileUrl = await uploadFile(buffer, filename, "application/pdf");

    // Extract a display name from the filename
    const displayName = file.name.replace(/\.pdf$/i, "").slice(0, 50) || "Resume";

    const id = await createPendingRoast({
      url: "resume-upload",
      domain: displayName,
      roast_type: "resume",
      content_text: resumeText,
      content_file_url: fileUrl,
    });

    after(async () => {
      try {
        const roastData = await generateResumeRoast(resumeText);

        await completeRoast(id, {
          screenshot_url: null,
          ...roastData,
        });
      } catch (error) {
        console.error("Resume roast error:", error);
        await failRoast(
          id,
          "Your resume broke our AI. Maybe that's why you're not getting callbacks."
        );
      }
    });

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Resume roast API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Even Pasquda has bad days." },
      { status: 500 }
    );
  }
}
