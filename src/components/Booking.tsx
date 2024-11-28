import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import RoomList from './booking/RoomList';
import BookingSummary from './booking/BookingSummary';

export function Booking() {
  const [searchParams] = useSearchParams();
  const { 
    setCheckInDate, 
    setCheckOutDate,
    checkInDate,
    checkOutDate,
    adults,
    children,
    selectedRoom,
    setSelectedRoom
  } = useBooking();

  console.log('Booking Component Rendered', {
    checkInDate,
    checkOutDate,
    adults,
    children,
    selectedRoom,
    searchParams: Object.fromEntries(searchParams.entries())
  });

  useEffect(() => {
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    
    console.log('Setting dates:', { checkIn, checkOut });
    
    if (checkIn) setCheckInDate(new Date(checkIn));
    if (checkOut) setCheckOutDate(new Date(checkOut));
  }, [searchParams, setCheckInDate, setCheckOutDate]);

  if (!checkInDate || !checkOutDate) {
    return <div>Loading dates...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Select Your Room</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <RoomList onSelect={setSelectedRoom} />
        </div>
        <div>
          <BookingSummary
            checkIn={checkInDate}
            checkOut={checkOutDate}
            adults={adults}
            children={children}
            room={selectedRoom}
            services={[]}
          />
        </div>
      </div>
    </div>
  );
} 