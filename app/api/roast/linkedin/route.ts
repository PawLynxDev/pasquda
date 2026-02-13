import { NextRequest, NextResponse, after } from "next/server";
import { generateLinkedInRoast } from "@/lib/ai";
import {
  createPendingRoast,
  completeRoast,
  failRoast,
  uploadFile,
} from "@/lib/supabase";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, image_base64 } = body;

    if (!text && !image_base64) {
      return NextResponse.json(
        { error: "Paste your LinkedIn text or upload a screenshot." },
        { status: 400 }
      );
    }

    if (text && text.trim().length < 20) {
      return NextResponse.json(
        { error: "That's too short. Paste more of your LinkedIn profile to get a proper roast." },
        { status: 400 }
      );
    }

    if (image_base64 && image_base64.length > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image too large. Max 2MB." },
        { status: 400 }
      );
    }

    // Determine domain/label
    const domain = "LinkedIn Profile";

    // Upload image to storage if provided
    let contentFileUrl: string | null = null;
    if (image_base64) {
      const buffer = Buffer.from(image_base64, "base64");
      const ext = image_base64.startsWith("/9j/") ? "jpg" : "png";
      const filename = `linkedin-${Date.now()}.${ext}`;
      contentFileUrl = await uploadFile(
        buffer,
        filename,
        ext === "jpg" ? "image/jpeg" : "image/png"
      );
    }

    const id = await createPendingRoast({
      url: "linkedin-profile",
      domain,
      roast_type: "linkedin",
      content_text: text || null,
      content_file_url: contentFileUrl,
    });

    after(async () => {
      try {
        const roastData = await generateLinkedInRoast(text, image_base64);

        await completeRoast(id, {
          screenshot_url: contentFileUrl || null,
          ...roastData,
        });
      } catch (error) {
        console.error("LinkedIn roast error:", error);
        await failRoast(
          id,
          "Your LinkedIn persona broke our AI. That's either impressive or deeply concerning."
        );
      }
    });

    return NextResponse.json({ id });
  } catch (error) {
    console.error("LinkedIn roast API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Even Pasquda has bad days." },
      { status: 500 }
    );
  }
}
