import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FlutterwaveService } from '../services/FlutterwaveService';
import { EzeeBookingService } from '../services/EzeeBookingService';
import { CheckCircle, XCircle } from 'lucide-react';

interface PaymentStatus {
  status: 'success' | 'failed' | 'loading';
  message: string;
}

export default function BookingConfirmation() {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    status: 'loading',
    message: 'Verifying payment...'
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const transactionId = params.get('transaction_id');
      const status = params.get('status');
      const bookingData = JSON.parse(sessionStorage.getItem('bookingData') || '{}');

      if (!transactionId || status !== 'successful' || !bookingData) {
        setPaymentStatus({
          status: 'failed',
          message: 'Payment was not successful. Please try again.'
        });
        return;
      }

      try {
        const flutterwaveService = new FlutterwaveService();
        const response = await flutterwaveService.verifyTransaction(transactionId);

        if (response.status === 'successful') {
          try {
            const ezeeBookingService = new EzeeBookingService();
            const booking = await ezeeBookingService.createBooking({
              checkInDate: new Date(bookingData.checkIn),
              checkOutDate: new Date(bookingData.checkOut),
              roomTypeId: bookingData.room.roomTypeId,
              numberOfRooms: 1,
              guestName: bookingData.guestInfo.fullName,
              guestEmail: bookingData.guestInfo.email,
              guestPhone: bookingData.guestInfo.phone,
              guestAddress: bookingData.guestInfo.address,
              guestCity: bookingData.guestInfo.city,
              guestCountry: bookingData.guestInfo.country,
              numberOfAdults: bookingData.adults,
              numberOfChildren: bookingData.children,
              specialRequests: '',
              paymentAmount: response.amount,
              paymentReference: transactionId,
              paymentStatus: 'Confirmed'
            });

            if (booking.success) {
              setPaymentStatus({
                status: 'success',
                message: `Payment successful! Your booking #${booking.bookingId} has been confirmed.`
              });
              // Clear booking data from session storage
              sessionStorage.removeItem('bookingData');
            } else {
              throw new Error('Failed to create booking in eZee');
            }
          } catch (error) {
            console.error('Error creating eZee booking:', error);
            setPaymentStatus({
              status: 'failed',
              message: 'Payment was successful but booking creation failed. Our team will contact you shortly.'
            });
          }
        } else {
          setPaymentStatus({
            status: 'failed',
            message: 'Payment verification failed. Please contact support.'
          });
        }
      } catch (error) {
        console.error('Error:', error);
        setPaymentStatus({
          status: 'failed',
          message: 'An error occurred while verifying payment. Please contact support.'
        });
      }
    };

    verifyPayment();
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        {paymentStatus.status === 'loading' ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{paymentStatus.message}</p>
          </div>
        ) : paymentStatus.status === 'success' ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold mt-4">Booking Confirmed!</h2>
            <p className="mt-2 text-gray-600">{paymentStatus.message}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 w-full bg-amber-600 text-white py-3 rounded-full font-medium hover:bg-amber-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        ) : (
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold mt-4">Payment Failed</h2>
            <p className="mt-2 text-gray-600">{paymentStatus.message}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 w-full bg-amber-600 text-white py-3 rounded-full font-medium hover:bg-amber-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 