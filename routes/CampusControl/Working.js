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

  const ref = doc(db, "CampusControl", "Working");

  await updateDoc(ref, {
    unavailableCars: arrayUnion(`${info.numPlate}`),
  });

  if (info.campusName === "Main Campus") {
    await updateDoc(ref, { mainCampus: info });
    res.send({ status: "success" });
  } else if (info.campusName === "Education Campus") {
    await updateDoc(ref, { educationCampus: info });
    res.send({ status: "success" });
  } else if (info.campusName === "Business School") {
    await updateDoc(ref, { businessSchool: info });
    res.send({ status: "success" });
  } else if (info.campusName === "Health Campus") {
    await updateDoc(ref, { healthCampus: info });
    res.send({ status: "success" });
  } else {
    res.send({ status: "Incorrect campus name" });
  }

  // res.send({status: "success"});
});

router.post("/EndShift", async (req, res) => {
  const { campusName } = req.body;

  const ref = doc(db, "CampusControl", "Working");

  const workingSnap = await getDoc(ref);

  if (campusName === "Main Campus") {
    await updateDoc(ref, { "mainCampus.taken": false });
    let temp = workingSnap.data().mainCampus.numPlate;
    if (temp !== undefined) {
      await updateDoc(ref, {
        unavailableCars: arrayRemove(`${temp}`),
      });
    }
    res.send({ status: "success" });
  } else if (campusName === "Education Campus") {
    await updateDoc(ref, { "educationCampus.taken": false });
    let temp = workingSnap.data().educationCampus.numPlate;
    if (temp !== undefined) {
      await updateDoc(ref, {
        unavailableCars: arrayRemove(`${temp}`),
      });
    }
    res.send({ status: "success" });
  } else if (campusName === "Business School") {
    await updateDoc(ref, { "businessSchool.taken": false });
    let temp = workingSnap.data().businessSchool.numPlate;
    if (temp !== undefined) {
      await updateDoc(ref, {
        unavailableCars: arrayRemove(`${temp}`),
      });
    }
    res.send({ status: "success" });
  } else if (campusName === "Health Campus") {
    await updateDoc(ref, { "healthCampus.taken": false });
    let temp = workingSnap.data().healthCampus.numPlate;
    if (temp !== undefined) {
      await updateDoc(ref, {
        unavailableCars: arrayRemove(`${temp}`),
      });
    }
    res.send({ status: "success" });
  } else {
    res.send({ status: "Incorrect campus name" });
  }
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

export default router;
