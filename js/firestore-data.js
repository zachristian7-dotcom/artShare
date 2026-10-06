import { db } from "./firebase.js";
import {
  collection, doc, getDoc, getDocs, limit, query, where
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

export function sortNewest(items) {
  return items.sort((a,b) => {
    const at = a.createdAt?.toMillis?.() ?? (a.createdAt?.seconds ?? 0) * 1000;
    const bt = b.createdAt?.toMillis?.() ?? (b.createdAt?.seconds ?? 0) * 1000;
    return bt - at;
  });
}

export async function getPosts(max = 30) {
  const snap = await getDocs(query(collection(db, "posts"), limit(max)));
  return sortNewest(snap.docs.map(d => ({ id: d.id, ...d.data() })));
}

export async function getUserPosts(uid, max = 30) {
  const snap = await getDocs(query(collection(db, "posts"), where("uid", "==", uid), limit(max)));
  return sortNewest(snap.docs.map(d => ({ id: d.id, ...d.data() })));
}

export async function getPost(id) {
  const snap = await getDoc(doc(db, "posts", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getPostComments(postId, max = 100) {
  const snap = await getDocs(query(collection(db, "posts", postId, "comments"), limit(max)));
  return sortNewest(snap.docs.map(d => ({ id: d.id, ...d.data() })));
}
