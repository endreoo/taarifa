const isDev = typeof process !== 'undefined' 
  ? process.env.NODE_ENV === 'development'
  : import.meta.env?.MODE === 'development';

export const config = {
  bookingEngineUrl: isDev ? 'http://localhost:5170' : 'https://taarifa.hotelonline.co',
  apiBaseUrl: isDev ? 'http://localhost:5170' : 'https://taarifa.hotelonline.co',
  ezeeApi: {
    hotelCode: '18262',
    authCode: '26500005674303ce8a-0d0c-11eb-9'
  },
  db: {
    host: process.env?.DB_HOST || 'localhost',
    user: process.env?.DB_USER || 'scraper',
    password: process.env?.DB_PASSWORD || 'Jk8$Qe3#Zp2!BnL9',
    database: process.env?.DB_NAME || 'properties'
  },
  flutterwave: {
    publicKey: process.env?.FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK-6b9daa235a21102ba3c9a777f7c7babc-X',
    secretKey: process.env?.FLUTTERWAVE_SECRET_KEY || 'FLWSECK-61bc6a436607accffe16c42e4073d374-19371e7ab01vt-X',
    encryptionKey: process.env?.FLUTTERWAVE_ENCRYPTION_KEY || '61bc6a436607989f408625be'
  }
};
