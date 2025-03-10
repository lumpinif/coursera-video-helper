import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AutoSeekToTranscript } from "./components/AutoSeekToTranscript";
import { CopyTranscriptButton } from "./components/CopyTranscriptButton";
import { findElement } from "./utils/domUtils";
import { shouldInitialize } from "./utils/urlUtils";
import "./styles.css";

const TABLIST_SELECTORS = [
	'[role="tablist"][aria-label="Related lecture content tabs"]',
	'div[role="tablist"]',
	'[aria-label="Related lecture content tabs"][role="tablist"]',
];

const App: React.FC = () => {
	const [isTranscriptSelected, setIsTranscriptSelected] = useState(false);

	useEffect(() => {
		const checkTranscriptTab = () => {
			// Try multiple selectors to find the transcript tab
			const transcriptTab = document.querySelector(
				'[data-testid="lecture-transcript-tab"], [id*="tab-transcript"], [id^="cds-react-aria"][id$="-tab-transcript"]',
			);

			if (
				transcriptTab &&
				transcriptTab.getAttribute("aria-selected") === "true"
			) {
				console.log(
					`[Coursera Copilot] Found active transcript tab: ${transcriptTab.id}`,
				);
				setIsTranscriptSelected(true);
			} else {
				setIsTranscriptSelected(false);
			}
		};

		// Initial check
		checkTranscriptTab();

		// Create observer to watch for changes
		const observer = new MutationObserver(checkTranscriptTab);
		observer.observe(document.body, {
			attributes: true,
			subtree: true,
			attributeFilter: ["aria-selected"],
		});

		return () => observer.disconnect();
	}, []);

	return isTranscriptSelected ? <CopyTranscriptButton /> : null;
};

const init = async () => {
	console.log("[Coursera Copilot] Initializing extension...");

	// Skip initialization for unsupported pages
	if (!shouldInitialize(window.location.href)) {
		console.log(
			"[Coursera Copilot] Skipping initialization for unsupported page",
		);
		return;
	}

	// Initialize copy transcript button
	const existingButton = document.getElementById("coursera-copilot-button");
	if (existingButton) {
		console.log(
			"[Coursera Copilot] Button already exists, skipping initialization",
		);
		return;
	}

	const tablist = await findElement(TABLIST_SELECTORS);

	if (tablist) {
		console.log("[Coursera Copilot] Found tablist, injecting button...");

		const container = document.createElement("div");
		// Add Coursera's classes and make it behave like their tab items
		container.className = "contents cds-button-container css-zgpty rounded-md";
		container.setAttribute("role", "tab");
		container.setAttribute("id", "transcript-copy-button-container");
		tablist.appendChild(container);

		const root = createRoot(container);
		root.render(<App />);
		console.log("[Coursera Copilot] Button injected successfully");
	} else {
		console.warn("[Coursera Copilot] Could not find tablist");
	}

	// Initialize auto seek button
	const existingSeekButton = document.getElementById(
		"auto-seek-button-container",
	);
	if (existingSeekButton) return;

	const titleContainer = await findElement(["#video-item-title-and-save-note"]);
	if (titleContainer) {
		// Create a new grid item container for our button
		const seekGridItem = document.createElement("div");
		seekGridItem.style.display = "flex";
		seekGridItem.style.alignItems = "center";
		seekGridItem.style.justifyContent = "flex-end";
		seekGridItem.style.minWidth = "0";

		// Create our button container
		const seekButtonContainer = document.createElement("div");
		seekButtonContainer.id = "auto-seek-button-container";
		seekButtonContainer.className = "rc-CaptureHighlightButton";

		// Add button container to grid item
		seekGridItem.appendChild(seekButtonContainer);

		// Find title and save note containers
		const titleAndAttribution = titleContainer.querySelector(
			'div[data-testid="video-item-title-and-attribution"]',
		);
		const saveNoteGridItem = titleAndAttribution?.nextElementSibling;

		if (titleAndAttribution && saveNoteGridItem) {
			// Create wrapper for buttons
			const buttonWrapper = document.createElement("div");
			buttonWrapper.style.display = "flex";
			buttonWrapper.style.gap = "8px";
			buttonWrapper.style.alignItems = "center";
			buttonWrapper.style.justifyContent = "flex-end";
			buttonWrapper.style.minWidth = "0";

			// Insert our grid item and wrap it with save note button
			saveNoteGridItem.insertAdjacentElement("beforebegin", seekGridItem);
			seekGridItem.parentNode?.insertBefore(buttonWrapper, seekGridItem);
			buttonWrapper.appendChild(seekGridItem);
			buttonWrapper.appendChild(saveNoteGridItem);

			// Render our button
			const seekRoot = createRoot(seekButtonContainer);
			seekRoot.render(<AutoSeekToTranscript />);
			console.log("[Coursera Copilot] Auto seek button injected successfully");
		}
	}
};

// Initialize when DOM is ready
if (document.readyState === "loading") {
	console.log(
		"[Coursera Copilot] Document loading, waiting for DOMContentLoaded...",
	);
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}

// Re-initialize on URL changes
let lastUrl = window.location.href;
new MutationObserver(() => {
	const url = window.location.href;
	if (url !== lastUrl) {
		lastUrl = url;
		init();
	}
}).observe(document, { subtree: true, childList: true });
