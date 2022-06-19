"use strict";

const boxes = JSON.parse(localStorage.getItem("boxes")) || [];

const btnAdd = document.querySelector(".btn-submit");
const boxNumContainer = document.querySelector(".box-num");
const itemsText = document.querySelector(".textarea");
const boxesContainer = document.querySelector(".boxes__container");
const btnSearch = document.querySelector(".search-btn");
const inputSearch = document.querySelector(".search-input");

boxNumContainer.textContent = boxes.length + 1;

const boxMaker = function (number, items) {
  return `
<article class="box">
  <div class="box-num ss02">${number}</div>
  <div class="items">
    <ul>
      ${items}
    </ul>
  </div>
  <div class="control">
    <button class="art__btn btn-remove">حذف</button>
    <button class="art__btn btn-edit">ویرایش</button>
  </div>
</article>
`;
};

const itemsOrganizer = function (items) {
  return items
    .split("\n")
    .filter((item) => {
      if (item) {
        return item;
      }
    })
    .map((item) => {
      if (item) return item.trim();
    });
};

const boxesUpdate = function () {
  boxesContainer.innerHTML = "";
  boxes.forEach((box, i) => {
    box.number = i + 1;
    let items = box.items
      .map((item) => {
        return `<li>${item}</li>`;
      })
      .join("\n");
    boxesContainer.insertAdjacentHTML("beforeend", boxMaker(box.number, items));
  });

  localStorage.setItem("boxes", JSON.stringify(boxes));
};
boxesUpdate();

btnAdd.addEventListener("click", function (e) {
  e.preventDefault();
  if (!itemsText.value) return;
  const itemsArr = itemsOrganizer(itemsText.value);
  itemsText.value = "";
  boxes.push({
    number: 1,
    items: itemsArr,
  });
  boxesUpdate();
  localStorage.setItem("boxes", JSON.stringify(boxes));
  boxNumContainer.textContent = boxes.length + 1;
});

boxesContainer.addEventListener("click", function (e) {
  if (!e.target.classList.contains("btn-edit")) return;
  e.preventDefault();

  const theBox = e.target.closest(".box");
  const index = theBox.firstElementChild.textContent - 1;
  const items = theBox.querySelector(".items");

  const editContainer = document.createElement("div");
  editContainer.classList.add("edit__container");

  const newTextarea = document.createElement("textarea");
  newTextarea.textContent = boxes[index].items.join("\n");
  newTextarea.classList.add("textarea", "ss02");
  newTextarea.style.width = "90%";
  newTextarea.style.fontSize = "2rem";
  newTextarea.style.margin = "0";
  items.firstElementChild.style.display = "none";
  items.style.margin = "1rem";

  const btnSet = document.createElement("button");
  btnSet.textContent = "ثبت";
  btnSet.classList.add("btn", "btn-submit", "raise", "btnEditSet");
  btnSet.style.width = "71px";
  btnSet.style.margin = "0";

  editContainer.append(newTextarea, btnSet);

  items.append(editContainer);
});

boxesContainer.addEventListener("click", function (e) {
  if (!e.target.classList.contains("btnEditSet")) return;
  e.preventDefault();
  const theBox = e.target.closest(".box");
  const index = theBox.firstElementChild.textContent - 1;
  boxes[index].items = itemsOrganizer(e.target.previousElementSibling.value);
  boxesUpdate();
  localStorage.setItem("boxes", JSON.stringify(boxes));
});

boxesContainer.addEventListener("click", function (e) {
  if (!e.target.classList.contains("btn-remove")) return;
  e.preventDefault();

  const theBox = e.target.closest(".box");
  const index = theBox.firstElementChild.textContent - 1;

  boxes.splice(index, 1);
  boxesUpdate();
  localStorage.setItem("boxes", JSON.stringify(boxes));
  boxNumContainer.textContent = boxes.length + 1;
});

btnSearch.addEventListener("click", function (e) {
  e.preventDefault();
  if (inputSearch.value === "") return;
  const filteredBoxes = boxes.filter((box) => {
    return box.items.includes(inputSearch.value);
  });
  boxesContainer.innerHTML = "";
  filteredBoxes.forEach((box) => {
    let items = box.items
      .map((item) => {
        return `<li>${item}</li>`;
      })
      .join("\n");
    boxesContainer.insertAdjacentHTML("beforeend", boxMaker(box.number, items));
  });
});

inputSearch.addEventListener("input", function (e) {
  const filteredBoxes = [];
  boxes.forEach((box, i, arr) => {
    if (box.items.some((item) => item.includes(inputSearch.value)))
      filteredBoxes.push(arr[i]);
  });
  boxesContainer.innerHTML = "";
  filteredBoxes.forEach((box) => {
    let items = box.items
      .map((item) => {
        return `<li>${item}</li>`;
      })
      .join("\n");
    boxesContainer.insertAdjacentHTML("beforeend", boxMaker(box.number, items));
  });
});
