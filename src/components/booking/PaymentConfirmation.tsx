import { User, Mail, Phone, MapPin } from 'lucide-react';
import BookingSummary from './BookingSummary';
import { MappedRoom } from '../../types/room';

interface PaymentConfirmationProps {
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  room: MappedRoom | null;
  services: string[];
  setStep: (step: number) => void;
}

export default function PaymentConfirmation({
  checkIn,
  checkOut,
  adults,
  children,
  room,
  services,
  setStep
}: PaymentConfirmationProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Guest Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <Phone className="w-5 h-5" />
                  </span>
                  <input
                    type="tel"
                    placeholder="+254 700 000 000"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter your address"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(3)}
              className="w-1/3 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
            <button 
              className="w-2/3 py-3 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition-colors"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <BookingSummary
          checkIn={checkIn}
          checkOut={checkOut}
          adults={adults}
          children={children}
          room={room}
          services={services}
        />
      </div>
    </div>
  );
}