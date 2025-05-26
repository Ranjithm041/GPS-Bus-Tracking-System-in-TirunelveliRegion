import { useEffect } from "react";
import { motion } from "framer-motion";
import { Bus } from "lucide-react";

const EntranceAnimation = () => {
  useEffect(() => {
    // Disable body scroll while animation plays
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gradient-to-br from-primary-500 via-accent-500 to-secondary-500 flex items-center justify-center">
      {/* Central Animated Content */}
      <div className="relative w-full max-w-4xl px-4 mx-auto text-center">
        {/* Animated Bus + Title moving left to right */}
        <motion.div
          initial={{ x: "-100vw" }}
          animate={{ x: "30vw" }}
          transition={{ duration: 6, ease: "easeInOut" }}
          className="absolute top-0 left-0"
        >
          <div className="flex items-center gap-4">
            {/* Bouncing Bus Icon */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 1, repeat: 4, repeatType: "reverse" }}
              className="bg-white p-4 rounded-full shadow-xl"
            >
              <Bus className="w-12 h-12 text-primary-500" />
            </motion.div>

            {/* Bus Tracker Title */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-white px-6 py-3 rounded-full shadow-xl"
            >
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Tirunelveli Bus Tracker
              </h1>
            </motion.div>
          </div>
        </motion.div>

        {/* Centered Fading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 4, times: [0, 0.5, 1] }}
          className="flex flex-col items-center justify-center h-full text-white"
        >
          <p className="text-2xl md:text-4xl font-bold tracking-wide drop-shadow-md">
            Real-time GPS Tracking
          </p>
          <p className="mt-2 text-lg md:text-2xl font-medium opacity-90">
            Connecting Tirunelveli, One Bus at a Time
          </p>
        </motion.div>

        {/* Background Pulse Animation */}
        <motion.div
          animate={{ scale: [1, 2.5, 1], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "mirror" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full blur-3xl opacity-30 -z-10"
        />
      </div>

      {/* Progress Bar at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/20">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="h-full bg-white"
        />
      </div>
    </div>
  );
};

export default EntranceAnimation;
