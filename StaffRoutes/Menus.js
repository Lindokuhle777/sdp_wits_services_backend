import express from "express";
import { db } from "../firebase-config.js";
import {
  getDocs,
  collection,
  updateDoc,
  doc,
  getDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

const router = express.Router();

const get_dhID = (dhName) => {
  switch (dhName) {
    case "Main":
      return "DH1";
    case "Jubilee":
      return "DH2";
    case "Convocation":
      return "DH3";
    case "Highfield":
      return "DH4";
    case "Ernest Openheimer":
      return "DH5";
    case "Knockando":
      return "DH6";
    default:
      break;
  }
};

router.post("/GetMenus", async (req, res) => {
  const { dhName } = req.body;
  let dhID = "";
  let dinner = {};
  let breakfast = {};
  let lunch = {};
  let selectedDinner;
  let selectedBreakfast;
  let selectedLunch;

  dhID = get_dhID(dhName);

  const type = ["Breakfast", "Lunch", "Dinner"];

  for (let i = 0; i < type.length; i++) {
    const curr = type[i];
    const originalRef = doc(db, `Dining`,curr);
    const currDocs = await getDoc(originalRef);
    if(curr==="Breakfast"){
      breakfast = currDocs.data();
    }
    else if(curr==="Lunch"){
      lunch = currDocs.data();
    }else{
      dinner = currDocs.data();
    }
  }

  const dhRef = doc(db, `Dining/DiningHalls/DiningHallNames`, dhID);
  const dh = await getDoc(dhRef);

  selectedBreakfast = dh.data().breakfast;
  selectedLunch = dh.data().lunch;
  selectedDinner = dh.data().dinner;

  res.send({
    original: { breakfast, lunch, dinner },
    selected:{selectedLunch, selectedDinner,selectedBreakfast},
  });
});

router.post("/SelectedMenu", async (req, res) => {
  const { selected, dhName,type} = req.body;
  const dhID = get_dhID(dhName);

  const dhRef = doc(db, `Dining/DiningHalls/DiningHallNames`, dhID);
  const currDoc = await getDoc(dhRef);

  if(type === "breakfast"){
   const old = currDoc.data().breakfast;
   await updateDoc(dhRef,{breakfast:{...old,...selected}});
  }else if(type === "lunch"){
    const old = currDoc.data().lunch;
    await updateDoc(dhRef,{lunch:{...old,...selected}});
   }else{
    const old = currDoc.data().dinner;
    await updateDoc(dhRef,{dinner:{...old,...selected}});
   }

  res.send({ status: "added" });
});

export default router;
