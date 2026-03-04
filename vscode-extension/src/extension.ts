import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

interface HighlightRequest {
	file: string;
	start: number;
	end: number;
}

const HIGHLIGHT_FILE = path.join(os.homedir(), ".claude-highlight.json");

// Subtle gold/yellow background for highlighted ranges
const highlightDecoration = vscode.window.createTextEditorDecorationType({
	backgroundColor: "rgba(255, 213, 79, 0.18)",
	isWholeLine: true,
	overviewRulerColor: "rgba(255, 213, 79, 0.6)",
	overviewRulerLane: vscode.OverviewRulerLane.Center,
});

let fileWatcher: fs.StatWatcher | undefined;

export function activate(context: vscode.ExtensionContext): void {
	// Process any existing highlight file on activation
	processHighlightFile();

	// Watch for changes to the highlight file
	fileWatcher = fs.watchFile(
		HIGHLIGHT_FILE,
		{ interval: 300 },
		(curr, prev) => {
			if (curr.mtimeMs !== prev.mtimeMs) {
				processHighlightFile();
			}
		},
	);

	context.subscriptions.push({
		dispose: () => {
			if (fileWatcher) {
				fs.unwatchFile(HIGHLIGHT_FILE);
				fileWatcher = undefined;
			}
			highlightDecoration.dispose();
		},
	});
}

export function deactivate(): void {
	if (fileWatcher) {
		fs.unwatchFile(HIGHLIGHT_FILE);
		fileWatcher = undefined;
	}
}

async function processHighlightFile(): Promise<void> {
	let raw: string;
	try {
		raw = fs.readFileSync(HIGHLIGHT_FILE, "utf-8");
	} catch {
		// File doesn't exist yet or is unreadable -- nothing to do
		return;
	}

	let request: HighlightRequest;
	try {
		request = JSON.parse(raw);
	} catch {
		// Invalid JSON -- ignore silently
		return;
	}

	if (!request.file || typeof request.start !== "number" || typeof request.end !== "number") {
		return;
	}

	try {
		await highlightRange(request.file, request.start, request.end);
	} catch (err) {
		// Log but don't crash -- the file may reference a path that no longer exists
		console.error("[claude-explainer] Failed to highlight range:", err);
	}
}

async function highlightRange(
	filePath: string,
	startLine: number,
	endLine: number,
): Promise<void> {
	// Lines in VS Code are 0-indexed; the JSON uses 1-indexed line numbers
	const zeroStart = Math.max(0, startLine - 1);
	const zeroEnd = Math.max(zeroStart, endLine - 1);

	const uri = vscode.Uri.file(filePath);
	const doc = await vscode.workspace.openTextDocument(uri);
	const editor = await vscode.window.showTextDocument(doc, {
		preview: false,
		preserveFocus: false,
	});

	// Build range spanning the requested lines (decoration only, no text selection)
	const startPos = new vscode.Position(zeroStart, 0);
	const endPos = new vscode.Position(
		zeroEnd,
		doc.lineAt(zeroEnd).text.length,
	);
	const range = new vscode.Range(startPos, endPos);

	// Place cursor at start of range without selecting text
	editor.selection = new vscode.Selection(startPos, startPos);

	// Scroll to center the range in the viewport
	editor.revealRange(range, vscode.TextEditorRevealType.InCenter);

	// Apply the background decoration (clears any previous decoration first
	// because setDecorations replaces the existing set for this type)
	editor.setDecorations(highlightDecoration, [range]);
}
