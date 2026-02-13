import * as screenshotone from "screenshotone-api-sdk";

let _client: screenshotone.Client | null = null;

function getClient(): screenshotone.Client {
  if (!_client) {
    _client = new screenshotone.Client(
      process.env.SCREENSHOTONE_ACCESS_KEY!,
      process.env.SCREENSHOTONE_SECRET_KEY!
    );
  }
  return _client;
}

export async function captureScreenshot(url: string): Promise<Buffer> {
  const client = getClient();
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
