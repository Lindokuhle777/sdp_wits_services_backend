import express from "express";
import { db } from "../firebase-config.js";
import { getDocs, collection, updateDoc, doc, addDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const router = express.Router();

router.post("/", async (req, res) => {
    const { routeId, driver, position } = req.body;
    const routesCollectionRef = doc(db, `Buses`, `${routeId}`);
    try {
        await updateDoc(routesCollectionRef, {
            driversOnRoute: arrayUnion({
                driver: driver,
                position: position
            })
        });

    } catch (e) {
        console.log(e);
        console.log('hi');
    }
    res.send('done');
});

export default router;