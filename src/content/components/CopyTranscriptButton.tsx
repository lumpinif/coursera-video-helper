import React, { useState } from "react";
import { getTranscriptWithTimestamps } from "../utils/transcript";

export const CopyTranscriptButton: React.FC = () => {
	const [status, setStatus] = useState<
		"idle" | "copying" | "success" | "error"
	>("idle");

	const handleCopy = async () => {
		try {
			setStatus("copying");
			const transcript = await getTranscriptWithTimestamps();

			if (!transcript) {
				throw new Error("No transcript found");
			}

			await navigator.clipboard.writeText(transcript);
			setStatus("success");

			setTimeout(() => {
				setStatus("idle");
			}, 2000);
		} catch (error) {
			console.error("Failed to copy transcript:", error);
			setStatus("error");

			setTimeout(() => {
				setStatus("idle");
			}, 2000);
		}
	};

	return (
		<button
			id="coursera-copilot-button"
			className={`cds-105 cds-198 cds-200 css-1wjzt4f min-h-[48px] min-w-[44px] max-w-none overflow-visible text-left align-self-end px-2 py-3 mb-1 mr-6 opacity-100 font-[var(--cds-font-weight-600)] tracking-[var(--cds-letter-spacing-100)] whitespace-normal outline-none focus:outline-none focus:ring-0 transition-colors duration-200 ease-out rounded-md
      ${status === "idle" ? "bg-transparent hover:text-[var(--cds-color-interactive-primary-hover)] hover:bg-[var(--cds-color-interactive-background-primary-hover-weak)]" : ""}
      ${status === "copying" ? "bg-transparent text-[var(--cds-color-neutral-disabled)] cursor-not-allowed" : ""}
      ${status === "success" ? "bg-transparent text-[var(--cds-color-feedback-success)]" : ""}
      ${status === "error" ? "bg-transparent text-[var(--cds-color-feedback-error)]" : ""}`}
			onClick={handleCopy}
			disabled={status === "copying"}
			tabIndex={-1}
			type="button"
			aria-label="Copy transcript"
		>
			<span>
				{status === "idle" && "Copy transcript"}
				{status === "copying" && "Copying..."}
				{status === "success" && "Copied to clipboard ✅ "}
				{status === "error" && "Failed to copy"}
			</span>
		</button>
	);
};
