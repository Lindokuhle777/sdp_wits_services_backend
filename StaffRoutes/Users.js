import express from "express";
import { db } from "../firebase-config.js";
import {
  setDoc,
  collection,
  updateDoc,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const router = express.Router();

router.post("/AssignDep", async (req, res) => {
  const { email, department } = req.body;

  const ref = doc(db,"Users",email);

  try {
    if(department === "Dining Services"){
      await updateDoc(ref,{department,dhName:req.body.dhName});
    }else{
      await updateDoc(ref,{department});
    }

    res.send({status:"updated"});
    
  }
  catch (e) {
    res.send({status:"error"});
  }



  
});

export default router;
