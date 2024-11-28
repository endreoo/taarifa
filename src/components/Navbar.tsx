import { Menu, X, MapPin, Phone, Mail, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import BookingModal from './booking/BookingModal';
import OnlineCheckinModal from './checkin/OnlineCheckinModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);

  const scrollToLongStay = () => {
    const element = document.getElementById('long-stay');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false); // Close mobile menu if open
    }
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="hidden lg:block bg-gray-100">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Parklands, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <a href="tel:+254700000000">+254 700 000 000</a>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <a href="mailto:info@taariifasuites.com">info@taariifasuites.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-serif font-bold text-gray-800">Taariifa Suites</Link>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/suites" className="text-gray-600 hover:text-gray-900">Our Suites</Link>
              <button 
                onClick={scrollToLongStay}
                className="text-gray-600 hover:text-gray-900"
              >
                View Long Stay Packages
              </button>
              <Link to="/amenities" className="text-gray-600 hover:text-gray-900">Amenities</Link>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => setIsCheckinOpen(true)}
                className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-900 transition duration-300 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Online Check-in
              </button>
              <button
                onClick={() => setIsBookingOpen(true)}
                className="bg-amber-600 text-white px-6 py-2 rounded-full hover:bg-amber-700 transition duration-300"
              >
                Book Now
              </button>
            </div>
            <button
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-gray-600">Home</Link>
            <Link to="/suites" className="block px-3 py-2 text-gray-600">Our Suites</Link>
            <button
              onClick={scrollToLongStay}
              className="w-full text-left px-3 py-2 text-gray-600"
            >
              View Long Stay Packages
            </button>
            <Link to="/amenities" className="block px-3 py-2 text-gray-600">Amenities</Link>
            <button
              onClick={() => {
                setIsOpen(false);
                setIsCheckinOpen(true);
              }}
              className="w-full text-left px-3 py-2 flex items-center gap-2 text-gray-600"
            >
              <LogIn className="w-4 h-4" />
              Online Check-in
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                setIsBookingOpen(true);
              }}
              className="w-full text-left px-3 py-2 bg-amber-600 text-white rounded-full"
            >
              Book Now
            </button>
          </div>
        </div>
      )}

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <OnlineCheckinModal isOpen={isCheckinOpen} onClose={() => setIsCheckinOpen(false)} />
    </nav>
  );
}