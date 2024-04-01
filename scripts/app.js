"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";

/* components */
const page = {
  menu: document.querySelector(".menu__list"),
};

// utils

// функция загрузки данных
function loadData() {
  const habbitsString = localStorage.getItem(HABBIT_KEY);
  const habbitsArray = JSON.parse(habbitsString);
  if (Array.isArray(habbitsArray)) {
    habbits = habbitsArray;
  }
}

// функция сохранения данных
function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

// render

function rerenderMenu(activeHabbit) {
  if (!activeHabbit) {
    return;
  }
  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
    if (!existed) {
      const element = document.createElement("li");
      element.classList.add("menu__list-item");
      element.setAttribute("menu-habbit-id", habbit.id);
      const elementButton = document.createElement("button");
      elementButton.classList.add("menu__button", "button");
      elementButton.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}" />`;
      element.appendChild(elementButton);
      if (activeHabbit.id === habbit.ad) {
        elementButton.classList.add("menu__button-active");
      }
      page.menu.appendChild(element);
      continue;
    }
    if (activeHabbit.id === habbit.id) {
      existed.classList.add("menu__button-active");
    } else {
      existed.classList.remove("menu__button-active");
    }
  }
}

function rerender(activeHabbitId) {
  const activeHabbit = habbits.find((habbit) => {
    return habbit.id === activeHabbitId;
  });
  rerenderMenu(activeHabbit);
}

// init
(() => {
  loadData();
  rerender(habbits[0].id);
})();
