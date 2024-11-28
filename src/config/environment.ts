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
  }
}; 