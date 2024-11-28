import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, Search, ArrowLeft, Car, ShoppingBasket, MessageSquare } from 'lucide-react';
import { addDays } from 'date-fns';
import DatePicker from './DatePicker';
import GuestSelector from './GuestSelector';
import RoomList from './RoomList';
import ExtraServices from './ExtraServices';
import PaymentConfirmation from './PaymentConfirmation';
import BookingSummary from './BookingSummary';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { format } from 'date-fns';

export default function BookingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { 
    checkInDate, 
    setCheckInDate, 
    checkOutDate, 
    setCheckOutDate,
    selectedRoom,
    setSelectedRoom,
    step,
    setStep
  } = useBooking();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      setStep(2);
    } catch (error) {
      console.error('Search failed:', error);
      // Maybe show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };
  const handleRoomSelect = (room: any) => {
    setSelectedRoom(room);
    setStep(3);
  };
  const handleServicesSelect = () => setStep(4);

  const steps = [
    { number: 1, title: "Dates & Guests" },
    { number: 2, title: "Select Room" },
    { number: 3, title: "Extra Services" },
    { number: 4, title: "Payment" }
  ];

  const showSummary = step > 1 && checkInDate && checkOutDate;

  const handleBooking = () => {
    const params = new URLSearchParams({
      checkIn: format(checkInDate, 'yyyy-MM-dd'),
      checkOut: format(checkOutDate, 'yyyy-MM-dd')
    });
    
    navigate(`/booking?${params.toString()}`);
    onClose();
  };

  const handleClose = () => {
    // Reset all booking state
    setCheckInDate(new Date());
    setCheckOutDate(new Date());
    setSelectedRoom(null);
    setStep(1);
    setAdults(2);
    setChildren(0);
    setSelectedServices([]);
    onClose();
  };

  // Add standard room images
  const roomImages = {
    studio: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    oneBedroom: "https://images.unsplash.com/photo-1502005097973-6a7082348e28?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    twoBedroom: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-1 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-[920px] my-2"
          >
            <div className="p-3 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  <h2 className="text-2xl font-serif font-bold">Book Your Stay</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex justify-between mt-3">
                {steps.map((s, i) => (
                  <div key={s.number} className="flex items-center">
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full
                      ${step >= s.number ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-400'}
                    `}>
                      {s.number}
                    </div>
                    <span className={`ml-2 ${step >= s.number ? 'text-gray-900' : 'text-gray-400'}`}>
                      {s.title}
                    </span>
                    {i < steps.length - 1 && (
                      <div className={`w-12 h-0.5 mx-2 ${step > s.number ? 'bg-amber-600' : 'bg-gray-100'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="lg:col-span-2">
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Check In</label>
                          <DatePicker
                            selected={checkInDate}
                            onChange={setCheckInDate}
                            icon={Calendar}
                            placeholder="Select check-in date"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Check Out</label>
                          <DatePicker
                            selected={checkOutDate}
                            onChange={setCheckOutDate}
                            icon={Calendar}
                            placeholder="Select check-out date"
                            minDate={checkInDate || new Date()}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                        <GuestSelector
                          adults={adults}
                          children={children}
                          onAdultsChange={setAdults}
                          onChildrenChange={setChildren}
                        />
                      </div>

                      <button
                        onClick={handleSearch}
                        disabled={!checkInDate || !checkOutDate || isLoading}
                        className="w-full bg-amber-600 text-white py-3 rounded-full font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <span>Loading...</span>
                        ) : (
                          <>
                            <Search className="w-5 h-5" />
                            Search Available Rooms
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <RoomList onSelect={handleRoomSelect} />
                  )}

                  {step === 3 && (
                    <ExtraServices
                      selected={selectedServices}
                      onChange={setSelectedServices}
                      onNext={handleServicesSelect}
                    />
                  )}

                  {step === 4 && (
                    <PaymentConfirmation
                      room={selectedRoom}
                      checkIn={checkInDate!}
                      checkOut={checkOutDate!}
                      adults={adults}
                      children={children}
                      services={selectedServices}
                      setStep={setStep}
                    />
                  )}
                </div>

                <div className="lg:col-span-1">
                  {step > 1 && (
                    <BookingSummary
                      checkIn={checkInDate!}
                      checkOut={checkOutDate!}
                      adults={adults}
                      children={children}
                      room={selectedRoom}
                      services={selectedServices}
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}