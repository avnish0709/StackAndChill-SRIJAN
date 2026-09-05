import admin from "firebase-admin";

let dbInstance: admin.firestore.Firestore | null = null;
let isInitialized = false;

export function initFirebaseAdmin(): admin.firestore.Firestore | null {
  if (isInitialized) return dbInstance;

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || "legaltech-hackthon";
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }

    if (clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log(`[Firebase Admin] Successfully initialized Firestore for project: ${projectId}`);
    } else {
      // Default app initialization using application default / project ID
      admin.initializeApp({
        projectId,
      });
      console.log(`[Firebase Admin] Initialized with Project ID: ${projectId} (without explicit service account cert)`);
    }

    dbInstance = admin.firestore();
    isInitialized = true;
    return dbInstance;
  } catch (err: any) {
    console.warn(`[Firebase Admin Notice] Could not initialize Firebase Admin SDK: ${err.message || String(err)}`);
    return null;
  }
}

export async function logAnalysisToFirestore(data: any): Promise<boolean> {
  try {
    const db = initFirebaseAdmin();
    if (!db) return false;

    await db.collection("analyses").add({
      ...data,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    return true;
  } catch (err) {
    // Non-blocking log catch
    return false;
  }
}
