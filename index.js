const toggleBtn = document.getElementById("toggle-button");
const endorsementForm = document.getElementById("endorsement-form");

toggleBtn.addEventListener("click", () => {
  toggleBtn.textContent === " add "
    ? (toggleBtn.textContent = " close ")
    : (toggleBtn.textContent = " add ");

  endorsementForm.classList.toggle("hidden");
});
