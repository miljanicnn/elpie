import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const app = firebase.initializeApp({
	apiKey: process.env.REACT_APP_F_API_KEY,
	authDomain: process.env.REACT_APP_F_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_F_PROJECT_ID,
	storageBucket: process.env.REACT_APP_F_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_F_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_F_APP_ID,
});

export const auth = app.auth();
export default app;
