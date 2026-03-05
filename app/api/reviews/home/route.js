import { NextResponse } from "next/server";
import { addReview, getReviewSummary, getReviewsByProductId } from "../../../lib/reviews-db";

export const dynamic = "force-dynamic";

const HOME_REVIEWS_KEY = "homepage";

function toHomeReview(review) {
  return {
    id: review.id,
    name: review.reviewerName,
    rating: review.rating,
    message: review.description,
    date: review.date,
  };
}

function validatePayload(payload) {
  const name = String(payload?.name || "").trim();
  const message = String(payload?.message || "").trim();
  const rating = Number(payload?.rating);

  if (!name || name.length < 2) {
    return "Name must be at least 2 characters.";
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return "Rating must be between 1 and 5.";
  }

  if (!message || message.length < 10) {
    return "Review message must be at least 10 characters.";
  }

  if (message.length > 1000) {
    return "Review message is too long.";
  }

  return null;
}

export async function GET() {
  const reviews = await getReviewsByProductId(HOME_REVIEWS_KEY);
  const summary = getReviewSummary(reviews);

  return NextResponse.json(
    {
      ...summary,
      reviews: reviews.map(toHomeReview),
      lastUpdatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

export async function POST(request) {
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

  await addReview(HOME_REVIEWS_KEY, {
    reviewerName: String(payload.name).trim(),
    rating: Number(payload.rating),
    title: "Website Review",
    description: String(payload.message).trim(),
  });

  const reviews = await getReviewsByProductId(HOME_REVIEWS_KEY);
  const summary = getReviewSummary(reviews);

  return NextResponse.json(
    {
      message: "Review submitted successfully.",
      ...summary,
      reviews: reviews.map(toHomeReview),
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
