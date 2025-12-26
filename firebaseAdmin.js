import admin from "firebase-admin";
import fs from "fs";

let serviceAccount;

if (process.env.FIREBASE_SERVICE_KEY) {
  // ✅ Production (Render)
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_KEY);
} else {
  // ✅ Local development
  serviceAccount = JSON.parse(
    fs.readFileSync("./firebaseServiceKey.json", "utf8")
  );
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
