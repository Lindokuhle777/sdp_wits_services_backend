import express from "express";
import { db } from "../firebase-config.js";
import { getDocs, collection, updateDoc, doc, addDoc, arrayUnion, arrayRemove, getDoc, deleteDoc } from "firebase/firestore";

const router = express.Router();

router.post("/", async (req, res) => {
    const { routeId, driver } = req.body;
    const routesCollectionRef = doc(db, `Buses`, `${routeId}`, `driversOnRoute/${driver}`);
    try {
        await deleteDoc(routesCollectionRef);
        res.send({'onShift': false});
    } catch (e) {
        console.log(e);
        console.log('hi');
        res.send({'onShift': true});
    }
});

export default router;