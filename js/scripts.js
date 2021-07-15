"use strict";

// General
const buttons = document.querySelectorAll("button");
const events = document.querySelectorAll("[class|=\"filled\"]");
const tabs = document.querySelectorAll("[id]");

const url = window.location.origin + window.location.pathname;
const parameters = new URLSearchParams(window.location.search);

// Disable persistent scroll position across refreshes.
if ("scrollRestoration" in history) { history.scrollRestoration = "manual" };



// Tabs
let currentTab = "pr";
let scrollPosition = { pr: 0, cn: 0, en: 0 };
let initialResolve = false;

for (let i = 0; i < buttons.length; ++i) {
	buttons[i].addEventListener("click", switchTab);
};

function switchTab() {
	const previousTab = currentTab;
	currentTab = this.name;

	// Save scroll position of previous tab.
	scrollPosition[previousTab] = window.scrollY;

	// Switch selected tabs.
	document.querySelector(`button[name="${previousTab}"]`).classList.remove("selected");
	document.querySelector(`#${previousTab}`).classList.remove("selected");

	this.classList.add("selected");
	document.querySelector(`#${currentTab}`).classList.add("selected");

	// Restore scroll position of destination tab.
	window.scrollTo(0, scrollPosition[currentTab]);

	// Edit URL to match tab. Skip once if event parameter exists for initial resolve.
	if (initialResolve === true || !parameters.get("event")) {
		const newParams = (currentTab === "pr") ? "" : `?cal=${currentTab}`;
		window.history.replaceState({}, "", url + newParams);
	};

	initialResolve = true;
};



// Permalinks
// Resolve initial parameters if any.
if (parameters.get("cal")) {
	const p = parameters;

	const targetButton = document.querySelector(`button[name="${p.get("cal")}"]`);
	targetButton.click();

	if (p.get("event")) {
		const targetEvent = document.querySelector(`#${p.get("cal")} .${p.get("event")}`);
		targetEvent.scrollIntoView();
	};
};

// Set URL on middle click.
for (let i = 0; i < events.length; ++i) {
	events[i].addEventListener("mouseup", getPermalink);
	// Disable middle click scroll.
	events[i].addEventListener("mousedown", (e) => { if (e.button === 1) { e.preventDefault() } });
};

function getPermalink(e) {
	if (e.button === 1) {
		const newParams = `?cal=${currentTab}&event=${this.classList[1]}`;
		const newUrl = url + newParams;
		const targetEvents = document.querySelectorAll(`#${currentTab} .${this.classList[1]}`);

		// Copy to clipboard and replace URL.
		navigator.clipboard.writeText(newUrl);
		window.history.replaceState({}, "", newUrl);

		// Alert copy completion.
		for (let i = 0; i < targetEvents.length; ++i) {
			targetEvents[i].classList.add("copied");
			setTimeout(() => { targetEvents[i].classList.remove("copied") }, 2000);
		};
	};
};
