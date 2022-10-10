import express from "express";
import {Appointment} from './appointment.js';
import { db } from "../../firebase-config.js";
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
  addDoc,
} from "firebase/firestore";
const router = express.Router();

const getAllAppointments = async(req,res)=>{

    const colRef = collection(db, "Appointments");
    let arr=[];
    try {
      const docsSnap = await getDocs(colRef);
      if(docsSnap.docs.length > 0) {
        //res.send("done");
         docsSnap.forEach(doc => {
          arr.push(doc.data());
        })
      }
      res.send(arr);
  }catch(error){
    res.status(404).send(error.message);
  }
}

const statusUpdate = async(req,res)=>{
  //const docID = req.body;//get the ID value from the request body.
  const ref = doc(db, 'Appointments','iyk7r3CrbabwFWJ0wdej');//the gibberish is the doc id
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    
    const document = docSnap.data();
    
    if(document['status'] = 'Pending'){
      
      updateDoc(ref,{status:'Confirmed'});
      res.send('status changed to Confirmed');
    }
    // else if(document['status'] = 'Confirmed'){
    //   //console.log('its Confirmed');
    //   updateDoc(ref,{status:'Pending'});
    //   res.send('status changed to Pending');
    // }
  } else {
    console.log("No such document!");
    res.send('No such document!');
  }//
}
//delete an appointment
//TODO

router
.route("/appointments")//get all Appointments
.get(getAllAppointments)
router
.route("/appointments/document/statusUpdate")//change the status of an appointment
.get(statusUpdate)




export default router;