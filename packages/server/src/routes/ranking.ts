import { Router } from 'express';
import { prisma } from '../prismaClient';

const router = Router();

router.get('/ranking', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        kills: true,
        deaths: true,
      },
    });

    const ranking = users
      .map(u => ({
        ...u,
        killRate: u.deaths === 0 ? u.kills : u.kills / u.deaths,
      }))
      .sort((a, b) => b.killRate - a.killRate);

    res.json(ranking);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch ranking' });
  }
});

export default router;