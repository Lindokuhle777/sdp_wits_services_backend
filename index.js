import cors from "cors";
import express from "express";
import { db } from "./firebase-config.js";
import { getDocs, collection, doc, arrayRemove, arrayUnion, updateDoc } from "firebase/firestore";
import getRoutes from "./routes/getRoutes.js";
import assignDriverToRoute from "./routes/assignDriverToRoute.js";
import removeDriverFromRoute from "./routes/removeDriverFromRoute.js";
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
        for (var j = 0; j < response[i].driversOnRoute.length; j++) {
          response[i].driversOnRoute[j].position;
          for (var k = 0; k < response[i].stops.length; k++) {
            if (response[i].stops[k] === response[i].driversOnRoute[j].position &&
              k + 1 < response[i].stops.length) {
              await updateDoc(doc(db, `Buses`, `${response[i].id}`), {
                driversOnRoute: arrayRemove({
                  driver: response[i].driversOnRoute[j].driver,
                  position: response[i].driversOnRoute[j].position
                })
              });
              await updateDoc(doc(db, `Buses`, `${response[i].id}`), {
                driversOnRoute: arrayUnion({
                  driver: response[i].driversOnRoute[j].driver,
                  position: response[i].stops[k + 1]
                })
              });
              break;
            }
            else if (response[i].stops[k] === response[i].driversOnRoute[j].position &&
              k + 1 === response[i].stops.length) {
              await updateDoc(doc(db, `Buses`, `${response[i].id}`), {
                driversOnRoute: arrayRemove({
                  driver: response[i].driversOnRoute[j].driver,
                  position: response[i].driversOnRoute[j].position
                })
              });
              await updateDoc(doc(db, `Buses`, `${response[i].id}`), {
                driversOnRoute: arrayUnion({
                  driver: response[i].driversOnRoute[j].driver,
                  position: response[i].stops[0]
                })
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
}, 5000);

app.use("/getRoutes", getRoutes);

app.use("/assignDriverToRoute", assignDriverToRoute);

app.use("/removeDriverFromRoute", removeDriverFromRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/**
echo "# sdp_wits_services_backend" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/NuttyChuma/sdp_wits_services_backend.git
git push -u origin main
 **/