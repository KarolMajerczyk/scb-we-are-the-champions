export const toggleFormBtn = document.getElementById("toggle-button");
export const endorsementForm = document.getElementById("endorsement-form");
export const endorsementsEl = document.getElementById("endorsements");

export function toggleEndorsementFormEl() {
  toggleFormBtn.textContent === " add "
    ? (toggleFormBtn.textContent = " close ")
    : (toggleFormBtn.textContent = " add ");

  endorsementForm.classList.toggle("hidden");
}

export function clearEndorsementsEl(message) {
  message
    ? (endorsementsEl.innerHTML = "No items here... yet")
    : (endorsementsEl.innerHTML = "");
}

export function createEndorsementEl(receiver, content, sender, likes) {
  const endorsementEl = document.createElement("div");
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

  return endorsementEl;
}

export function createThumbUpEl() {
  const thumbUpEl = document.createElement("span");
  thumbUpEl.classList.add("material-symbols-outlined");
  thumbUpEl.textContent = " thumb_up ";

  return thumbUpEl;
}
