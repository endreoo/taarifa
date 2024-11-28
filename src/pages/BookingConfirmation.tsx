import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FlutterwaveService } from '../services/FlutterwaveService';
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

      if (!transactionId || status !== 'successful') {
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
          setPaymentStatus({
            status: 'success',
            message: 'Payment successful! Your booking has been confirmed.'
          });
        } else {
          setPaymentStatus({
            status: 'failed',
            message: 'Payment verification failed. Please contact support.'
          });
        }
      } catch (error) {
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