import { auth, db } from "./firebase.js"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

const fakeUsers = [
  {
    email: "john.doe@example.com",
    name: "JohnDoe123",
    password: "Password123!",
    type: "student",
  },
  {
    email: "jane.smith@example.com",
    name: "JaneSmith456",
    password: "SecurePass456!",
    type: "admin",
  },
  {
    email: "mark.twain@example.com",
    name: "MarkTwain789",
    password: "TwainRocks789!",
    type: "student",
  },
  {
    email: "emily.davis@example.com",
    name: "EmilyDavis321",
    password: "EmilySecure321!",
    type: "student",
  },
  {
    email: "admin.boss@example.com",
    name: "AdminBoss999",
    password: "AdminPass999!",
    type: "admin",
  },
];

async function registerFakeUsers() {
  for (const user of fakeUsers) {
    try {
      await createUserWithEmailAndPassword(auth, user.email, user.password);
      const currentUser = auth.currentUser;

      if (currentUser) {
        const { uid } = currentUser;
        await addDoc(collection(db, "Users"), {
          email: user.email,
          name: user.name,
          id: uid,
          password: user.password, 
          type: user.type,
          rating: Math.floor(Math.random() * 100),
          projects: Math.floor(Math.random() * 10),
        });

        console.log(`User ${user.name} registered and stored with UID: ${uid}`);
      }
    } catch (error) {
      console.error(`Error registering user ${user.name}:`, error);
    }
  }
}

registerFakeUsers();
