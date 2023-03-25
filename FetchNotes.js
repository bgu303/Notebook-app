import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
} from "firebase/firestore";
import firebaseConfig from './FirebaseConfig';
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const notesCollectionRef = collection(db, "notedata");

const fetchNotes = async (userId, setNotes) => {
    const notesQuery = query(notesCollectionRef, where("userId", "==", userId))
    try {
        const notesSnapshot = await getDocs(notesQuery);
        const notesData = notesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))
        setNotes(notesData)
    } catch (error) {
        console.log("error", error)
    }
}

export default fetchNotes