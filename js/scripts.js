"use strict";

// General
const url = window.location.origin + window.location.pathname;
let currentTab = "pr";

// Disable persistent scroll position across refreshes.
history.scrollRestoration = "manual";


// Tabs
const scrollPosition = { pr: 0, cn: 0, en: 0 };

document.querySelector("nav").addEventListener("click", switchTab);

function switchTab(e) {
	if (e.target.matches("button")) {
		const previousTab = currentTab;
		currentTab = e.target.name;

		// Save scroll position of previous tab.
		scrollPosition[previousTab] = window.scrollY;

		// Switch selected tabs.
		document.querySelector(`#${previousTab}`).classList.remove("selected");
		document.querySelector(`button[name="${previousTab}"]`).classList.remove("selected");

		document.querySelector(`#${currentTab}`).classList.add("selected");
		e.target.classList.add("selected");

		// Restore scroll position of destination tab.
		window.scrollTo(0, scrollPosition[currentTab]);

		// Edit URL to match tab.
		const newParams = (currentTab === "pr") ? "" : `?cal=${currentTab}`;
		window.history.replaceState({}, "", url + newParams);
	};
};


// Permalinks
const params = new URLSearchParams(window.location.search);

document.querySelector("main").addEventListener("click", getPermalink);

function getPermalink(e) {
	if (e.target.matches("[class|=\"filled\"]")) {
		const copyUrl = url + `?cal=${currentTab}&event=${e.target.classList[1]}`;
		const targetEvent = document.querySelectorAll(`#${currentTab} .${e.target.classList[1]}`);

		// Copy to clipboard.
		navigator.clipboard.writeText(copyUrl);

		// Alert copy completion.
		targetEvent.forEach((item) => {
			item.classList.add("copied");
			setTimeout(() => { item.classList.remove("copied") }, 2000);
		});
	};
};

// Resolve initial parameters if any.
if (params.get("cal")) {
	const targetButton = document.querySelector(`button[name="${params.get("cal")}"]`);
	targetButton.click();

	if (params.get("event")) {
		const targetEvent = document.querySelector(`#${params.get("cal")} .${params.get("event")}`);
		targetEvent.scrollIntoView();
	};
};
