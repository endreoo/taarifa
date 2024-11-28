import { config } from '../config/environment';

interface PaymentData {
  amount: number;
  currency: string;
  email: string;
  phone_number: string;
  name: string;
  tx_ref: string;
  redirect_url: string;
}

interface FlutterwaveConfig {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options: string;
  redirect_url?: string;
  customer: {
    email: string;
    name: string;
  };
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
  callback?: (response: FlutterwaveResponse) => void;
  onclose?: () => void;
}

interface FlutterwaveResponse {
  transaction_id?: string;
  tx_ref: string;
  flw_ref: string;
  status: string;
  amount: number;
  currency: string;
  customer: {
    email: string;
    name: string;
  };
}

declare global {
  interface Window {
    FlutterwaveCheckout: (config: FlutterwaveConfig) => void;
  }
}

export class FlutterwaveService {
  private publicKey: string;

  constructor() {
    this.publicKey = config.flutterwave.publicKey;
    console.log('Initialized FlutterwaveService with public key:', this.publicKey);
  }

  generateTransactionRef(): string {
    const ref = `TRF-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    console.log('Generated transaction reference:', ref);
    return ref;
  }

  async initializePayment({
    amount,
    currency,
    email,
    phone_number,
    name,
    tx_ref
  }: PaymentData): Promise<void> {
    console.group('Flutterwave Payment Initialization');

    // Check if we're on HTTPS
    if (!window.location.protocol.includes('https')) {
      console.warn('Flutterwave requires HTTPS. Current protocol:', window.location.protocol);
      throw new Error('Flutterwave payments require HTTPS. Please use a secure connection.');
    }

    try {
      // Load Flutterwave script if not already loaded
      if (typeof window.FlutterwaveCheckout !== 'function') {
        console.log('Loading Flutterwave script...');
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.flutterwave.com/v3.js';
          script.async = true;
          script.onload = () => {
            console.log('Flutterwave script loaded successfully');
            resolve();
          };
          script.onerror = () => {
            reject(new Error('Failed to load Flutterwave script'));
          };
          document.body.appendChild(script);
        });

        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const paymentConfig: FlutterwaveConfig = {
        public_key: this.publicKey,
        tx_ref: tx_ref.toString(),
        amount: Number(amount),
        currency: "KES",
        payment_options: "card,mpesa",
        redirect_url: "https://taarifa.hotelonline.co/payment/callback",
        customer: {
          email: email.toLowerCase(),
          name: name.trim()
        },
        customizations: {
          title: "Taarifa Suites",
          description: "Room Booking",
          logo: "https://taarifa.hotelonline.co/logo.png"
        },
        callback: function(response: FlutterwaveResponse) {
          console.log('Payment complete!', response);
        },
        onclose: function() {
          console.log('Payment modal closed');
        }
      };

      console.log('Payment configuration:', JSON.stringify(paymentConfig, null, 2));

      if (typeof window.FlutterwaveCheckout !== 'function') {
        throw new Error('FlutterwaveCheckout not available');
      }

      window.FlutterwaveCheckout(paymentConfig);
      console.log('Payment modal opened');

    } catch (error) {
      console.error('Payment initialization error:', error);
      throw error;
    } finally {
      console.groupEnd();
    }
  }

  // Verify transaction status
  async verifyTransaction(transactionId: string): Promise<any> {
    console.group('Flutterwave Transaction Verification');
    console.log('Verifying transaction:', transactionId);

    try {
      const response = await fetch(`${config.apiBaseUrl}/api/verify-payment/${transactionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Verification failed:', response.status, response.statusText);
        throw new Error('Payment verification failed');
      }

      const data = await response.json();
      console.log('Verification response:', data);
      return data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    } finally {
      console.groupEnd();
    }
  }
} 