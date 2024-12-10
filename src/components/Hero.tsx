import { motion } from 'framer-motion';
import { useState } from 'react';
import BookingModal from './booking/BookingModal';
import { images } from '../config/images';

export default function Hero() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="relative h-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${images.hero}")`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <div className="relative h-full flex items-center justify-center text-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
            Welcome to Luxury Living
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Experience the perfect blend of home comfort and hotel luxury in the heart of Parklands, Nairobi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="bg-amber-600 text-white px-8 py-3 rounded-full text-lg hover:bg-amber-700 transition-colors"
            >
              Book Your Stay
            </button>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-full text-lg hover:bg-gray-100 transition-colors">
              View Long Stay Packages
            </button>
          </div>
        </motion.div>
      </div>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}