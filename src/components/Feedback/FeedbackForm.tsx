import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { submitFeedback } from '../../services/api';
import { toast } from 'react-toastify';

interface FeedbackFormProps {
  busNumber: string;
  onSubmit: () => void;
}

const FeedbackForm = ({ busNumber, onSubmit }: FeedbackFormProps) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [timelyArrival, setTimelyArrival] = useState<boolean | null>(null);
  const [cleanliness, setCleanliness] = useState(0);
  const [driverBehavior, setDriverBehavior] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !review || timelyArrival === null) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedback({
        busNumber,
        rating,
        review,
        timelyArrival,
        cleanliness,
        driverBehavior
      });
      toast.success('Thank you for your feedback!');
      onSubmit();
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-lg"
      onSubmit={handleSubmit}
    >
      <h3 className="text-xl font-semibold mb-4">Rate Your Journey</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Overall Rating*</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setRating(star)}
              className={`p-1 rounded-full ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              <Star className="w-8 h-8 fill-current" />
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Was the bus on time?*</label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setTimelyArrival(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              timelyArrival === true
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <ThumbsUp size={18} />
            <span>Yes</span>
          </button>
          <button
            type="button"
            onClick={() => setTimelyArrival(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              timelyArrival === false
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <ThumbsDown size={18} />
            <span>No</span>
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Cleanliness</label>
        <input
          type="range"
          min="1"
          max="5"
          value={cleanliness}
          onChange={(e) => setCleanliness(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Poor</span>
          <span>Excellent</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Driver Behavior</label>
        <input
          type="range"
          min="1"
          max="5"
          value={driverBehavior}
          onChange={(e) => setDriverBehavior(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Poor</span>
          <span>Excellent</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Your Review*</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience..."
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
          rows={4}
        />
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-primary-500 text-white py-2 rounded-md disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </motion.button>
    </motion.form>
  );
};

export default FeedbackForm;