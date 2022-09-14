import express from "express";
import { db } from "../firebase-config.js";
import { getDocs, collection, updateDoc, doc, addDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";

const router = express.Router();

router.post("/", async (req, res) => {
    const { routeId, driver } = req.body;
    const routesCollectionRef = doc(db, `Buses`, `${routeId}`);
    try {
        const docRef = doc(db, 'Buses', `${routeId}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            for (var i = 0; i < docSnap.data().driversOnRoute.length; i++) {
                if (docSnap.data().driversOnRoute[i].driver === `${driver}`) {
                    await updateDoc(routesCollectionRef, {
                        driversOnRoute: arrayRemove({
                            driver: docSnap.data().driversOnRoute[i].driver,
                            position: docSnap.data().driversOnRoute[i].position
                        })
                    });
                }
            }
        }

    } catch (e) {
        console.log(e);
        console.log('hi');
    }
    res.send('done');
});

export default router;