import * as screenshotone from "screenshotone-api-sdk";

const client = new screenshotone.Client(
  process.env.SCREENSHOTONE_ACCESS_KEY!,
  process.env.SCREENSHOTONE_SECRET_KEY!
);

export async function captureScreenshot(url: string): Promise<Buffer> {
  const options = screenshotone.TakeOptions.url(url)
    .viewportWidth(1280)
    .viewportHeight(800)
    .format("png")
    .blockAds(true)
    .blockCookieBanners(true)
    .blockChats(true)
    .delay(3)
    .timeout(15);

  const imageBlob = await client.take(options);
  const arrayBuffer = await imageBlob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
