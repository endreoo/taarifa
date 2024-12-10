import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check } from 'lucide-react';
import LongStayBookingModal from './booking/LongStayBookingModal';
import { images } from '../config/images';

export default function LongStay() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const benefits = [
    "Significant discounts on monthly rates",
    "Complimentary weekly housekeeping",
    "Dedicated workspace setup",
    "All utilities included",
    "Access to premium amenities",
    "Flexible payment terms"
  ];

  return (
    <section id="long-stay" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif font-bold mb-6">Extended Stay Packages</h2>
            <p className="text-gray-600 mb-8">
              Make Taarifa Suites your home away from home with our tailored long-stay packages. 
              Perfect for business travelers, digital nomads, and those seeking an extended luxury experience in Nairobi.
            </p>
            
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <Check className="text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-amber-600 text-white px-8 py-3 rounded-full text-lg hover:bg-amber-700 transition-colors"
            >
              Request Long Stay Proposal
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-[600px]"
          >
            <img
              src={images.rooms.studio}
              alt="Long Stay Suite"
              className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl"
            />
          </motion.div>
        </div>
      </div>

      <LongStayBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}