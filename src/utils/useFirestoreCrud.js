import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const useFirestoreCrud = (collectionName) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const colRef = collection(db, collectionName);

    const fetchData = async () => {
        setLoading(true);
        const snapshot = await getDocs(colRef);
        const docs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setData(docs);
        setLoading(false);
    };

    const create = async (item) => {
        const docRef = await addDoc(colRef, item);
        await fetchData();
        return docRef;
    };

    const update = async (id, item) => {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, item);
        await fetchData();
    };

    const remove = async (id) => {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
        await fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, create, update, remove };
};

export default useFirestoreCrud;
