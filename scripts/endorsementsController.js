import {
  addEndorsementToDB,
  removeEndorsementFromDB,
  saveEndorsementToLocalStorage,
  removeEndorsementFromLocalStorage,
  updateEndorsementLikes,
} from "./endorsementsModel.js";

import {
  endorsementsEl,
  toggleEndorsementFormEl,
  clearEndorsementsEl,
  createEndorsementEl,
  createThumbUpEl,
} from "./endorsementsView.js";

export function toggleEndorsementForm() {
  toggleEndorsementFormEl();
}

export function createEndorsementItem(form) {
  const inputs = form.elements;

  const receiver = inputs[0].value;
  const content = inputs[1].value;
  const sender = inputs[2].value;

  const endorsement = {
    receiver,
    content,
    sender,
    likes: 0,
  };

  addEndorsementToDB(endorsement);
  form.reset();
}

//

export function updateEndorsementsElOnDBChange(snapshot) {
  clearEndorsementsEl("No items here... yet");

  if (snapshot.exists()) {
    const endorsements = Object.entries(snapshot.val());
    endorsements.sort(sortEndorsementsByLikes);

    clearEndorsementsEl();
    updateEndorsementsEl(endorsements);
  }
}

function updateEndorsementsEl(endorsements) {
  for (let i = 0; i < endorsements.length; i++) {
    const endorsement = endorsements[i];

    const id = endorsement[0];
    const { receiver, content, sender, likes } = endorsement[1];

    const endorsementEl = createEndorsementEl(receiver, content, sender, likes);
    const thumbUpEl = createThumbUpEl();

    if (isEndorsementInLocalStorage(id)) {
      thumbUpEl.classList.add("liked");
    }

    let likesElement = endorsementEl.querySelector(".message-likes");
    likesElement.appendChild(thumbUpEl);

    endorsementEl.addEventListener("dblclick", (e) => {
      if (!isTargetElThumbUpEl(e)) {
        removeEndorsementFromDB(id);
      }
    });

    thumbUpEl.addEventListener("click", () => updateThumbUpEl(id, likes));

    endorsementsEl.appendChild(endorsementEl);
  }
}

function updateThumbUpEl(id) {
  if (isEndorsementInLocalStorage(id)) {
    updateEndorsementLikes(id, -1);
    removeEndorsementFromLocalStorage(id);
  } else {
    updateEndorsementLikes(id, 1);
    saveEndorsementToLocalStorage(id);
  }
}

function sortEndorsementsByLikes(a, b) {
  return b[1].likes - a[1].likes;
}

function isEndorsementInLocalStorage(id) {
  const items = JSON.parse(localStorage.getItem("items"));

  return items.includes(id);
}

function isTargetElThumbUpEl(e) {
  return e.target.textContent === " thumb_up ";
}
