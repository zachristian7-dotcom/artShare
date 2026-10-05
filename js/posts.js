import { auth, db, storage } from "./firebase.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";
import { addDoc, collection, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const file = document.getElementById("imageFile");
const preview = document.getElementById("preview");
file?.addEventListener("change", () => {
  const f = file.files?.[0]; if (!f) return;
  const url = URL.createObjectURL(f);
  preview.innerHTML = `<img src="${url}" alt="Preview">`;
});

document.getElementById("createPostForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const status = document.getElementById("formStatus");
  const user = auth.currentUser;
  if (!user) return;
  const image = file.files?.[0];
  if (!image) return;
  try {
    status.textContent = "Uploading artwork...";
    const storageRef = ref(storage, `posts/${user.uid}/${crypto.randomUUID()}-${image.name}`);
    await uploadBytes(storageRef, image, {contentType:image.type});
    const imageUrl = await getDownloadURL(storageRef);
    const userSnap = await getDoc(doc(db, "users", user.uid));
    const profile = userSnap.exists() ? userSnap.data() : {};
    await addDoc(collection(db, "posts"), {
      uid:user.uid, username:profile.username || "artist",
      title:document.getElementById("title").value.trim(),
      description:document.getElementById("description").value.trim(),
      tags:document.getElementById("tags").value.split(",").map(x=>x.trim().toLowerCase()).filter(Boolean),
      imageUrl, likes:0, createdAt:serverTimestamp()
    });
    location.href = "index.html";
  } catch(err) {
    console.error(err); status.textContent = err.message;
  }
});

const params = new URLSearchParams(location.search);
const postId = params.get("id");
const postView = document.getElementById("postView");
if (postId && postView) {
  const snap = await getDoc(doc(db, "posts", postId));
  if (!snap.exists()) { postView.innerHTML = `<div class="empty">Post not found.</div>`; }
  else {
    const p = {id:snap.id,...snap.data()};
    postView.innerHTML = `<article class="single-post">
      <img src="${p.imageUrl}" alt="${p.title}">
      <div class="single-post-body"><p class="eyebrow">@${p.username || "artist"}</p>
      <h1>${p.title}</h1><p>${p.description || ""}</p>
      <p class="post-meta">${(p.tags||[]).map(t=>"#"+t).join(" ")}</p></div>
    </article>`;
  }
}
