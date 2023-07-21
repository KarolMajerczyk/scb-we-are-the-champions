import {
  ref,
  push,
  remove,
  update,
  get,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

import { database, endorsementsDB } from "./endorsementsDB.js";

export function addEndorsementToDB(endorsement) {
  push(endorsementsDB, endorsement);
}

export function removeEndorsementFromDB(id) {
  const endorsementLocation = ref(database, `endorsements/${id}`);
  remove(endorsementLocation);
}

export async function updateEndorsementLikes(id, value) {
  const currentLikes = await getEndorsementLikes(id);
  const endorsementLocation = ref(database, `endorsements/${id}`);

  update(endorsementLocation, {
    likes: currentLikes + value,
  });
}

async function getEndorsementLikes(id) {
  const endorsementLocation = ref(database, `endorsements/${id}`);
  const snapshot = await get(endorsementLocation);

  return snapshot.val().likes;
}

export function saveEndorsementToLocalStorage(id) {
  let items = JSON.parse(localStorage.getItem("items"));
  items.push(id);
  localStorage.setItem("items", JSON.stringify(items));
}

export function removeEndorsementFromLocalStorage(id) {
  let items = JSON.parse(localStorage.getItem("items"));

  const position = items.indexOf(id);
  items.splice(position, 1);

  localStorage.setItem("items", JSON.stringify(items));
}
