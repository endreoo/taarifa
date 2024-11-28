import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Minus } from 'lucide-react';

interface GuestSelectorProps {
  adults: number;
  children: number;
  onAdultsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
}

export default function GuestSelector({
  adults,
  children,
  onAdultsChange,
  onChildrenChange
}: GuestSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-colors"
      >
        <Users className="w-5 h-5 text-gray-500" />
        <span className="flex-grow text-left">
          {adults + children} Guest{adults + children !== 1 ? 's' : ''}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-10 mt-2 w-full p-4 bg-white rounded-lg shadow-xl border border-gray-100"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Adults</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onAdultsChange(Math.max(1, adults - 1))}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{adults}</span>
                  <button
                    onClick={() => onAdultsChange(adults + 1)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Children</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onChildrenChange(Math.max(0, children - 1))}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{children}</span>
                  <button
                    onClick={() => onChildrenChange(children + 1)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}