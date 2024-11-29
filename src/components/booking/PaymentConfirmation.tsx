import { User, Mail, Phone, MapPin, Building2, Globe, MapPinned } from 'lucide-react';
import { MappedRoom } from '../../types/room';
import { useState } from 'react';
import { FlutterwaveService } from '../../services/FlutterwaveService';

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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field: keyof GuestInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGuestInfo(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleContinueToPayment = async () => {
    // Validate required fields
    if (!guestInfo.fullName || !guestInfo.email || !guestInfo.phone || !guestInfo.address || !guestInfo.city || !guestInfo.country) {
      alert('Please fill in all required fields');
      return;
    }

    if (!room) {
      alert('No room selected');
      return;
    }

    setIsProcessing(true);

    try {
      const flutterwaveService = new FlutterwaveService();
      const tx_ref = flutterwaveService.generateTransactionRef();

      // Calculate total amount
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      const roomTotal = room.rates[0].baseRate * nights;
      const extraAdultsTotal = adults > 2 ? room.rates[0].extraAdultRate * (adults - 2) * nights : 0;
      const extraChildrenTotal = children > 0 ? room.rates[0].extraChildRate * children * nights : 0;
      const servicesTotal = services.length * 50;
      const totalAmount = Math.round(roomTotal + extraAdultsTotal + extraChildrenTotal + servicesTotal);

      // Format phone number to remove spaces and ensure it starts with country code
      const formattedPhone = guestInfo.phone.replace(/[^0-9]/g, '');
      const phoneWithCode = formattedPhone.startsWith('254') ? formattedPhone : `254${formattedPhone.replace(/^0+/, '')}`;

      // Store booking data in session storage
      sessionStorage.setItem('bookingData', JSON.stringify({
        checkIn,
        checkOut,
        room,
        adults,
        children,
        services,
        guestInfo: {
          ...guestInfo,
          phone: phoneWithCode
        },
        amount: totalAmount
      }));

      console.log('Payment Data:', {
        amount: totalAmount,
        currency: 'KES',
        email: guestInfo.email,
        phone_number: phoneWithCode,
        name: guestInfo.fullName,
        tx_ref,
        redirect_url: `${window.location.origin}/booking/confirmation`
      });

      await flutterwaveService.initializePayment({
        amount: totalAmount,
        currency: 'KES',
        email: guestInfo.email,
        phone_number: phoneWithCode,
        name: guestInfo.fullName,
        tx_ref,
        redirect_url: `${window.location.origin}/booking/confirmation`
      });

    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert('Unable to initialize payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
          disabled={isProcessing}
          className="w-2/3 py-3 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <span className="animate-spin">⌛</span>
              Processing...
            </>
          ) : (
            'Continue to Payment'
          )}
        </button>
      </div>
    </div>
  );
}