import express from "express";
import { db } from "../firebase-config.js";
import { getDocs, collection, updateDoc, doc, addDoc, arrayUnion, arrayRemove, getDoc, deleteDoc } from "firebase/firestore";

const router = express.Router();

router.post("/", async (req, res) => {
    const { routeId, driver } = req.body;
    const routesCollectionRef = doc(db, `Buses`, `${routeId}`);

    await updateDoc(routesCollectionRef, {
        driversOnRoute: arrayRemove(`${driver}`)
    });

    const docSnap = await getDoc(routesCollectionRef);

    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data().driversOnRoute);
        if (docSnap.data().driversOnRoute.length === 0) {
            await updateDoc(routesCollectionRef, {
                status: 'OFF',
                position: null,
            });
        }
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }

    // try {
    //     await deleteDoc(routesCollectionRef);
    //     res.send({'onShift': false});
    // } catch (e) {
    //     console.log(e);
    //     console.log('hi');
    //     res.send({'onShift': true});
    // }
});

export default router;