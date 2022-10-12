import express from "express";
import { db } from "../../firebase-config.js";
import {
  getDoc,
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

router.post("/StartShift", async (req, res) => {
  let info = req.body.info;
  info = { ...info, status: "onDuty", taken: true };

  const ref = doc(db, "CampusControl", info.campusName);
  const workingRef = doc(db, "CampusControl", "Working");

  await updateDoc(workingRef, {
    unavailableCars: arrayUnion(`${info.numPlate}`),
    takenCampus: arrayUnion(`${info.campusName}`),
  });

  await updateDoc(ref, { ...info });
    res.send({ status: "success" });
});

router.post("/EndShift", async (req, res) => {
  const { campusName,numPlate } = req.body;

  const ref = doc(db, "CampusControl", campusName);
  const workingRef = doc(db, "CampusControl", "Working");

  await updateDoc(workingRef, {
        unavailableCars: arrayRemove(`${numPlate}`),
        takenCampus: arrayRemove(`${campusName}`),
      });
  await updateDoc(ref, { taken: false });
  res.send({ status: "success" });
});

router.get("/GetVehicles", async (req, res) => {
  let unavailableCars = [];
  const ref = doc(db, "CampusControl", "Working");
  const snap = await getDoc(ref);

  if (snap.exists()) {
    let temp = snap.data().unavailableCars;
    if (temp !== undefined) {
      unavailableCars = [...temp];
    }
  }

  const vecRef = doc(db, "CampusControl", "Original");

  const vecs = await getDoc(vecRef);

  const out = vecs
    .data()
    .vehicles.filter((item) => !unavailableCars.includes(item.numPlate));

  res.send({vehicles:out,status:"success"});
});

router.get("/GetCampus", async (req, res) => {
    let takenCampus = [];
    const ref = doc(db, "CampusControl", "Working");
    const snap = await getDoc(ref);
  
    if (snap.exists()) {
      let temp = snap.data().takenCampus;
      if (temp !== undefined) {
        takenCampus = [...temp];
      }
    }
  
    const campusRef = doc(db, "CampusControl", "Original");
  
    const campusSnap = await getDoc(campusRef);
  
    const out = campusSnap
      .data()
      .campus.filter((item) => !takenCampus.includes(item));
  
    res.send({campus:out,status:"success"});
  });



export default router;
