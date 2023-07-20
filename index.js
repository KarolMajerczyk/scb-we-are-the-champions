// Imports

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  remove,
  update,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Configuration

const firebaseConfig = {
  databaseURL:
    "https://scb-we-are-the-champions-db-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const endorsementsDb = ref(database, "endorsements");

localStorage.setItem("items", JSON.stringify([]));

// Elements

const toggleFormBtn = document.getElementById("toggle-button");
const endorsementForm = document.getElementById("endorsement-form");
const endorsementsEl = document.getElementById("endorsements");

// Controller

toggleFormBtn.addEventListener("click", toggleEndorsementForm);

endorsementForm.addEventListener("submit", () => {
  const { receiver, content, sender } = getEndorsementFormInputValues();

  const endorsement = {
    receiver,
    content,
    sender,
    likes: 0,
  };

  addItemToEndorsementsDb(endorsement);
});

onValue(endorsementsDb, (snapshot) => {
  if (snapshot.exists()) {
    const endorsements = Object.entries(snapshot.val());
    endorsements.sort(sortEndorsementsByLikes);

    clearEndorsementsEl();

    for (let i = 0; i < endorsements.length; i++) {
      const endorsement = endorsements[i];
      appendItemToEndorsementsEl(endorsement);
    }
  } else {
    endorsementsEl.innerHTML = "No items here... yet";
  }
});

function updateThumbUpEl(id, likes) {
  const locationOfItem = ref(database, `endorsements/${id}`);
  const items = JSON.parse(localStorage.getItem("items"));

  if (!items.includes(id)) {
    saveItemToLocalStorage(id);
    addLikeToEndorsement(locationOfItem, likes);
  } else {
    removeItemFromLocalStorage(id);
    removeLikeFromEndorsement(locationOfItem, likes);
  }
}

// Helpers

function sortEndorsementsByLikes(a, b) {
  return b[1].likes - a[1].likes;
}

// Model

function addItemToEndorsementsDb(item) {
  push(endorsementsDb, item);
}

function removeItemFromEndorsementsDb(id) {
  const locationOfItem = ref(database, `endorsements/${id}`);
  remove(locationOfItem);
}

function addLikeToEndorsement(location, likes) {
  update(location, {
    likes: likes + 1,
  });
}

function removeLikeFromEndorsement(location, likes) {
  update(location, {
    likes: likes - 1,
  });
}

function saveItemToLocalStorage(id) {
  let items = JSON.parse(localStorage.getItem("items"));
  items.push(id);
  localStorage.setItem("items", JSON.stringify(items));
}

function removeItemFromLocalStorage(id) {
  let items = JSON.parse(localStorage.getItem("items"));

  const position = items.indexOf(id);
  items.splice(position, 1);

  localStorage.setItem("items", JSON.stringify(items));
}

// View

function getEndorsementFormInputValues() {
  const inputs = endorsementForm.elements;

  const receiver = inputs[0].value;
  const content = inputs[1].value;
  const sender = inputs[2].value;

  endorsementForm.reset();

  return { receiver, content, sender };
}

function toggleEndorsementForm() {
  toggleFormBtn.textContent === " add "
    ? (toggleFormBtn.textContent = " close ")
    : (toggleFormBtn.textContent = " add ");

  endorsementForm.classList.toggle("hidden");
}

function appendItemToEndorsementsEl(item) {
  const id = item[0];
  const { receiver, content, sender, likes } = item[1];

  let endorsementEl = document.createElement("div");
  endorsementEl.classList.add("message");

  endorsementEl.innerHTML = `
        <p class="message-receiver">To ${receiver}</p>
        <p class="message-text">${content}</p>
        <div class="message-info">
            <p class="message-sender">From ${sender}</p>
            <p class="message-likes">
            ${likes}
            </p>
        </div>
    `;

  let thumbUpEl = document.createElement("span");
  thumbUpEl.classList.add("material-symbols-outlined");
  thumbUpEl.textContent = " thumb_up ";

  const items = JSON.parse(localStorage.getItem("items"));

  if (items.includes(id)) {
    thumbUpEl.classList.add("liked");
  }

  let likesElement = endorsementEl.querySelector(".message-likes");
  likesElement.appendChild(thumbUpEl);

  endorsementEl.addEventListener("dblclick", () =>
    removeItemFromEndorsementsDb(id)
  );

  thumbUpEl.addEventListener("click", () => updateThumbUpEl(id, likes));

  endorsementsEl.appendChild(endorsementEl);
}

function clearEndorsementsEl() {
  endorsementsEl.innerHTML = "";
}
