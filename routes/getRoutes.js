import express from "express";
import { db } from "../firebase-config.js";
import { getDocs, collection } from "firebase/firestore";

const router = express.Router();

router.get("/", async (req, res) => {
    const usersCollectionRef = collection(db, "Buses/");
    try {
        const data = await getDocs(usersCollectionRef);
        var response = [];
        if (data === null) {
        } else {
            data.forEach((doc) => {
                response.push(doc.data());
            });
            res.send(response);
        }

        return data;
    } catch (e) {
        console.log(e);
    }
});

export default router;