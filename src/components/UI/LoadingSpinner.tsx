import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner = ({ size = 'medium' }: LoadingSpinnerProps) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 'w-8 h-8';
      case 'large':
        return 'w-16 h-16';
      case 'medium':
      default:
        return 'w-12 h-12';
    }
  };

  const containerSize = getSize();

  return (
    <div className="flex justify-center items-center p-4">
      <div className={`${containerSize} relative`}>
        <motion.div
          className="absolute top-0 left-0 right-0 bottom-0 border-4 border-transparent border-t-primary-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1 left-1 right-1 bottom-1 border-4 border-transparent border-t-primary-300 rounded-full"
          animate={{ rotate: -240 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <motion.div 
            className="w-2 h-2 bg-primary-600 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;