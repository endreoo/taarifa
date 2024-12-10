import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, CreditCard, Award } from 'lucide-react';
import { format } from 'date-fns';
import { EzeeAPI } from '../../services/EzeeAPI';
import { MappedRoom } from '../../types/room';
import BookingSummary from './BookingSummary';

interface MemberBookingProps {
  userProfile: {
    name: string;
    email: string;
    memberSince: string;
    status: string;
    points: number;
    discountLevel: string;
  };
}

export default function MemberBooking({ userProfile }: MemberBookingProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(new Date());
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState<MappedRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<MappedRoom | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      try {
        const ezeeApi = new EzeeAPI();
        const roomData = await ezeeApi.getRoomInventoryWithDetails(
          format(checkIn, 'yyyy-MM-dd'),
          format(checkOut, 'yyyy-MM-dd')
        );
        setRooms(roomData);
      } catch (err) {
        setError('Failed to fetch room data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [checkIn, checkOut]);

  const applyMemberDiscount = (rate: number) => {
    const discountPercentage = parseInt(userProfile.discountLevel) || 0;
    return rate * (1 - discountPercentage / 100);
  };

  const handleBooking = async () => {
    if (!selectedRoom) return;

    try {
      // Store booking data
      sessionStorage.setItem('bookingData', JSON.stringify({
        checkIn,
        checkOut,
        room: {
          ...selectedRoom,
          rates: [{
            ...selectedRoom.rates[0],
            baseRate: applyMemberDiscount(selectedRoom.rates[0].baseRate)
          }]
        },
        adults,
        children,
        services: [],
        guestInfo: {
          fullName: userProfile.name,
          email: userProfile.email
        }
      }));

      // Navigate to payment confirmation
      navigate('/booking/payment');
    } catch (error) {
      console.error('Booking error:', error);
      setError('Failed to process booking');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-amber-50 p-4 rounded-lg mb-6 flex items-center gap-4">
        <Award className="w-6 h-6 text-amber-600" />
        <div>
          <h3 className="font-medium">{userProfile.status} Benefits</h3>
          <p className="text-sm text-gray-600">
            Enjoy {userProfile.discountLevel} off our best available rates
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h3 className="text-lg font-semibold">Select Dates</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={format(checkIn, 'yyyy-MM-dd')}
                  onChange={(e) => setCheckIn(new Date(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={format(checkOut, 'yyyy-MM-dd')}
                  onChange={(e) => setCheckOut(new Date(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  min={format(checkIn, 'yyyy-MM-dd')}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h3 className="text-lg font-semibold">Guests</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adults
                </label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  {[1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Children
                </label>
                <select
                  value={children}
                  onChange={(e) => setChildren(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  {[0, 1, 2].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading available rooms...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-600">
              {error}
            </div>
          ) : (
            <div className="space-y-4">
              {rooms.map(room => (
                <div
                  key={room.roomTypeId}
                  className={`
                    bg-white p-6 rounded-lg shadow-sm cursor-pointer transition-colors
                    ${selectedRoom?.roomTypeId === room.roomTypeId ? 'ring-2 ring-amber-600' : ''}
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
                      <p className="text-gray-600 mb-4">{room.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>Up to {room.maxOccupancy.adults + room.maxOccupancy.children} guests</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 line-through">
                            KES {room.rates[0].baseRate.toLocaleString()}
                          </div>
                          <div className="text-xl font-bold text-amber-600">
                            KES {applyMemberDiscount(room.rates[0].baseRate).toLocaleString()}
                            <span className="text-sm text-gray-600 ml-2">per night</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <BookingSummary
            checkIn={checkIn}
            checkOut={checkOut}
            adults={adults}
            children={children}
            room={selectedRoom ? {
              ...selectedRoom,
              rates: [{
                ...selectedRoom.rates[0],
                baseRate: applyMemberDiscount(selectedRoom.rates[0].baseRate)
              }]
            } : null}
            services={[]}
          />
          
          <button
            onClick={handleBooking}
            disabled={!selectedRoom}
            className="w-full mt-4 bg-amber-600 text-white py-3 rounded-full font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
} 