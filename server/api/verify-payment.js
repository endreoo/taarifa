import { config } from '../../src/config/environment';
export default async function handler(req) {
    const transactionId = req.url.split('/').pop();
    if (!transactionId) {
        return new Response(JSON.stringify({ error: 'Transaction ID is required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    try {
        const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
            headers: {
                Authorization: `Bearer ${config.flutterwave.secretKey}`,
            },
        });
        if (!response.ok) {
            throw new Error('Payment verification failed');
        }
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    catch (error) {
        console.error('Error verifying payment:', error);
        return new Response(JSON.stringify({ error: 'Failed to verify payment' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
