import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Determine if Firebase config is fully populated with actual cloud credentials
export const isFirebaseEnabled: boolean = Boolean(
  firebaseConfig.apiKey && 
  !firebaseConfig.apiKey.includes("YOUR_API_KEY_HERE") && 
  firebaseConfig.projectId && 
  !firebaseConfig.projectId.includes("your-app")
);

// Standard Firebase Applet SDK instances initialization
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate Connection to Firestore on startup as mandated by Firebase Skill
export async function testConnection(): Promise<boolean> {
  if (!isFirebaseEnabled) {
    console.log("Firebase is running with local state synchronization until cloud credentials are active.");
    return false;
  }
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firestore connection verified successfully with server.");
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration: client appears offline.");
    } else {
      console.info("Firestore connection probe executed:", error instanceof Error ? error.message : error);
    }
    return false;
  }
}

// Run test connection asynchronously on boot
testConnection();

export { signInWithPopup, signOut };
export default app;

