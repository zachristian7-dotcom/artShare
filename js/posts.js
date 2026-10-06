import { auth } from "./firebase.js";
import { uploadImage } from "./cloudinary.js";
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { getPosts, getPost } from "./firestore-data.js";

const form = document.querySelector("#postForm"), status = document.querySelector("#status"), image = document.querySelector("#image"), preview = document.querySelector("#preview"), wrap = document.querySelector("#previewWrap");
const show = m => { if (status) status.textContent = m; };

image?.addEventListener("change", () => { const f = image.files?.[0]; if (f) { preview.src = URL.createObjectURL(f); wrap.classList.remove("hidden"); } });

form?.addEventListener("submit", async e => {
  e.preventDefault();
  if (!auth.currentUser) { location.href = "./login.html"; return; }
  const f = image.files?.[0];
  if (!f) return show("Choose an image first.");
  try {
    form.querySelector("button").disabled = true;
    show("Uploading artwork…");
    const u = await uploadImage(f);
    show("Publishing post…");
    await addDoc(collection((await import("./firebase.js")).db, "posts"), {
      uid: auth.currentUser.uid,
      username: auth.currentUser.displayName || "Artist",
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      tags: form.tags.value.split(",").map(x => x.trim().toLowerCase()).filter(Boolean).slice(0, 20),
      imageUrl: u.url, cloudinaryPublicId: u.publicId, width: u.width, height: u.height, format: u.format, bytes: u.bytes,
      likes: 0, createdAt: serverTimestamp()
    });
    location.href = "./explore.html";
  } catch (x) { console.error(x); show(x.message || "Could not publish the post."); form.querySelector("button").disabled = false; }
});

async function feed() {
  const el = document.querySelector("#feed"); if (!el) return;
  try {
    const posts = await getPosts(30);
    el.innerHTML = "";
    posts.forEach(p => {
      const a = document.createElement("article"); a.className = "post-card";
      a.innerHTML = `<a href="./post.html?id=${encodeURIComponent(p.id)}"><img src="${esc(p.imageUrl)}" alt="${esc(p.title || "Artwork")}"></a><div class="body"><h3>${esc(p.title || "Untitled")}</h3><p>by ${esc(p.username || "Artist")}</p>${(p.tags || []).slice(0,5).map(t => `<span class="tag">#${esc(t)}</span>`).join("")}</div>`;
      el.appendChild(a);
    });
    if (!posts.length) show("No posts yet. Be the first to publish something!");
  } catch (x) { console.error(x); show(`Could not load the feed: ${x.message || "Firestore error"}`); }
}

async function single() {
  const el = document.querySelector("#post"); if (!el) return;
  const id = new URLSearchParams(location.search).get("id"); if (!id) return;
  try {
    const p = await getPost(id);
    if (!p) { el.innerHTML = "<p>Post not found.</p>"; return; }
    el.innerHTML = `<img src="${esc(p.imageUrl)}" alt="${esc(p.title || "Artwork")}" style="width:100%;max-height:700px;object-fit:contain;border-radius:12px"><div style="padding-top:20px"><p class="eyebrow">ARTWORK</p><h1>${esc(p.title || "Untitled")}</h1><p class="muted">by ${esc(p.username || "Artist")}</p><p>${esc(p.description || "")}</p>${(p.tags || []).map(t => `<span class="tag">#${esc(t)}</span>`).join("")}</div>`;
  } catch (x) { console.error(x); el.innerHTML = `<p>${esc(x.message || "Firestore error")}</p>`; }
}

function esc(v="") { return String(v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c])); }
if (document.querySelector("#feed")) feed();
if (document.querySelector("#post")) single();
