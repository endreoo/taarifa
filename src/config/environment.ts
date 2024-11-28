const isDev = import.meta.env.MODE === 'development';

export const config = {
  bookingEngineUrl: 'YOUR_BOOKING_ENGINE_URL',
  apiBaseUrl: isDev ? 'http://localhost:3000' : 'https://your-api-domain.com',
  ezeeApi: {
    hotelCode: '18262',
    authCode: '26500005674303ce8a-0d0c-11eb-9'
  },
  db: {
    host: 'localhost',
    user: 'scraper',
    password: 'Jk8$Qe3#Zp2!BnL9',
    database: 'properties'
  },
  flutterwave: {
    publicKey: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK-6b9daa235a21102ba3c9a777f7c7babc-X',
    secretKey: import.meta.env.VITE_FLUTTERWAVE_SECRET_KEY || 'FLWSECK-61bc6a436607accffe16c42e4073d374-19371e7ab01vt-X',
    encryptionKey: import.meta.env.VITE_FLUTTERWAVE_ENCRYPTION_KEY || '61bc6a436607989f408625be'
  }
}; 