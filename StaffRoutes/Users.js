import express from "express";
import { db } from "../firebase-config.js";
import {
  setDoc,
  collection,
  updateDoc,
  doc,
  addDoc,
  getDoc,
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

router.post("/GetDep",async (req, res)=>{
  const email = req.body.email;

  const currDoc = await getDoc(doc(db,"Users",email));

  if(currDoc.exists()){
    if(currDoc.data().department === undefined){
      res.send({status:"new"});
    }else{
      if(currDoc.data().department === "Dining Services"){
        res.send({status:"exists",department:currDoc.data().department,dhName:currDoc.data().dhName});
      }else{
        res.send({status:"exists",department:currDoc.data().department});
      }
    }

  }else{
    res.send({status:"error"});
  }
});

export default router;
