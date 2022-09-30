import { cert as firebaseCredential, initializeApp, getApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const firebase = getApps().length
    ? getApp()
    : initializeApp({
        credential: firebaseCredential({
            projectId: process.env.FB_PROJECT_ID,
            clientEmail: process.env.FB_CLIENT_EMAIL,
            privateKey: process.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
    });

const firestore = getFirestore(firebase);

const scenario = firestore.collection("scenario");

export { firestore, scenario }