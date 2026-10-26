export type Gift = {
  id: string;
  name: string;
  emoji: string;
  budget?: string;
  category: 'скалы' | 'компы' | 'книги' | 'музыка';
  description: string;
  link?: string;
  image?: string;
  imageAlt?: string;
};

// Настоящий вишлист. Не меняй id уже забронированного подарка:
// Firestore связывает бронь с идентификатором.
export const gifts: Gift[] = [
  {
    id: 'macbook-surf-vinyl',
    name: 'Виниловая наклейка на MacBook Pro 14″',
    emoji: '🌊',
    category: 'компы',
    description:
      'Хочу крышку ноута в сине-бирюзовом серф-вайбе: океан, волны, красота. Если получится прихерачить прямо ЭТУ фотку на MacBook — уровень восторга: кот, впервые увидевший тунца. Пример по ссылке; дизайн можно и повеселее.',
    link: 'https://www.ozon.ru/product/vinilovoe-pokrytie-nakleyka-dlya-macbook-pro-14-m1-m4-kryshka-zadnyaya-chast-502006751/',
    image: 'images/surf-wave.webp',
    imageAlt: 'Сине-бирюзовая морская волна с крошечным сёрфером — референс для наклейки на ноутбук',
  },
  {
    id: 'belay-locking-carabiner',
    name: 'Страховочный карабин с муфтой',
    emoji: '🧗',
    category: 'скалы',
    description:
      'C.A.M.P Core Lock — пример, но другой нормальный страховочный карабин тоже зайдёт. Главное, чтобы держал мою тушку, а не только ключи от квартиры. Карабин-брелок — мимо кассы.',
    link: 'https://sport-marafon.ru/catalog/karabiny/karabin-c-a-m-p-core-lock-orange/',
  },
  {
    id: 'awesome-fiction-book',
    name: 'Охрененная художественная книжка',
    emoji: '📚',
    category: 'книги',
    description:
      'Подарите художку, которую сами считаете охрененной. Роман, фантастика, что угодно — лишь бы крышу снесло. Никаких «как стать богатым и успешным за 12 минут»: лучше уж я съем магнезию.',
  },
  {
    id: 'concert-ticket',
    name: 'Билетик на концерт',
    emoji: '🎸',
    category: 'музыка',
    description:
      'КДИМБ / Рубеж Веков / Ежемесячные / Дельфин / Кравц. Один из этого прекрасного набора — и я иду орать любимые песни так, будто завтра отключат электричество.',
  },
];
