import express from "express";
import { db } from "../firebase-config.js";
import { getDocs, collection, updateDoc, doc, addDoc, arrayUnion, arrayRemove, setDoc, deleteDoc } from "firebase/firestore";

const router = express.Router();

router.post("/", async (req, res) => {
    const { routeId, driver, position } = req.body;
    console.log('hi');
    const routesCollectionRef = doc(db, `Buses`, `${routeId}`, `driversOnRoute/${driver}`);
    try {
        await setDoc(routesCollectionRef,{
            driver: driver,
            position: position,
        });

        res.send({'onShift': true});
    } catch (e) {
        console.log(e);
        console.log('hi');
        res.send({'onShift': false});
    }
});

export default router;