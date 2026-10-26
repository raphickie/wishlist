import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, type User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';

// Firebase's web app configuration is public and safe to embed in a browser bundle.
// Database writes remain protected by the Firestore Security Rules.
const firebaseConfig = {
  apiKey: 'AIzaSyDoapoCceN_cEQBzE6-EUAMtzntNEpETTM',
  authDomain: 'wishlist-88734.firebaseapp.com',
  projectId: 'wishlist-88734',
  storageBucket: 'wishlist-88734.firebasestorage.app',
  messagingSenderId: '1097503044400',
  appId: '1:1097503044400:web:c173b286e23fd44390cef5',
};

export const firebaseEnabled = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId,
);

const app = firebaseEnabled ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
let userPromise: Promise<User> | null = null;

export type Reservation = {
  uid: string;
  createdAt?: unknown;
};

async function signedInUser(): Promise<User> {
  if (!auth) {
    throw new Error('Firebase ещё не настроен');
  }
  if (!userPromise) {
    userPromise = (async () => {
      await auth.authStateReady();
      if (auth.currentUser) return auth.currentUser;
      return (await signInAnonymously(auth)).user;
    })().catch((error: unknown) => {
      userPromise = null;
      throw error;
    });
  }
  return userPromise;
}

export async function getMyUid(): Promise<string> {
  return (await signedInUser()).uid;
}

export function watchReservations(
  onChange: (items: Map<string, Reservation>) => void,
  onError: (message: string) => void,
): () => void {
  if (!db) return () => undefined;

  return onSnapshot(
    collection(db, 'reservations'),
    (snapshot) => {
      const items = new Map<string, Reservation>();
      snapshot.forEach((document) => {
        items.set(document.id, document.data() as Reservation);
      });
      onChange(items);
    },
    (error) => onError(error.message),
  );
}

export async function bookGift(giftId: string): Promise<string> {
  if (!db) throw new Error('Firebase ещё не настроен');
  const user = await signedInUser();
  const ref = doc(db, 'reservations', giftId);

  // A server-side transaction rejects concurrent reservations.
  await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(ref);
    if (existing.exists()) {
      throw new Error('Кто-то уже забронировал этот подарок 🐾');
    }
    transaction.set(ref, {
      uid: user.uid,
      createdAt: serverTimestamp(),
    });
  });

  return user.uid;
}

export async function cancelBooking(giftId: string, ownerUid: string): Promise<void> {
  if (!db) throw new Error('Firebase ещё не настроен');
  const user = await signedInUser();
  if (user.uid !== ownerUid) throw new Error('Чужую бронь отменить нельзя');
  await deleteDoc(doc(db, 'reservations', giftId));
}

