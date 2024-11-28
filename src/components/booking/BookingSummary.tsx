import { Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import { MappedRoom } from '../../types/room';

interface BookingSummaryProps {
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  room: MappedRoom | null;
  services: string[];
}

export default function BookingSummary({
  checkIn,
  checkOut,
  adults,
  children,
  room,
  services
}: BookingSummaryProps) {
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const roomTotal = room ? room.rates[0].baseRate * nights : 0;
  const extraAdultsTotal = room && adults > 2 ? 
    room.rates[0].extraAdultRate * (adults - 2) * nights : 0;
  const extraChildrenTotal = room && children > 0 ? 
    room.rates[0].extraChildRate * children * nights : 0;
  const servicesTotal = services.length * 50;
  const total = roomTotal + extraAdultsTotal + extraChildrenTotal + servicesTotal;

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-4 sticky top-4">
      <h3 className="text-lg font-semibold">Booking Summary</h3>
      
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Calendar className="w-4 h-4" />
        <span>
          {format(checkIn, 'MMM dd, yyyy')} - {format(checkOut, 'MMM dd, yyyy')}
          {' '}({nights} {nights === 1 ? 'night' : 'nights'})
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Users className="w-4 h-4" />
        <span>
          {adults} Adult{adults !== 1 ? 's' : ''}
          {children > 0 && `, ${children} Child${children !== 1 ? 'ren' : ''}`}
        </span>
      </div>

      {room && (
        <div className="space-y-3 pt-3 border-t">
          <div>
            <h4 className="font-medium mb-1">{room.name}</h4>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Rate per night</span>
              <span className="font-medium">KES {room.rates[0].baseRate.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Room Total ({nights} {nights === 1 ? 'night' : 'nights'})</span>
              <span className="font-medium">KES {roomTotal.toLocaleString()}</span>
            </div>
            
            {extraAdultsTotal > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Extra Adults ({adults - 2})</span>
                <span className="font-medium">KES {extraAdultsTotal.toLocaleString()}</span>
              </div>
            )}
            
            {extraChildrenTotal > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Children ({children})</span>
                <span className="font-medium">KES {extraChildrenTotal.toLocaleString()}</span>
              </div>
            )}

            {services.length > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Extra Services ({services.length})</span>
                <span className="font-medium">KES {servicesTotal.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-3 border-t">
            <span className="font-semibold">Total Amount</span>
            <span className="text-lg font-bold text-amber-600">
              KES {total.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}