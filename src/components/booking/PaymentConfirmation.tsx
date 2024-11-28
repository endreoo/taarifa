import { User, Mail, Phone, MapPin, Building2, Globe, MapPinned } from 'lucide-react';
import { MappedRoom } from '../../types/room';
import { useState } from 'react';

interface PaymentConfirmationProps {
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  room: MappedRoom | null;
  services: string[];
  setStep: (step: number) => void;
}

interface GuestInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
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
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    zipCode: '',
    city: '',
    country: ''
  });

  const handleInputChange = (field: keyof GuestInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGuestInfo(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleContinueToPayment = () => {
    // Here you would typically validate the form and process the payment
    if (!guestInfo.fullName || !guestInfo.email || !guestInfo.phone) {
      alert('Please fill in all required fields');
      return;
    }

    // For now, just log the booking details
    console.log('Booking Details:', {
      guestInfo,
      checkIn,
      checkOut,
      adults,
      children,
      room,
      services
    });

    // Here you would integrate with your payment provider
    alert('Payment integration will be implemented here');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Guest Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="John Doe"
                value={guestInfo.fullName}
                onChange={handleInputChange('fullName')}
                required
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={guestInfo.email}
                onChange={handleInputChange('email')}
                required
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Phone className="w-5 h-5" />
              </span>
              <input
                type="tel"
                placeholder="+254 700 000 000"
                value={guestInfo.phone}
                onChange={handleInputChange('phone')}
                required
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <MapPin className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Enter your address"
                value={guestInfo.address}
                onChange={handleInputChange('address')}
                required
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zip Code (Optional)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <MapPinned className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Enter zip code (optional)"
                value={guestInfo.zipCode}
                onChange={handleInputChange('zipCode')}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Building2 className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Enter your city"
                value={guestInfo.city}
                onChange={handleInputChange('city')}
                required
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Globe className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Enter your country"
                value={guestInfo.country}
                onChange={handleInputChange('country')}
                required
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
          onClick={handleContinueToPayment}
          className="w-2/3 py-3 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition-colors"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}