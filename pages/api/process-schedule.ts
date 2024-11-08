import { NextApiRequest, NextApiResponse } from 'next';
import { processSchedule } from '../../utils/scheduleProcessor';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const result = await processSchedule(req);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error processing schedule:', error);
      res.status(500).json({ error: 'An error occurred while processing the schedule.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}