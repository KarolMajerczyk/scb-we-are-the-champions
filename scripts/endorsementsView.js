export const toggleEndorsementFormBtn = document.getElementById(
  "toggle-endorsement-form"
);
export const endorsementFormEl = document.getElementById("endorsement-form");
export const endorsementsEl = document.getElementById("endorsements");

export function toggleEndorsementFormEl() {
  toggleEndorsementFormBtn.textContent === " add "
    ? (toggleEndorsementFormBtn.textContent = " close ")
    : (toggleEndorsementFormBtn.textContent = " add ");

  endorsementFormEl.classList.toggle("hidden");
}

export function clearEndorsementsEl(message) {
  message
    ? (endorsementsEl.innerHTML = "No items here... yet")
    : (endorsementsEl.innerHTML = "");
}

export function createEndorsementEl(receiver, content, sender, likes) {
  const endorsementEl = document.createElement("div");
  endorsementEl.classList.add("endorsement");

  endorsementEl.innerHTML = `
          <p class="endorsement-receiver">To ${receiver}</p>
          <p class="endorsement-text">${content}</p>
          <div class="endorsement-info">
              <p class="endorsement-sender">From ${sender}</p>
              <p class="endorsement-likes">
              ${likes}
              </p>
          </div>
      `;

  return endorsementEl;
}

export function createThumbUpEl() {
  const thumbUpEl = document.createElement("span");
  thumbUpEl.classList.add("material-symbols-outlined");
  thumbUpEl.textContent = " thumb_up ";

  return thumbUpEl;
}
