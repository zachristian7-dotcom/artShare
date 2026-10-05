import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const status = document.getElementById("authStatus");
const say = msg => { if(status) status.textContent = msg; };

document.getElementById("loginForm")?.addEventListener("submit", async e => {
  e.preventDefault(); say("Signing in...");
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    location.href = "index.html";
  } catch(err) { say(err.message.replace("Firebase: ","")); }
});

document.getElementById("signupForm")?.addEventListener("submit", async e => {
  e.preventDefault(); say("Creating account...");
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.value, password.value);
    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid, displayName: displayName.value.trim(),
      username: username.value.trim().toLowerCase(), email: email.value.trim(),
      bio: "", avatarUrl: "", createdAt: serverTimestamp()
    });
    location.href = "index.html";
  } catch(err) { say(err.message.replace("Firebase: ","")); }
});
