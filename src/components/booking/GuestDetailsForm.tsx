import { useState } from 'react';
import { GuestDetails } from '../../types/booking';

interface GuestDetailsFormProps {
  initialValues?: GuestDetails;
  onSubmit: (details: GuestDetails) => void;
}

export default function GuestDetailsForm({ initialValues, onSubmit }: GuestDetailsFormProps) {
  const [details, setDetails] = useState<GuestDetails>(initialValues || {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(details);
  };

  const handleInputChange = (field: keyof GuestDetails) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          required
          value={details.fullName}
          onChange={handleInputChange('fullName')}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          required
          value={details.email}
          onChange={handleInputChange('email')}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          required
          value={details.phone}
          onChange={handleInputChange('phone')}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <input
          type="text"
          value={details.address}
          onChange={handleInputChange('address')}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            value={details.city}
            onChange={handleInputChange('city')}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <input
            type="text"
            value={details.country}
            onChange={handleInputChange('country')}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-amber-600 text-white py-3 rounded-full font-medium hover:bg-amber-700 transition-colors"
      >
        Continue to Payment
      </button>
    </form>
  );
} 