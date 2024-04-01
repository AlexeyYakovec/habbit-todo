"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";
let globalActiveHabbitId = undefined;

/* components */
const page = {
  menu: document.querySelector(".menu__list"),
  header: {
    h1: document.querySelector(".title"),
    progressPrecent: document.querySelector(".progress__percent"),
    progressCoverBar: document.querySelector(".progress__cover-bar"),
  },
  content: {
    daysContainer: document.getElementById("days"),
    nextDay: document.querySelector(".habbit__day"),
  },
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
  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
    const button = document.createElement("button");
    const element = document.createElement("li");

    if (!existed) {
      button.setAttribute("menu-habbit-id", habbit.id);
      element.setAttribute("habbit-id", habbit.id);
      element.classList.add("menu__list-item");
      button.classList.add("button", "menu__button");
      button.innerHTML = `<img src="./images/${habbit.icon}.svg" alt=$${habbit.name} />`;
      button.addEventListener("click", () => {
        console.log(habbit.id);
        rerender(habbit.id);
      });
      if (activeHabbit.id === habbit.id) {
        button.classList.add("menu__button-active");
      }
      element.append(button);
      page.menu.appendChild(element);
      continue;
    }
    if (activeHabbit.id === habbit.id) {
      existed.classList.toggle("menu__button-active");
    } else {
      existed.classList.remove("menu__button-active");
    }
  }
}

function rerenderHead(activeHabbit) {
  page.header.h1.innerText = activeHabbit.name;
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;

  page.header.progressPrecent.innerText = progress.toFixed(0) + "%";
  page.header.progressCoverBar.setAttribute("style", `width: ${progress}%`);
}

function rerenderContent(activeHabbit) {
  page.content.daysContainer.innerHTML = "";

  for (const index in activeHabbit.days) {
    const element = document.createElement("li");
    element.classList.add("habbit-list__item");
    element.innerHTML = `
	                <div class="dis-flex habbit__item-day">
                <h4 class="habbit__day">Day ${Number(index) + 1}</h4>
              </div>

              <div class="habbit__item-desc grid">
                <h4 class="habbit__item-comment">${
                  activeHabbit.days[index].comment
                }</h4>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="delete"
				  alt="удалите день ${index + 1}"
                >
                  <path
                    d="M18 6V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V6M15 6V5C15 3.89543 14.1046 3 13 3H11C9.89543 3 9 3.89543 9 5V6M4 6H20M10 10V16M14 10V16"
                    stroke="#94A3BD"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>`;
    page.content.daysContainer.appendChild(element);
  }
  page.content.nextDay.innerHTML = `Day ${activeHabbit.days.length + 1}`;
}

// rerender function
function rerender(activeHabbitId) {
  globalActiveHabbitId = activeHabbitId;
  const activeHabbit = habbits.find((habbit) => {
    return habbit.id === activeHabbitId;
  });
  if (!activeHabbit) {
    return;
  }
  rerenderMenu(activeHabbit);
  rerenderHead(activeHabbit);
  rerenderContent(activeHabbit);
}

/* work with days */

function addDays(event) {
  const form = event.target;
  event.preventDefault();
  const data = new FormData(form);
  const comment = data.get("comment");
  form["comment"].classList.remove("error");
  if (!comment) {
    form["comment"].classList.add("error");
  }
  console.log(globalActiveHabbitId);
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment }]),
      };
    }
    return habbit;
  });
  form["comment"].value = "";
  saveData();
  rerender(globalActiveHabbitId);
}

// init
(() => {
  loadData();
  rerender(habbits[0].id);
})();
