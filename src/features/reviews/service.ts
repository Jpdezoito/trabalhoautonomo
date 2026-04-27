import type { Review } from "@/types/marketplace";

export function calculateAverageRating(reviews: Pick<Review, "rating" | "status">[]) {
  const publishedReviews = reviews.filter(isPublishedReview);

  if (publishedReviews.length === 0) {
    return 0;
  }

  return publishedReviews.reduce((total, review) => total + review.rating, 0) / publishedReviews.length;
}

export function getPublishedReviews(reviews: Review[]) {
  return reviews.filter(isPublishedReview);
}

export function getReviewDistribution(reviews: Review[]) {
  const publishedReviews = getPublishedReviews(reviews);

  return [5, 4, 3, 2, 1].map((rating) => {
    const count = publishedReviews.filter((review) => review.rating === rating).length;

    return {
      rating,
      count,
      percentage: publishedReviews.length ? Math.round((count / publishedReviews.length) * 100) : 0,
    };
  });
}

export function getPublicReviewAuthor(review: Pick<Review, "author" | "showName">) {
  const author = review.author?.trim();

  if (!author || !review.showName) {
    return "Cliente verificado";
  }

  const [firstName, secondName] = author.split(/\s+/);
  const initial = secondName?.charAt(0);

  return initial ? `${firstName} ${initial}.` : firstName;
}

export function createReviewDraft(input: {
  workerSlug: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
}) {
  return {
    id: `REV-${Date.now()}`,
    workerSlug: input.workerSlug,
    author: input.author,
    showName: false,
    rating: input.rating,
    title: input.title,
    comment: input.comment,
    status: "pending" as const,
    submittedAt: new Date().toISOString(),
  };
}

function isPublishedReview(review: Pick<Review, "status">) {
  return !review.status || review.status === "published";
}
