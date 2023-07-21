import { onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

import { endorsementsDB } from "./scripts/endorsementsDB.js";

import {
  toggleEndorsementFormBtn,
  endorsementFormEl,
} from "./scripts/endorsementsView.js";

import {
  toggleEndorsementForm,
  createEndorsementItem,
  updateEndorsementsElOnDBChange,
} from "./scripts/endorsementsController.js";

localStorage.setItem("items", JSON.stringify([]));

toggleEndorsementFormBtn.addEventListener("click", toggleEndorsementForm);

endorsementFormEl.addEventListener("submit", (e) =>
  createEndorsementItem(e.target)
);

onValue(endorsementsDB, (snapshot) => updateEndorsementsElOnDBChange(snapshot));
