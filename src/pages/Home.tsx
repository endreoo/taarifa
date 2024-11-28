import Hero from '../components/Hero';
import Features from '../components/Features';
import Suites from '../components/Suites';
import LongStay from '../components/LongStay';
import Location from '../components/Location';
import BookingModal from '../components/booking/BookingModal';
import { useBooking } from '../context/BookingContext';

export default function Home() {
  const { isBookingOpen, setIsBookingOpen } = useBooking();

  return (
    <div>
      <Hero />
      <Features />
      <Suites />
      <LongStay />
      <Location />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}