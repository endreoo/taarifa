export class CurrencyService {
  private static KES_TO_USD = 0.0074; // Example fixed rate, you might want to fetch this dynamically
  
  static convertKEStoUSD(amount: number): number {
    return Number((amount * this.KES_TO_USD).toFixed(2));
  }

  static formatUSD(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  static formatKES(amount: number): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  }

  // Optional: Fetch current exchange rate
  static async fetchExchangeRate(): Promise<void> {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/KES');
      const data = await response.json();
      this.KES_TO_USD = data.rates.USD;
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
      // Fallback to default rate
    }
  }
} 