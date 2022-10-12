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
  deleteField
} from "firebase/firestore";

const router = express.Router();

router.post("/GetStudents", async (req, res) => {
  const { campusName } = req.body;

  const ref = doc(db, "CampusControl", campusName);

  const snap = await getDoc(ref);
  let output = [];

  if (snap.data().students === undefined) {
    res.send([]);
  } else {
    const students = snap.data().students;
    let studentsArr = [];
    Object.keys(students).forEach((key) => {
      studentsArr.push(students[key]);
    });

    if (studentsArr.length <= snap.data().seats) {
      for (var i = 0; i < studentsArr.length; i++) {
        let student = studentsArr[i];
        if (student.status === "waiting") {
          await updateDoc(ref, {
            [`students.${student.email.split("@")[0]}.status`]: "ready",
          });
        }
        student.status = "ready";
        output.push(student);
      }
      res.send(output);
    } else {
      for (var i = 0; i < snap.data().seats; i++) {
        let student = studentsArr[i];
        if (student.status === "waiting") {
          await updateDoc(ref, {
            [`students.${student.email.split("@")[0]}.status`]: "ready",
          });
        }
        student.status = "ready";
        output.push(student);
      }
      res.send(output);
    }
  }
});

router.post("/onRoute", async (req, res)=>{
    const { campusName,emails } = req.body;
    const ref = doc(db,"CampusControl",campusName);
    for(var i=0;i<emails.length;i++){
        const email = emails[i];
        const studentNum = email.split("@")[0];
        // console.log(studentNum);
        await updateDoc(ref, {
            [`students.${studentNum}.status`]: "onRoute",
          });
    }
    res.send({ status: "success" });
});

router.post("/done", async (req, res)=>{
    const { campusName,emails } = req.body;
    const ref = doc(db,"CampusControl",campusName);
    for(var i=0;i<emails.length;i++){
        const email = emails[i];
        const studentNum = email.split("@")[0];
        await updateDoc(ref, {
            [`students.${studentNum}`] :deleteField()
          });
    }
    res.send({ status: "success" });
});

export default router;
