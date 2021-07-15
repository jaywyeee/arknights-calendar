"use strict";

// General
// Disable persistent scroll position across refreshes.
if ("scrollRestoration" in history) { history.scrollRestoration = "manual" };



// Tabs
const buttons = document.querySelectorAll("button");
const tabs = document.querySelectorAll("[id]");

let currentTab = "pr";
let scrollPosition = { "pr": 0, "cn": 0, "en": 0 };

let initialResolve = false;

for (let i = 0; i < buttons.length; ++i) {
	buttons[i].addEventListener("click", switchTab);
};

function switchTab() {
	// Save scroll position of previous tab.
	scrollPosition[currentTab] = window.scrollY;

	for (let i = 0; i < buttons.length; ++i) {
		buttons[i].classList.remove("selected");
		tabs[i].classList.remove("selected");
	};

	this.classList.add("selected");
	document.querySelector("#" + this.name).classList.add("selected");

	// Set current tab.
	currentTab = this.name;

	// Scroll to saved position of current tab.
	window.scrollTo(0, scrollPosition[currentTab]);

	// Edit URL to match tab. Skip once if event parameter exists for initial resolve.
	if (initialResolve === true || !params.get("event")) {
		const urlParams = (currentTab === "pr") ? "" : "?cal=" + currentTab;
		const newUrl = baseUrl + urlParams;

		window.history.replaceState({}, "", newUrl);
	};

	initialResolve = true;
};



// Permalinks
const baseUrl = window.location.origin + window.location.pathname;
const params = new URLSearchParams(window.location.search);
const events = document.querySelectorAll("[class|='filled']");

// Resolve initial parameters if any.
if (params.get("cal")) {
	const targetButton = document.querySelector(`button[name="${params.get("cal")}"]`);
	const targetEvent = document.querySelector(`#${params.get("cal")} .${params.get("event")}`);

	targetButton.click();
	if (targetEvent) { targetEvent.scrollIntoView() };
};

// Set URL on middle click.
for (let i = 0; i < events.length; ++i) {
	events[i].addEventListener("mouseup", getPermalink);
	// Disable middle click scroll.
	events[i].addEventListener("mousedown", (e) => { if (e.button === 1) return e.preventDefault() });
};

function getPermalink(e) {
	if (e.button === 1) {
		const urlParams = `?cal=${currentTab}&event=${this.classList[1]}`;
		const newUrl = baseUrl + urlParams;
		const targetEvents = document.querySelectorAll(`#${currentTab} .${this.classList[1]}`);

		// Copy to clipboard and replace URL.
		navigator.clipboard.writeText(newUrl);
		window.history.replaceState({}, "", newUrl);

		// Alert copy success.
		for (let i = 0; i < targetEvents.length; ++i) {
			targetEvents[i].classList.add("copied");
			setTimeout(() => { targetEvents[i].classList.remove("copied") }, 2000);
		};
	};
};
