"use strict";

document.addEventListener('DOMContentLoaded', () => {
	const buttons = document.querySelectorAll("button");
	const tabs = document.querySelectorAll("#pr, #cn, #en");

	for (let i = 0; i < buttons.length; ++i) {
		buttons[i].addEventListener('click', switchTab);
	};

	function switchTab() {
		for (let i = 0; i < buttons.length; ++i) {
			buttons[i].classList.remove("selected");
		};

		for (let i = 0; i < tabs.length; ++i) {
			tabs[i].classList.remove("selected");
		};

		this.classList.add("selected");
		document.getElementById(this.name).classList.add("selected");
	};
});
