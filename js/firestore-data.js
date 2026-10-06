import {db} from "./firebase.js";
import {collection,doc,getDoc,getDocs,limit,orderBy,query,where,addDoc,deleteDoc,serverTimestamp,setDoc} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
export function sortNewest(a){return a.sort((x,y)=>(y.createdAt?.seconds??0)-(x.createdAt?.seconds??0))}
export async function getPosts(n=30){const s=await getDocs(query(collection(db,"posts"),orderBy("createdAt","desc"),limit(n)));return s.docs.map(d=>({id:d.id,...d.data()}))}
export async function getUserPosts(uid,n=30){const s=await getDocs(query(collection(db,"posts"),where("uid","==",uid),limit(n)));return sortNewest(s.docs.map(d=>({id:d.id,...d.data()})))}
export async function getPost(id){const s=await getDoc(doc(db,"posts",id));return s.exists()?{id:s.id,...s.data()}:null}
export async function getPostComments(id,n=100){const s=await getDocs(query(collection(db,"posts",id,"comments"),orderBy("createdAt","asc"),limit(n)));return s.docs.map(d=>({id:d.id,...d.data()}))}
export async function addComment(id,uid,username,text){return addDoc(collection(db,"posts",id,"comments"),{uid,username,text:text.trim(),createdAt:serverTimestamp()})}
export async function getLike(id,uid){return (await getDoc(doc(db,"posts",id,"likes",uid))).exists()}
export async function toggleLike(id,uid){const r=doc(db,"posts",id,"likes",uid);if((await getDoc(r)).exists()){await deleteDoc(r);return false}await setDoc(r,{uid,createdAt:serverTimestamp()});return true}
export async function getLikeCount(id){return (await getDocs(collection(db,"posts",id,"likes"))).size}
export async function getSave(id,uid){return (await getDoc(doc(db,"posts",id,"saves",uid))).exists()}
export async function toggleSave(id,uid){const r=doc(db,"posts",id,"saves",uid);if((await getDoc(r)).exists()){await deleteDoc(r);return false}await setDoc(r,{uid,createdAt:serverTimestamp()});return true}
