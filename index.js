import cors from "cors";
import express from "express";
import { db } from "./firebase-config.js";
import { getDocs, collection, doc, arrayRemove, arrayUnion, updateDoc } from "firebase/firestore";
import getRoutes from "./routes/getRoutes.js";
import assignDriverToRoute from "./routes/assignDriverToRoute.js";
import removeDriverFromRoute from "./routes/removeDriverFromRoute.js";
import Create from "./StaffRoutes/Create.js";
import Menus from "./StaffRoutes/Menus.js";
import Users from "./StaffRoutes/Users.js";

const app = express();

const PORT = process.env.PORT || 5000;

//Middleware

app.use(express.json()); // enable json

app.use(cors());

//routes

setInterval(async () => {
  const usersCollectionRef = collection(db, "Buses/");
  try {
    const data = await getDocs(usersCollectionRef);
    var response = [];
    if (data === null) {
    } else {
      data.forEach((doc) => {
        response.push(doc.data());
      });


      for (var i = 0; i < response.length; i++) {
        // console.log(response[i]);
        const routesCollectionRef = collection(db, `Buses`, `${response[i].id}`, `driversOnRoute/`);
        const drivers = await getDocs(routesCollectionRef);
        var driversOnRoute = [];
        if (drivers === null) {
        } else {
          drivers.forEach((doc) => {
            driversOnRoute.push(doc.data());
          });

        }

        for (var j = 0; j < driversOnRoute.length; j++) {
          for (var k = 0; k < response[i].stops.length; k++) {
            if (response[i].stops[k] === driversOnRoute[j].position &&
              k + 1 < response[i].stops.length) {

              await updateDoc(doc(db, `Buses`, `${response[i].id}`, `driversOnRoute/${driversOnRoute[j].driver}`), {
                position: response[i].stops[k+1],
              });
              break;
            }
            else if (response[i].stops[k] === driversOnRoute[j].position &&
              k + 1 === response[i].stops.length) {

              await updateDoc(doc(db, `Buses`, `${response[i].id}`, `driversOnRoute/${driversOnRoute[j].driver}`), {
                position: response[i].stops[0],
              });
              break;
            }
          }
        }
      }
    }

    return data;
  } catch (e) {
    console.log(e);
  }
}, 50000);

//Students routes

app.use("/getRoutes", getRoutes);

app.use("/assignDriverToRoute", assignDriverToRoute);

app.use("/removeDriverFromRoute", removeDriverFromRoute);

//Stuff Routes

app.use("/Create",Create);
app.use("/Menus",Menus);
app.use("/Users",Users);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});