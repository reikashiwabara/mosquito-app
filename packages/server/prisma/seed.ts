import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('武器データをシード中...');

  // 既存の武器を削除
  await prisma.weapon.deleteMany({});

  // デフォルト武器を作成
  const weapons = [
    {
      type: 'hand',
      name: '素手',
      description: '基本的な武器。確実にダメージを与えます。',
      icon: '/hand.svg',
      damage: 1,
      isUnlocked: true,
    },
    {
      type: 'weapon',
      name: 'ハエたたき',
      description: '伝統的な蚊退治道具。威力が高めです。',
      icon: '/weapon.svg',
      damage: 2,
      isUnlocked: true,
    },
    {
      type: 'spray',
      name: '殺虫スプレー',
      description: '範囲攻撃が可能。遠距離から安全に攻撃できます。',
      icon: '/spray.svg',
      damage: 3,
      isUnlocked: true,
    },
    {
      type: 'electric_grid',
      name: '電撃殺虫器',
      description: '最強の武器。電気の力で確実に仕留めます。',
      icon: '/electric_grid.svg',
      damage: 5,
      isUnlocked: false, // 初期は解放されていない
    },
  ];

  for (const weapon of weapons) {
    await prisma.weapon.create({
      data: weapon,
    });
  }

  console.log('武器データのシードが完了しました！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
