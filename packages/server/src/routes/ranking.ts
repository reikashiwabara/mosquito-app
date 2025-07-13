import { Router } from 'express';
import { PrismaClient } from '../../generated/prisma';

const router = Router();
const prisma = new PrismaClient();

router.get('/ranking', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        kills: true,
        deaths: true,
        title: true,
        selectedWeaponId: true,
        selectedWeapon: {
          select: {
            name: true,
            type: true,
          },
        },
      },
    });

    const usersWithKillRate = users.map(u => ({
      ...u,
      killRate: u.deaths === 0 ? u.kills : u.kills / u.deaths,
      selectedWeapon: u.selectedWeapon?.name || u.selectedWeapon?.type || 'なし',
    }));

    // 4つのランキングを作成
    const killRateRanking = [...usersWithKillRate]
      .sort((a, b) => b.killRate - a.killRate)
      .slice(0, 10);

    const killsRanking = [...usersWithKillRate]
      .sort((a, b) => b.kills - a.kills)
      .slice(0, 10);

    const deathsRanking = [...usersWithKillRate]
      .sort((a, b) => a.deaths - b.deaths) // デス数は少ない順
      .slice(0, 10);

    // 武器別ランキング（最も多く使われている武器順）
    const weaponUsage = usersWithKillRate.reduce((acc, user) => {
      const weapon = user.selectedWeapon;
      if (weapon && weapon !== 'なし') {
        acc[weapon] = (acc[weapon] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const weaponRanking = Object.entries(weaponUsage)
      .map(([weapon, count]) => ({
        weapon,
        userCount: count,
        topUsers: usersWithKillRate
          .filter(u => u.selectedWeapon === weapon)
          .sort((a, b) => b.killRate - a.killRate)
          .slice(0, 3),
      }))
      .sort((a, b) => b.userCount - a.userCount)
      .slice(0, 10);

    res.json({
      killRate: killRateRanking,
      kills: killsRanking,
      deaths: deathsRanking,
      weapons: weaponRanking,
    });
  } catch (e) {
    console.error('Ranking fetch error:', e);
    res.status(500).json({ error: 'Failed to fetch ranking' });
  }
});

export default router;