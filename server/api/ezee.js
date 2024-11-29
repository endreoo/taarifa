import axios from 'axios';
export default async function handler(req, res) {
    try {
        const ezeeUrl = req.headers['x-ezee-url'];
        const hotelCode = req.headers['x-ezee-hotel'];
        const authCode = req.headers['x-ezee-auth'];
        if (!ezeeUrl || !hotelCode || !authCode) {
            return res.status(400).json({
                error: 'Missing required headers',
                details: {
                    ezeeUrl: !ezeeUrl,
                    hotelCode: !hotelCode,
                    authCode: !authCode
                }
            });
        }
        const response = await axios.post(ezeeUrl, req.body, {
            headers: {
                'Content-Type': 'application/xml',
                'Accept': 'application/xml'
            }
        });
        res.status(200).send(response.data);
    }
    catch (error) {
        console.error('eZee API Error:', error);
        res.status(500).json({ error: 'Failed to fetch from eZee API' });
    }
}
