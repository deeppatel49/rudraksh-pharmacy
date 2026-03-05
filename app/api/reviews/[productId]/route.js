import { NextResponse } from "next/server";
import { addReview, getReviewsByProductId, getReviewSummary } from "../../../lib/reviews-db";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const resolvedParams = await params;
  const productId = resolvedParams?.productId;

  if (!productId) {
    return NextResponse.json({ error: "Missing product id." }, { status: 400 });
  }

  const reviews = await getReviewsByProductId(productId);
  const summary = getReviewSummary(reviews);

  return NextResponse.json(
    {
      productId,
      ...summary,
      reviews,
      lastUpdatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

function validatePayload(payload) {
  const reviewerName = String(payload?.reviewerName || "").trim();
  const title = String(payload?.title || "").trim();
  const description = String(payload?.description || "").trim();
  const rating = Number(payload?.rating);
  const imageDataUrl = String(payload?.imageDataUrl || "").trim();

  if (!reviewerName || reviewerName.length < 2) {
    return "Reviewer name must be at least 2 characters.";
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return "Rating must be between 1 and 5.";
  }

  if (!title || title.length < 4) {
    return "Review title must be at least 4 characters.";
  }

  if (!description || description.length < 10) {
    return "Review description must be at least 10 characters.";
  }

  if (imageDataUrl) {
    if (!imageDataUrl.startsWith("data:image/")) {
      return "Uploaded file must be an image.";
    }

    if (imageDataUrl.length > 1_200_000) {
      return "Image size is too large. Please upload a smaller image.";
    }
  }

  return null;
}

export async function POST(request, { params }) {
  const resolvedParams = await params;
  const productId = resolvedParams?.productId;

  if (!productId) {
    return NextResponse.json({ error: "Missing product id." }, { status: 400 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const validationError = validatePayload(payload);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const createdReview = await addReview(productId, payload);
  const reviews = await getReviewsByProductId(productId);
  const summary = getReviewSummary(reviews);

  return NextResponse.json(
    {
      message: "Review submitted successfully.",
      review: createdReview,
      ...summary,
      reviews,
      lastUpdatedAt: new Date().toISOString(),
    },
    {
      status: 201,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
