import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Calendar from './Calendar';

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date) => void;
  icon?: LucideIcon;
  placeholder?: string;
  minDate?: Date;
}

export default function DatePicker({
  selected,
  onChange,
  icon: Icon = CalendarIcon,
  placeholder = 'Select date',
  minDate
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (date: Date) => {
    onChange(date);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-colors"
      >
        <Icon className="w-5 h-5 text-gray-500" />
        <span className="flex-grow text-left">
          {selected ? format(selected, 'MMM dd, yyyy') : placeholder}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute z-20 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 p-4"
            >
              <Calendar
                selected={selected}
                onChange={handleDateSelect}
                minDate={minDate}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}