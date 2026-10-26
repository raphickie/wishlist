import { useEffect, useMemo, useState } from 'react';
import { bookGift, cancelBooking, firebaseEnabled, getMyUid, watchReservations, type Reservation } from './firebase';
import { gifts } from './gifts';


type Filter = 'all' | 'free' | 'booked';
type Status = 'demo' | 'loading' | 'ready' | 'error';
const asset = (name: string) => `${import.meta.env.BASE_URL}${name}`;

const broadcasts = [
  'ВНИМАНИЕ: КОТЫ ЗАХВАТИЛИ ИНТЕРНЕТ',
  'СКАЛЫ ЖДУТ • РУКИ СТРАДАЮТ',
  'ВОЛНА ЕСТЬ — МОЗГОВ НЕТ',
  'КОМПЬЮТЕР СКАЗАЛ МЯУ • СОБАКИ В ШОКЕ',
];

export default function App() {
  const [filter, setFilter] = useState<Filter>('free');
  const [status, setStatus] = useState<Status>(firebaseEnabled ? 'loading' : 'demo');
  const [reservations, setReservations] = useState<Map<string, Reservation>>(new Map());
  const [myUid, setMyUid] = useState('');
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [broadcast, setBroadcast] = useState(0);

  useEffect(() => {
    if (!firebaseEnabled) return;
    const unsubscribe = watchReservations(
      (data) => {
        setReservations(data);
        setStatus('ready');
      },
      (error) => {
        setStatus('error');
        setMessage(`Firestore: ${error}`);
      },
    );
    getMyUid().then(setMyUid).catch((error: unknown) => {
      setMessage(`Анонимный вход не удался: ${String(error)}`);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBroadcast((n) => (n + 1) % broadcasts.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, []);

  // Gifts without booking stay visible to every guest, regardless of old reservations.
  const reservedCount = gifts.filter((gift) => !gift.noBooking && reservations.has(gift.id)).length;
  const availableCount = gifts.length - reservedCount;

  const visibleGifts = useMemo(() => {
    return gifts.filter((gift) => {
      if (gift.noBooking) return filter !== 'booked';
      if (filter === 'free') return !reservations.has(gift.id);
      if (filter === 'booked') return reservations.has(gift.id);
      return true;
    });
  }, [filter, reservations]);

  async function reserve(id: string) {
    if (status !== 'ready' || pendingId) return;
    setPendingId(id);
    setMessage('');
    try {
      const uid = await bookGift(id);
      setMyUid(uid);
      setMessage('МЯУ! Подарок забронирован. Остальным — лапки 🐈');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не удалось забронировать');
    } finally {
      setPendingId(null);
    }
  }

  async function unreserve(id: string, uid: string) {
    if (status !== 'ready' || pendingId) return;
    setPendingId(id);
    setMessage('');
    try {
      await cancelBooking(id, uid);
      setMessage('Подарок снова свободен. Кот доволен.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не удалось снять бронь');
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="site-shell">
      <div className="top-ribbon">
        <span>🐈 КОТОСТРОФИЧЕСКИЙ ВИШЛИСТ 🧗 🐈‍⬛ 🏔️ 🪁 🏄 💾 🐈</span>
      </div>

      <header className="hero">
        <div className="hero-copy">
          <h1>ХОЧУ<span>!</span><br />НЕ МОГУ<span>!</span></h1>
          <p className="hero-tagline">
            Подарки, скалы, котята, ветер, океан и немного компьютерного позора.
          </p>
          <div className="flashing-label">🐾 WISH.LIST.EXE ВЫПОЛНЯЕТСЯ 🐾</div>
          <p className="broadcast" aria-live="polite">{broadcasts[broadcast]}</p>
        </div>
        <div className="hero-art" aria-label="Коты на скалах и прочая дичь">
          <img className="sticker sticker-kitty" src={asset('sticker-cat.svg')} alt="Котёнок-скалолаз в каске" />
          <img className="sticker sticker-mountain" src={asset('sticker-mountain.svg')} alt="Горы и альпинист" />
          <img className="sticker sticker-surf" src={asset('sticker-surf.svg')} alt="Котик на доске для сёрфинга" />
          <img className="sticker sticker-kite" src={asset('sticker-kite.svg')} alt="Воздушный змей" />
          <img className="sticker sticker-computer" src={asset('sticker-computer.svg')} alt="Пиксельный компьютер" />
          <span className="orbit-label">ШАНС НА МЯУ: 100%</span>
        </div>
      </header>

      <section className="dashboard" aria-label="Статистика вишлиста">
        <div className="counter counter-yellow"><strong>{gifts.length}</strong><span>всего хотелок</span></div>
        <div className="counter counter-cyan"><strong>{status === 'loading' ? '…' : availableCount}</strong><span>можно урвать</span></div>
        <div className="counter counter-pink"><strong>{status === 'loading' ? '…' : reservedCount}</strong><span>уже застолбили</span></div>
        <div className="cat-base">
          <span className={`status-dot status-${status}`} />
          {status === 'ready' && 'CATBASE ONLINE'}
          {status === 'loading' && 'CATBASE ЗАГРУЖАЕТСЯ'}
          {status === 'error' && 'CATBASE ERROR'}
          {status === 'demo' && 'CATBASE НЕ ПОДКЛЮЧЕНА'}
        </div>
      </section>

      {status === 'demo' && (
        <div className="system-note" role="status">
          🚧 <strong>CATBASE пока не подключена.</strong> Настрой Firebase по README репозитория, чтобы кнопки заработали.
        </div>
      )}

      {status === 'error' && (
        <div className="system-note" role="alert">
          🙀 CATBASE недоступна. Попробуй перезагрузить страницу.
        </div>
      )}


      {message && <div className="toast-message" role="status">{message}</div>}

      <main>
        <div className="section-heading">
          <div>
            <span className="glitchy-stars">✦ ✳ ✦</span>
            <h2>ЛУТБOКС<br /><span>ЖЕЛАНИЙ</span></h2>
            <p>Кот одобряет твой выбор. Наверное.</p>
          </div>
          <div className="filters" aria-label="Фильтр подарков">
            <button aria-pressed={filter === 'free'} className={filter === 'free' ? 'chosen' : ''} onClick={() => setFilter('free')}>СВОБОДНО</button>
            <button aria-pressed={filter === 'booked'} className={filter === 'booked' ? 'chosen' : ''} onClick={() => setFilter('booked')}>ЗАНЯТО</button>
            <button aria-pressed={filter === 'all'} className={filter === 'all' ? 'chosen' : ''} onClick={() => setFilter('all')}>ВСЁ</button>
          </div>
        </div>

        <div className="gift-grid">
          {visibleGifts.map((gift, index) => {
            const reservation = reservations.get(gift.id);
            const isBooked = !gift.noBooking && Boolean(reservation);
            const isMine = Boolean(reservation && myUid && reservation.uid === myUid);
            const disabled = pendingId !== null || status !== 'ready';

            return (
              <article className={`gift-card theme-${gift.category} ${isBooked ? 'gift-taken' : ''}`} key={gift.id}>
                <div className="gift-topline">
                  <span className="gift-serial">LOOT #{String(index + 1).padStart(2, '0')}</span>
                  <span className="gift-category">{gift.category.toUpperCase()}</span>
                  {gift.noBooking && <span className="repeat-badge">∞ БЕЗ БРОНИ</span>}
                </div>
                {gift.image ? (
                  <div className="gift-photo-wrap">
                    <img className="gift-photo" src={asset(gift.image)} alt={gift.imageAlt ?? gift.name} loading="lazy" />
                    <span className="photo-stamp">ВОТ ЭТУ ВОЛНУ НА НОУТ 🤌</span>
                  </div>
                ) : (
                  <div className="gift-emoji" aria-hidden="true">{gift.emoji}</div>
                )}
                <h3>{gift.name}</h3>
                <p className="gift-description">{gift.description}</p>
                <div className="gift-bottom">
                  {gift.budget && <span className="budget">💸 {gift.budget}</span>}
                  {gift.link && <a href={gift.link} target="_blank" rel="noopener noreferrer">ПОДРОБНЕЕ ↗</a>}
                </div>
                {gift.noBooking ? (
                  <div className="reservation-footer">
                    <div className="repeat-stamp">😼 БРОНИРОВАТЬ НЕ НАДО. ПРОСТО ПОКУПАЙ И ДАРИ!</div>
                    <div className="taken-hint">ЧЕМ БОЛЬШЕ — ТЕМ ЛУЧШЕ. ♾️</div>
                  </div>                ) : isBooked ? (
                  <div className="reservation-footer">
                    <div className="reserved-stamp">⛔ УЖЕ ЗАБРОНИРОВАНО</div>
                    {isMine ? (
                      <button className="cancel-button" disabled={disabled} onClick={() => unreserve(gift.id, reservation!.uid)}>
                        {pendingId === gift.id ? 'ОТМЕНЯЕМ…' : 'ЭТО МОЯ БРОНЬ — ОТМЕНИТЬ'}
                      </button>
                    ) : <div className="taken-hint">Чужая добыча. Трогать лапками нельзя.</div>}
                  </div>
                ) : (
                  <button
                    className="book-button"
                    disabled={disabled}
                    onClick={() => reserve(gift.id)}
                  >
                    {pendingId === gift.id ? 'КОТ ДУМАЕТ…' : status === 'ready' ? 'ЗАБРОНИРОВАТЬ 🐾' : 'ЖДЁМ CATBASE…'}
                  </button>
                )}
              </article>
            );
          })}
        </div>

        {visibleGifts.length === 0 && (
          <div className="empty-state">В ЭТОЙ КАТЕГОРИИ ПУСТО 😿<br />ПЕРЕКЛЮЧИ ФИЛЬТР, КОТ.</div>
        )}

        <aside className="instruction">
          <div className="instruction-emoji">😾</div>
          <div>
            <h2>ИНСТРУКЦИЯ ДЛЯ СЛОЖНЫХ ЛЮДЕЙ</h2>
            <p><strong>1.</strong> Выбираешь подарок. <strong>2.</strong> Бронируешь. <strong>3.</strong> Остальные видят «занято» и не дарят дубль. <strong>4.</strong> Передумал — снимаешь свою бронь.</p>
            <small>Без регистрации. Бронь привязана к анонимной сессии браузера; при очистке данных браузера отменить её самостоятельно может не получиться.</small>
          </div>
        </aside>
      </main>

      <footer>
        <div>СДЕЛАНО С 💔 И СОМНИТЕЛЬНЫМ ЧУВСТВОМ ПРЕКРАСНОГО</div>
        <div>🐈 + 🧗 + 🪁 + 🏄 + 💻 = ???</div>
      </footer>
    </div>
  );
}
