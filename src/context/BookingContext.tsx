import { createContext, useContext, useState } from 'react';
import { MappedRoom } from '../types/room';
import { addDays } from 'date-fns';

interface BookingContextType {
  checkInDate: Date;
  setCheckInDate: (date: Date) => void;
  checkOutDate: Date;
  setCheckOutDate: (date: Date) => void;
  selectedRoom: MappedRoom | null;
  setSelectedRoom: (room: MappedRoom | null) => void;
  step: number;
  setStep: (step: number) => void;
  isBookingOpen: boolean;
  setIsBookingOpen: (isOpen: boolean) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  
  const [checkInDate, setCheckInDate] = useState<Date>(today);
  const [checkOutDate, setCheckOutDate] = useState<Date>(tomorrow);
  const [selectedRoom, setSelectedRoom] = useState<MappedRoom | null>(null);
  const [step, setStep] = useState(1);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleCheckInDateChange = (date: Date) => {
    setCheckInDate(date);
    // Automatically set checkout to next day
    setCheckOutDate(addDays(date, 1));
  };

  return (
    <BookingContext.Provider
      value={{
        checkInDate,
        setCheckInDate: handleCheckInDateChange,
        checkOutDate,
        setCheckOutDate,
        selectedRoom,
        setSelectedRoom,
        step,
        setStep,
        isBookingOpen,
        setIsBookingOpen,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
} 