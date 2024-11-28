import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selected: Date | null;
  onChange: (date: Date) => void;
  minDate?: Date;
}

export default function Calendar({ selected, onChange, minDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

  const isDateDisabled = (date: Date) => {
    if (!minDate) return false;
    return date < minDate;
  };

  return (
    <div className="w-64">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-medium">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth.getDay() }).map((_, index) => (
          <div key={`empty-${index}`} className="h-8" />
        ))}
        
        {days.map(day => {
          const isDisabled = isDateDisabled(day);
          const isSelected = selected && isSameDay(day, selected);
          const isCurrent = isToday(day);
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => !isDisabled && onChange(day)}
              disabled={isDisabled}
              className={`
                h-8 rounded-full text-sm
                ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                ${isSelected ? 'bg-amber-600 text-white hover:bg-amber-700' : ''}
                ${isCurrent && !isSelected ? 'border border-amber-600' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}