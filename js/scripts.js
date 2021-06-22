"use strict";

const buttons = document.querySelectorAll("button");
const tabs = document.querySelectorAll("[id]");
let currentTab = "pr";
let scrollPosition = { "pr": 0, "cn": 0, "en": 0 };

for (let i = 0; i < buttons.length; ++i) {
	buttons[i].addEventListener('click', switchTab);
};

function switchTab() {
	// Save scroll position of current tab
	scrollPosition[currentTab] = window.scrollY;
	// Set new current tab
	currentTab = this.name;
	// Scroll to saved position of new current tab
	window.scrollTo(0, scrollPosition[currentTab])

	for (let i = 0; i < buttons.length; ++i) {
		buttons[i].classList.remove("selected");
		tabs[i].classList.remove("selected");
	};

	this.classList.add("selected");
	document.querySelector("#" + this.name).classList.add("selected");
};
