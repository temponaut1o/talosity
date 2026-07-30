import { NextResponse } from "next/server";
import { upsertSeoMetadata } from "@/lib/seo/seo-service";

export const dynamic = 'force-dynamic';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }

  try {
    const result = await upsertSeoMetadata({
      pageUrl: "https://talosity.com/robots",
      pageType: "robot",
      targetKeyword: "industrial robotics directory",
      pageContent:
        "Talosity Robotics Directory helps enterprise teams discover and compare commercial robotics systems for real-world operations. The directory includes commercial cleaning robots for facilities and retail, warehouse automation robots such as AMRs and autonomous forklifts, construction robotics for heavy-site workflows, and medical robotics platforms for hospitals and clinical operations.",
      schemaMarkup: {},
    });

    return NextResponse.json({
      success: true,
      pageUrl: result.page.pageUrl,
      pageType: result.page.pageType,
      embeddingStored: Boolean(result.embedding),
      embeddingError: result.embeddingError,
      result,
    });
  } catch (error) {
    console.error("[test-seo-embedding] failed", {
      pageUrl: "https://talosity.com/robots",
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}
