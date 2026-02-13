import { captureScreenshot } from "@/lib/screenshot";
import { generateRoast } from "@/lib/ai";
import {
  completeRoast,
  failRoast,
  uploadScreenshot,
  findRecentScreenshot,
} from "@/lib/supabase";

export async function processWebsiteRoast(
  id: string,
  url: string,
  domain: string
) {
  try {
    // Check for cached screenshot
    let screenshotBuffer: Buffer | null = null;
    let screenshotUrl = await findRecentScreenshot(domain);

    if (!screenshotUrl) {
      // Take a fresh screenshot
      screenshotBuffer = await captureScreenshot(url);
      const filename = `${domain}-${Date.now()}.png`;
      screenshotUrl = await uploadScreenshot(screenshotBuffer, filename);
    } else {
      // Download the cached screenshot for Claude
      const response = await fetch(screenshotUrl);
      const arrayBuffer = await response.arrayBuffer();
      screenshotBuffer = Buffer.from(arrayBuffer);
    }

    // Generate AI roast
    const roastData = await generateRoast(url, screenshotBuffer);

    // Save completed roast
    await completeRoast(id, {
      screenshot_url: screenshotUrl,
      ...roastData,
    });
  } catch (error) {
    console.error("Roast processing error:", error);
    await failRoast(
      id,
      "This website is so broken, even our AI gave up. That's almost impressive."
    );
  }
}
