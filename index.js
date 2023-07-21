import { onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

import { endorsementsDB } from "./scripts/endorsementsDB.js";

import { toggleFormBtn, endorsementForm } from "./scripts/endorsementsView.js";

import {
  toggleEndorsementForm,
  createEndorsementItem,
  updateEndorsementsElOnDBChange,
} from "./scripts/endorsementsController.js";

localStorage.setItem("items", JSON.stringify([]));

toggleFormBtn.addEventListener("click", toggleEndorsementForm);

endorsementForm.addEventListener("submit", (e) =>
  createEndorsementItem(e.target)
);

onValue(endorsementsDB, (snapshot) => updateEndorsementsElOnDBChange(snapshot));
