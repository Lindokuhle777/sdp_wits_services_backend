import express from "express";
import { db } from "../firebase-config.js";
import { uid } from "uid";
import {
  getDocs,
  collection,
  updateDoc,
  doc,
  addDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

const router = express.Router();

router.post("/CreateMenu", async (req, res) => {
  const { data, type } = req.body;

  const ref = doc(db,"Dining",type);

  let temp = {};

  await setDoc(ref,data);
  
  res.send("Done");
});

router.post("/AddDiningHalls", async (req, res)=>{

  const { data } = req.body;

  for (let i = 0; i < data.length; i++) {
    const curr = data[i];
    const ref = doc(db, `Dining/DiningHalls/DiningHallNames`, curr.id);
    await setDoc(ref, {...curr,breakfast:{},lunch:{},dinner:{}});
  }

  res.send("Done");

});

export default router;
