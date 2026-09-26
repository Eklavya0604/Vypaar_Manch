import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, CheckCircle, ThumbsUp, MessageCircle } from 'lucide-react';
import { ReviewForm } from './ReviewForm';
import { useAuth } from '@/hooks/useAuth';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  owner_response: string | null;
  created_at: string;
  consumer_id: string | null;
  is_verified?: boolean;
}

interface ReviewsSectionProps {
  businessId: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  onReviewSubmitted?: () => void;
  canReview?: boolean;
  completedServiceRequestId?: string;
}

export function ReviewsSection({ 
  businessId, 
  reviews, 
  averageRating, 
  totalReviews,
  onReviewSubmitted,
  canReview = false,
  completedServiceRequestId
}: ReviewsSectionProps) {
  const { profile } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1]++;
    }
  });

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    onReviewSubmitted?.();
  };

  const getRatingLabel = (rating: number) => {
    const labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return labels[Math.min(Math.floor(rating) - 1, 4)] || 'No Rating';
  };

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Reviews & Ratings
          </CardTitle>
          {canReview && profile && !showReviewForm && (
            <Button onClick={() => setShowReviewForm(true)} size="sm">
              <Star className="h-4 w-4 mr-2" />
              Write Review
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Summary */}
        <div className="bg-gradient-to-br from-secondary/50 to-secondary/20 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold text-foreground">
                {averageRating > 0 ? Number(averageRating).toFixed(1) : '--'}
              </div>
              <div className="flex items-center justify-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating) 
                        ? 'text-warning fill-warning' 
                        : 'text-muted-foreground/30'
                    }`} 
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </p>
              {averageRating > 0 && (
                <p className="text-sm font-medium text-primary mt-1">
                  {getRatingLabel(averageRating)}
                </p>
              )}
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 w-full space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingCounts[rating - 1];
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="h-3 w-3 text-warning fill-warning" />
                    </div>
                    <Progress value={percentage} className="h-2 flex-1" />
                    <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && profile && (
          <ReviewForm
            businessId={businessId}
            consumerId={profile.id}
            serviceRequestId={completedServiceRequestId}
            onSuccess={handleReviewSuccess}
            onCancel={() => setShowReviewForm(false)}
          />
        )}

        {/* Trust Indicators */}
        <div className="flex flex-wrap gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-success" />
            Verified Reviews
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <ThumbsUp className="h-3 w-3 text-primary" />
            Authentic Feedback
          </Badge>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">No reviews yet</p>
            <p className="text-muted-foreground mt-1">
              Be the first to share your experience
            </p>
            {canReview && profile && !showReviewForm && (
              <Button 
                onClick={() => setShowReviewForm(true)} 
                className="mt-4"
                variant="outline"
              >
                Write the First Review
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < review.rating 
                                ? 'text-warning fill-warning' 
                                : 'text-muted-foreground/30'
                            }`} 
                          />
                        ))}
                      </div>
                      {review.is_verified && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1 text-success" />
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    
                    {review.title && (
                      <h5 className="font-semibold text-foreground mb-1">{review.title}</h5>
                    )}
                    
                    {review.content && (
                      <p className="text-muted-foreground leading-relaxed">{review.content}</p>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-3">
                      {new Date(review.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Owner Response */}
                {review.owner_response && (
                  <div className="mt-4 p-4 bg-secondary/50 rounded-lg border-l-4 border-primary">
                    <p className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Response from Owner
                    </p>
                    <p className="text-sm text-muted-foreground">{review.owner_response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
