import { trackEvent } from '../utils/analytics';

const BookingButton = () => {
  const handleBooking = () => {
    trackEvent('booking_initiated', {
      room_type: 'luxury_suite',
      price: '150',
      currency: 'USD'
    });
    // Rest of booking logic
  };

  return (
    <button onClick={handleBooking}>
      Book Now
    </button>
  );
};

export default BookingButton; 