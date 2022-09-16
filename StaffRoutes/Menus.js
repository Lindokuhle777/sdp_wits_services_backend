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
  let dinner = [];
  let breakfast = [];
  let lunch = [];
  let selectedDinner = [];
  let selectedBreakfast = [];
  let selectedLunch = [];

  dhID = get_dhID(dhName);

  const type = ["Breakfast", "Lunch", "Dinner"];

  for (let i = 0; i < type.length; i++) {
    const curr = type[i];
    const originalRef = collection(db, `Dining/OriginalMenu/${type[i]}`);
    const currDocs = await getDocs(originalRef);
    let temp = [];

    currDocs.forEach((doc) => {
      temp.push({ ...doc.data(), id: doc.id });
    });

    if (curr === "Breakfast") {
      breakfast = temp;
    } else if (curr === "Lunch") {
      lunch = temp;
    } else {
      dinner = temp;
    }
  }

  const dhRef = doc(db, `Dining/DiningHalls/DiningHallNames`, dhID);
  const dh = await getDoc(dhRef);

  selectedBreakfast = dh.data().selected.breakfast;
  selectedLunch = dh.data().selected.lunch;
  selectedDinner = dh.data().selected.dinner;

  res.send({
    original: { breakfast, lunch, dinner },
    selected: { selectedBreakfast, selectedDinner, selectedLunch },
  });
});

router.post("/SelectedMenu", async (req, res) => {
  const { selected, dhName,type } = req.body;
  const dhID = get_dhID(dhName);

  const dhRef = doc(db, `Dining/DiningHalls/DiningHallNames`, dhID);
  let currDoc = await getDoc(dhRef);
  if(type === 'breakfast'){
    await setDoc(dhRef,{...currDoc.data(),selected:{...currDoc.data().selected,breakfast:selected}});
  }else if(type === 'lunch'){
    await setDoc(dhRef,{...currDoc.data(),selected:{...currDoc.data().selected,lunch:selected}});
  }else{
    await setDoc(dhRef,{...currDoc.data(),selected:{...currDoc.data().selected,dinner:selected}});
  }

  res.send({ status: "added" });
});

export default router;
