import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Calendar, Users, Building, ChevronLeft, ChevronRight, FileText, Clock } from 'lucide-react';
import DatePicker from './DatePicker';
import { addDays, format, differenceInDays } from 'date-fns';

interface LongStayBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RoomRate {
  id: string;
  name: string;
  basePrice: number;
  weeklyDiscount: number;
  monthlyDiscount: number;
  quarterlyDiscount: number;
  image: string;
}

const rooms: RoomRate[] = [
  {
    id: 'executive',
    name: 'Executive Suite',
    basePrice: 150,
    weeklyDiscount: 10,
    monthlyDiscount: 20,
    quarterlyDiscount: 30,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'premium',
    name: 'Premium Suite',
    basePrice: 200,
    weeklyDiscount: 15,
    monthlyDiscount: 25,
    quarterlyDiscount: 35,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  }
];

export default function LongStayBookingModal({ isOpen, onClose }: LongStayBookingModalProps) {
  const [step, setStep] = useState(1);
  const [moveInDate, setMoveInDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number>(7); // days
  const [occupants, setOccupants] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<RoomRate | null>(null);
  const [corporateAgreement, setCorporateAgreement] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({
    name: '',
    registration: '',
    contact: ''
  });

  const calculateDiscount = (room: RoomRate, days: number) => {
    if (days >= 90) return room.quarterlyDiscount;
    if (days >= 30) return room.monthlyDiscount;
    if (days >= 7) return room.weeklyDiscount;
    return 0;
  };

  const calculateTotal = (room: RoomRate, days: number) => {
    const discount = calculateDiscount(room, days);
    const total = room.basePrice * days;
    return total - (total * (discount / 100));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // Handle final submission
    console.log({
      moveInDate,
      duration,
      occupants,
      selectedRoom,
      corporateAgreement,
      companyDetails
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {step > 1 && (
                    <button
                      onClick={handleBack}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  <h2 className="text-2xl font-serif font-bold">Long Stay Package</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="flex justify-between mt-6">
                {['Dates', 'Select Suite', 'Agreement', 'Confirmation'].map((label, index) => (
                  <div key={label} className="flex items-center">
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full
                      ${step > index + 1 ? 'bg-amber-600 text-white' : 
                        step === index + 1 ? 'bg-amber-600 text-white' : 
                        'bg-gray-100 text-gray-400'}
                    `}>
                      {index + 1}
                    </div>
                    <span className={`ml-2 ${step >= index + 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                      {label}
                    </span>
                    {index < 3 && (
                      <div className={`w-12 h-0.5 mx-2 ${step > index + 1 ? 'bg-amber-600' : 'bg-gray-100'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Step 1: Dates and Occupants */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Move-in Date
                    </label>
                    <DatePicker
                      selected={moveInDate}
                      onChange={setMoveInDate}
                      icon={Calendar}
                      placeholder="Select move-in date"
                      minDate={new Date()}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <option value={7}>1 Week</option>
                      <option value={14}>2 Weeks</option>
                      <option value={30}>1 Month</option>
                      <option value={60}>2 Months</option>
                      <option value={90}>3 Months</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Occupants
                    </label>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-500" />
                      <input
                        type="number"
                        min="1"
                        value={occupants}
                        onChange={(e) => setOccupants(parseInt(e.target.value))}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={!moveInDate}
                    className="w-full bg-amber-600 text-white py-3 rounded-full font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
                  >
                    View Available Suites
                  </button>
                </div>
              )}

              {/* Step 2: Room Selection */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid gap-6">
                    {rooms.map(room => {
                      const discount = calculateDiscount(room, duration);
                      const total = calculateTotal(room, duration);
                      const dailyRate = total / duration;

                      return (
                        <div
                          key={room.id}
                          className={`
                            p-4 border rounded-lg cursor-pointer transition-colors
                            ${selectedRoom?.id === room.id ? 'border-amber-600 bg-amber-50' : 'border-gray-200'}
                          `}
                          onClick={() => setSelectedRoom(room)}
                        >
                          <div className="flex gap-6">
                            <img
                              src={room.image}
                              alt={room.name}
                              className="w-40 h-32 object-cover rounded-lg"
                            />
                            <div className="flex-grow">
                              <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                              <div className="space-y-2">
                                <p className="text-gray-600">
                                  Base rate: ${room.basePrice}/night
                                </p>
                                {discount > 0 && (
                                  <p className="text-green-600">
                                    {discount}% discount applied
                                  </p>
                                )}
                                <div className="text-xl font-bold text-amber-600">
                                  ${dailyRate.toFixed(2)}/night
                                  <span className="text-sm text-gray-600 ml-2">
                                    (${total.toFixed(2)} total)
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <Building className="w-6 h-6 text-blue-600" />
                    <div className="flex-grow">
                      <h4 className="font-medium">Corporate Agreement Available</h4>
                      <p className="text-sm text-gray-600">Special rates for company bookings</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={corporateAgreement}
                        onChange={(e) => setCorporateAgreement(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {corporateAgreement && (
                    <div className="space-y-4 p-4 border border-blue-200 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={companyDetails.name}
                          onChange={(e) => setCompanyDetails(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Registration Number
                        </label>
                        <input
                          type="text"
                          value={companyDetails.registration}
                          onChange={(e) => setCompanyDetails(prev => ({ ...prev, registration: e.target.value }))}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Person
                        </label>
                        <input
                          type="text"
                          value={companyDetails.contact}
                          onChange={(e) => setCompanyDetails(prev => ({ ...prev, contact: e.target.value }))}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleNext}
                    disabled={!selectedRoom}
                    className="w-full bg-amber-600 text-white py-3 rounded-full font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
                  >
                    Continue to Agreement
                  </button>
                </div>
              )}

              {/* Step 3: Agreement */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-amber-50 p-4 rounded-lg flex items-center gap-4">
                    <Clock className="w-6 h-6 text-amber-600" />
                    <p className="text-sm">
                      This offer is valid for the next 3 days. The rental agreement must be signed by{' '}
                      <strong>{format(addDays(new Date(), 3), 'MMMM d, yyyy')}</strong>.
                    </p>
                  </div>

                  <div className="border rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-bold">Rental Agreement Summary</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Suite:</strong> {selectedRoom?.name}</p>
                      <p><strong>Move-in Date:</strong> {moveInDate && format(moveInDate, 'MMMM d, yyyy')}</p>
                      <p><strong>Duration:</strong> {duration} days</p>
                      <p><strong>Occupants:</strong> {occupants}</p>
                      {corporateAgreement && (
                        <>
                          <p><strong>Company:</strong> {companyDetails.name}</p>
                          <p><strong>Registration:</strong> {companyDetails.registration}</p>
                          <p><strong>Contact:</strong> {companyDetails.contact}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {/* Download agreement */}}
                      className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-5 h-5" />
                      Download Agreement
                    </button>
                    <button
                      onClick={() => {/* Send via email */}}
                      className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      Send via Email
                    </button>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full bg-amber-600 text-white py-3 rounded-full font-medium hover:bg-amber-700 transition-colors"
                  >
                    Sign Agreement Online
                  </button>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <div className="space-y-6 text-center">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-green-800 mb-2">
                      Agreement Signed Successfully
                    </h3>
                    <p className="text-green-600">
                      Your long-stay booking has been confirmed. We look forward to welcoming you!
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => {/* Download confirmation */}}
                      className="w-full bg-amber-600 text-white py-3 rounded-full font-medium hover:bg-amber-700 transition-colors"
                    >
                      Download Confirmation
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full bg-gray-100 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}