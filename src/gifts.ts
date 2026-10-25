export type Gift = {
  id: string;
  name: string;
  emoji: string;
  budget: string;
  category: 'скалы' | 'кайт' | 'сёрф' | 'компы' | 'котики' | 'горы';
  description: string;
  link?: string;
};

// ДЕМО-ПОЖЕЛАНИЯ. Подставь сюда свои реальные подарки.
// Не меняй id уже забронированного подарка: бронь привязана к нему!
export const gifts: Gift[] = [
  {
    id: 'chalkbag',
    name: 'Мешок магнезии уровня «я легенда»',
    emoji: '🧗‍♂️',
    budget: '1–4 тыс. ₽',
    category: 'скалы',
    description: 'Главное — чтобы выглядел нелепо. Пользоваться буду серьёзно.',
  },
  {
    id: 'climbing-shoes',
    name: 'Скалолазные туфли',
    emoji: '🧗',
    budget: '10–25 тыс. ₽',
    category: 'скалы',
    description: 'Размер и модель обязательно согласовать. Не покупай вслепую!',
  },
  {
    id: 'kite-day',
    name: 'День с кайтом',
    emoji: '🪁',
    budget: '5–15 тыс. ₽',
    category: 'кайт',
    description: 'Хочу быть воздушным змеем. Но с ногами.',
  },
  {
    id: 'surf-thing',
    name: 'Сёрферская приблуда',
    emoji: '🏄',
    budget: '1–10 тыс. ₽',
    category: 'сёрф',
    description: 'Штука, которая делает из меня красивого на волнах.',
  },
  {
    id: 'mechanical-keyboard',
    name: 'Клавиатура для важных багов',
    emoji: '⌨️',
    budget: '5–20 тыс. ₽',
    category: 'компы',
    description: 'Нужно больше тактильного восторга и неприличных щелчков.',
  },
  {
    id: 'monitor-arm',
    name: 'Рука для монитора',
    emoji: '🖥️',
    budget: '3–12 тыс. ₽',
    category: 'компы',
    description: 'Идеальное логово разработчика само себя не построит.',
  },
  {
    id: 'cat-mug',
    name: 'Очень глупая кружка с котёнком',
    emoji: '🐈',
    budget: '500–3000 ₽',
    category: 'котики',
    description: 'Прям чтобы морально больно было смотреть. Мне понравится.',
  },
  {
    id: 'mountain-goodies',
    name: 'Горный сюрприз',
    emoji: '🏔️',
    budget: '2–10 тыс. ₽',
    category: 'горы',
    description: 'Налобник, бафф, гермомешок или любая полезная приблуда.',
  },
];
