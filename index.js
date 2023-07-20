import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  remove,
  update,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
  databaseURL:
    "https://scb-we-are-the-champions-db-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const endorsementsCollectionInDB = ref(database, "endorsementsCollection");

localStorage.setItem("items", JSON.stringify([]));

const toggleBtn = document.getElementById("toggle-button");
const endorsementForm = document.getElementById("endorsement-form");
const endorsementsCollectionElement = document.getElementById("endorsements");

toggleBtn.addEventListener("click", () => {
  toggleBtn.textContent === " add "
    ? (toggleBtn.textContent = " close ")
    : (toggleBtn.textContent = " add ");

  endorsementForm.classList.toggle("hidden");
});

endorsementForm.addEventListener("submit", () => {
  const formElements = endorsementForm.elements;

  const endorsement = {
    receiver: formElements[0].value,
    content: formElements[1].value,
    sender: formElements[2].value,
    likes: 0,
  };

  push(endorsementsCollectionInDB, endorsement);

  endorsementForm.reset();
});

onValue(endorsementsCollectionInDB, (snapshot) => {
  if (snapshot.exists()) {
    const endorsementsCollection = Object.entries(snapshot.val());
    endorsementsCollection.sort(sortItemsByLikesDescending);

    clearEndorsementsCollectionElement();

    for (let i = 0; i < endorsementsCollection.length; i++) {
      const endorsement = endorsementsCollection[i];
      appendItemToEndorsementsCollectionElement(endorsement);
    }
  } else {
    endorsementsCollectionElement.innerHTML = "No items here... yet";
  }
});

function sortItemsByLikesDescending(a, b) {
  return b[1].likes - a[1].likes;
}

function appendItemToEndorsementsCollectionElement(item) {
  const id = item[0];
  const { receiver, content, sender, likes } = item[1];

  let endorsementElement = document.createElement("div");
  endorsementElement.classList.add("message");

  endorsementElement.innerHTML = `
        <p class="message-receiver">To ${receiver}</p>
        <p class="message-text">${content}</p>
        <div class="message-info">
            <p class="message-sender">From ${sender}</p>
            <p class="message-likes">
            ${likes}
            </p>
        </div>
    `;

  let thumbUpElement = document.createElement("span");
  thumbUpElement.classList.add("material-symbols-outlined");
  thumbUpElement.textContent = " thumb_up ";

  const items = JSON.parse(localStorage.getItem("items"));

  if (items.includes(id)) {
    thumbUpElement.classList.add("liked");
  }

  let likesElement = endorsementElement.querySelector(".message-likes");
  likesElement.appendChild(thumbUpElement);

  endorsementElement.addEventListener("dblclick", () =>
    removeItemFromEndorsementCollectionInDB(id)
  );

  thumbUpElement.addEventListener("click", () =>
    updateThumbUpElement(id, likes)
  );

  endorsementsCollectionElement.appendChild(endorsementElement);
}

function removeItemFromEndorsementCollectionInDB(id) {
  const locationOfItem = ref(database, `endorsementsCollection/${id}`);

  remove(locationOfItem);
}

function updateThumbUpElement(id, likes) {
  const locationOfItem = ref(database, `endorsementsCollection/${id}`);
  const items = JSON.parse(localStorage.getItem("items"));

  if (!items.includes(id)) {
    saveItemInLocalStorage(id);
    update(locationOfItem, {
      likes: likes + 1,
    });
  } else {
    removeItemFromLocalStorage(id);
    update(locationOfItem, {
      likes: likes - 1,
    });
  }
}

function clearEndorsementsCollectionElement() {
  endorsementsCollectionElement.innerHTML = "";
}

function saveItemInLocalStorage(id) {
  let items = JSON.parse(localStorage.getItem("items"));
  items.push(id);
  localStorage.setItem("items", JSON.stringify(items));
}

function removeItemFromLocalStorage(id) {
  let items = JSON.parse(localStorage.getItem("items"));

  const index = items.indexOf(id);
  items.splice(index, 1);

  localStorage.setItem("items", JSON.stringify(items));
}
