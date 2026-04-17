"use strict";

const appConfig = window.APP_CONFIG;
const limits = appConfig.limits;
const labels = appConfig.labels;
const messages = appConfig.messages;
const tableConfig = appConfig.table;
const printConfig = appConfig.print;

const DEFAULT_MAX_ROWS = limits.defaultMaxRowsPerTable;
const DEFAULT_FONT_SIZE = limits.defaultFontSize;
const MIN_FONT_SIZE = limits.minFontSize;
const MAX_FONT_SIZE = limits.maxFontSize;
const MIN_ROWS_PER_TABLE = limits.minRowsPerTable;
const MAX_ROWS_PER_TABLE = limits.maxRowsPerTable;
const DOWNLOAD_FILE_NAME = printConfig.downloadFileName;

const excelFileInput = document.getElementById("excelFile");
const orientationSelect = document.getElementById("orientation");
const maxRowsInput = document.getElementById("maxRows");
const fontSizeInput = document.getElementById("fontSize");
const statusEl = document.getElementById("status");
const statsEl = document.getElementById("stats");
const previewMetaEl = document.getElementById("previewMeta");
const previewFrame = document.getElementById("previewFrame");
const generateBtn = document.getElementById("btnGenerate");
const printBtn = document.getElementById("btnPrint");
const downloadBtn = document.getElementById("btnDownload");
const labelEyebrowEl = document.getElementById("labelEyebrow");
const labelMainTitleEl = document.getElementById("labelMainTitle");
const labelSubtitleEl = document.getElementById("labelSubtitle");
const labelExcelFileEl = document.getElementById("labelExcelFile");
const labelOrientationEl = document.getElementById("labelOrientation");
const labelMaxRowsEl = document.getElementById("labelMaxRows");
const labelFontSizeEl = document.getElementById("labelFontSize");
const labelPreviewTitleEl = document.getElementById("labelPreviewTitle");
const optionLandscapeEl = document.getElementById("optionLandscape");
const optionPortraitEl = document.getElementById("optionPortrait");

let groupedStores = [];
let generatedHtml = "";
let isPreviewReady = false;
let parserWorker = null;
let workerRequestId = 0;
const pendingWorkerRequests = new Map();

document.title = labels.appTitle;
labelEyebrowEl.textContent = labels.eyebrow;
labelMainTitleEl.textContent = labels.mainTitle;
labelSubtitleEl.textContent = labels.subtitle;
labelExcelFileEl.textContent = labels.excelFileLabel;
labelOrientationEl.textContent = labels.orientationLabel;
labelMaxRowsEl.textContent = labels.maxRowsLabel;
labelFontSizeEl.textContent = labels.fontSizeLabel;
labelPreviewTitleEl.textContent = labels.previewTitle;
optionLandscapeEl.textContent = labels.optionLandscape;
optionPortraitEl.textContent = labels.optionPortrait;
generateBtn.textContent = labels.buttonGenerate;
printBtn.textContent = labels.buttonPrint;
downloadBtn.textContent = labels.buttonDownload;
previewFrame.title = labels.previewFrameTitle;
maxRowsInput.value = String(DEFAULT_MAX_ROWS);
maxRowsInput.min = String(MIN_ROWS_PER_TABLE);
maxRowsInput.max = String(MAX_ROWS_PER_TABLE);
fontSizeInput.value = String(DEFAULT_FONT_SIZE);
fontSizeInput.min = String(MIN_FONT_SIZE);
fontSizeInput.max = String(MAX_FONT_SIZE);
statusEl.textContent = labels.defaultStatus;
previewMetaEl.textContent = labels.emptyPreview;

excelFileInput.addEventListener("change", handleFilePick);
generateBtn.addEventListener("click", handleGenerate);
printBtn.addEventListener("click", handlePrint);
downloadBtn.addEventListener("click", handleDownload);
previewFrame.addEventListener("load", () => {
	isPreviewReady = Boolean(generatedHtml);
	printBtn.disabled = !isPreviewReady;
});
window.addEventListener("beforeunload", terminateParserWorker);

function updateStatus(message, tone = "neutral") {
	statusEl.textContent = message;
	statusEl.style.color = tone === "error" ? "#b91c1c" : tone === "ok" ? "#047857" : "#64748b";
}

function interpolate(template, params) {
	return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(params[key]));
}

function getParserWorker() {
	if (parserWorker) {
		return parserWorker;
	}

	parserWorker = new Worker("excel-worker.js");
	parserWorker.addEventListener("message", handleWorkerMessage);
	parserWorker.addEventListener("error", handleWorkerError);
	return parserWorker;
}

function terminateParserWorker() {
	if (!parserWorker) {
		return;
	}

	parserWorker.terminate();
	parserWorker = null;
}

function handleWorkerMessage(event) {
	const { id, ok, payload, error } = event.data || {};
	const pending = pendingWorkerRequests.get(id);
	if (!pending) {
		return;
	}

	pendingWorkerRequests.delete(id);
	if (ok) {
		pending.resolve(payload.groupedStores);
		return;
	}

	pending.reject(new Error(error || "Worker parse error"));
}

function handleWorkerError(event) {
	const error = new Error(event.message || "Worker runtime error");
	for (const pending of pendingWorkerRequests.values()) {
		pending.reject(error);
	}
	pendingWorkerRequests.clear();
	terminateParserWorker();
}

function parseExcelInWorker(arrayBuffer) {
	const worker = getParserWorker();
	const requestId = ++workerRequestId;

	return new Promise((resolve, reject) => {
		pendingWorkerRequests.set(requestId, { resolve, reject });
		worker.postMessage(
			{
				type: "parse-excel",
				id: requestId,
				buffer: arrayBuffer,
			},
			[arrayBuffer]
		);
	});
}

async function handleFilePick(event) {
	const file = event.target.files[0];
	groupedStores = [];
	generatedHtml = "";
	isPreviewReady = false;
	printBtn.disabled = true;
	downloadBtn.disabled = true;
	generateBtn.disabled = true;
	previewFrame.srcdoc = "";

	if (!file) {
		updateStatus(messages.fileNotSelected);
		renderStats();
		return;
	}

	try {
		updateStatus(messages.readingExcel);
		const data = await file.arrayBuffer();
		groupedStores = await parseExcelInWorker(data);

		renderStats();

		if (groupedStores.length === 0) {
			updateStatus(messages.invalidData, "error");
			return;
		}

		generateBtn.disabled = false;
		updateStatus(interpolate(messages.loadSuccess, { count: groupedStores.length }), "ok");
	} catch (err) {
		console.error(err);
		updateStatus(interpolate(messages.readFileError, { error: err.message }), "error");
	}
}

function splitStoreTables(stores, maxRows) {
	const tables = [];

	stores.forEach((entry) => {
		if (entry.items.length === 0) {
			tables.push({ store: entry.store, items: [] });
			return;
		}

		for (let i = 0; i < entry.items.length; i += maxRows) {
			const chunk = entry.items.slice(i, i + maxRows);
			const label = i === 0 ? entry.store : `${entry.store} ${tableConfig.continuationSuffix}`;
			tables.push({ store: label, items: chunk });
		}
	});

	return tables;
}

function estimateRowsPerPage(orientation, maxRows, fontSize) {
	const pageHeightMm = orientation === "portrait" ? 297 : 210;
	const marginMm = 8;
	const gapMm = 6;
	const usableHeightMm = pageHeightMm - marginMm * 2;

	const rowHeightMm = Math.max(4.3, fontSize * 0.34 + 1.4);
	const tableHeightMm = rowHeightMm * (maxRows + 1);

	if (tableHeightMm * 2 + gapMm <= usableHeightMm) {
		return 2;
	}
	return 1;
}

function buildPrintHtml(grouped, options) {
	const orientation = options.orientation === "portrait" ? "portrait" : "landscape";
	const maxRows = options.maxRows;
	const fontSize = options.fontSize;

	const tables = splitStoreTables(grouped, maxRows);
	const rowsPerPage = estimateRowsPerPage(orientation, maxRows, fontSize);
	const tablesPerPage = rowsPerPage === 2 ? 4 : 2;

	const pages = [];
	for (let i = 0; i < tables.length; i += tablesPerPage) {
		pages.push(tables.slice(i, i + tablesPerPage));
	}

	const style = `
<style>
	@page { size: ${printConfig.paperSize} ${orientation}; margin: 8mm; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: "Segoe UI", Arial, sans-serif;
    color: #111827;
  }
  .sheet {
    display: grid;
    grid-template-rows: 1fr auto;
    min-height: ${orientation === "portrait" ? "280mm" : "193mm"};
    page-break-after: always;
  }
  .sheet:last-child { page-break-after: auto; }
  .tables {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: ${rowsPerPage === 2 ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)"};
    gap: 6mm;
    align-content: start;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }
  th, td {
    border: 1px solid #111;
    padding: 2px 3px;
    text-align: center;
    font-size: ${fontSize}px;
    line-height: 1.2;
    height: ${Math.max(16, Math.round(fontSize * 1.5))}px;
  }
  th {
    background: #ececec;
    font-weight: 700;
  }
  td.left {
    text-align: left;
  }
  th:nth-child(1), td:nth-child(1) { width: 21%; }
  th:nth-child(2), td:nth-child(2) { width: 57%; }
  th:nth-child(3), td:nth-child(3) { width: 22%; }
  .page-number {
    text-align: center;
    padding-top: 3mm;
    font-size: ${Math.max(fontSize - 1, 9)}px;
    color: #374151;
  }
</style>`;

	const pagesHtml = pages.map((pageTables, pageIndex) => {
		const rendered = pageTables.map((table) => renderTable(table, maxRows)).join("");
		const pageText = interpolate(tableConfig.pageNumberPattern, {
			page: pageIndex + 1,
			total: pages.length,
		});
		return `<section class="sheet"><div class="tables">${rendered}</div><div class="page-number">${pageText}</div></section>`;
	}).join("");

	return `<!doctype html><html><head><meta charset="utf-8"><title>${printConfig.documentTitle}</title>${style}</head><body>${pagesHtml}</body></html>`;
}

function renderTable(table, maxRows) {
	const escapedStore = escapeHtml(table.store);
	const [storeHeader, productHeader, quantityHeader] = tableConfig.headers;
	let rows = `<tr><th>${escapeHtml(storeHeader)}</th><th>${escapeHtml(productHeader)}</th><th>${escapeHtml(quantityHeader)}</th></tr>`;

	for (let i = 0; i < maxRows; i += 1) {
		if (i < table.items.length) {
			const item = table.items[i];
			rows += `<tr><td>${escapedStore}</td><td class="left">${escapeHtml(item.product)}</td><td>${escapeHtml(item.qty)}</td></tr>`;
		} else {
			rows += "<tr><td>&nbsp;</td><td class=\"left\">&nbsp;</td><td>&nbsp;</td></tr>";
		}
	}

	return `<table>${rows}</table>`;
}

function escapeHtml(value) {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function handleGenerate() {
	if (groupedStores.length === 0) {
		updateStatus(messages.needExcelData, "error");
		return;
	}

	const options = {
		orientation: orientationSelect.value,
		maxRows: Number.parseInt(maxRowsInput.value, 10),
		fontSize: Number.parseInt(fontSizeInput.value, 10),
	};

	if (!Number.isInteger(options.maxRows) || options.maxRows < MIN_ROWS_PER_TABLE || options.maxRows > MAX_ROWS_PER_TABLE) {
		updateStatus(
			interpolate(messages.maxRowsOutOfRange, {
				min: MIN_ROWS_PER_TABLE,
				max: MAX_ROWS_PER_TABLE,
			}),
			"error"
		);
		return;
	}

	if (!Number.isInteger(options.fontSize) || options.fontSize < MIN_FONT_SIZE || options.fontSize > MAX_FONT_SIZE) {
		updateStatus(
			interpolate(messages.fontSizeOutOfRange, {
				min: MIN_FONT_SIZE,
				max: MAX_FONT_SIZE,
			}),
			"error"
		);
		return;
	}

	generatedHtml = buildPrintHtml(groupedStores, options);
	isPreviewReady = false;
	printBtn.disabled = true;
	previewFrame.srcdoc = generatedHtml;

	const rowsPerPage = estimateRowsPerPage(options.orientation, options.maxRows, options.fontSize);
	const modeLabel = rowsPerPage === 2 ? labels.modeFourTables : labels.modeTwoTables;
	const orientationLabel = options.orientation === "portrait" ? labels.orientationPortrait : labels.orientationLandscape;

	previewMetaEl.textContent = interpolate(labels.previewMetaPattern, {
		mode: modeLabel,
		orientation: orientationLabel,
		rows: options.maxRows,
		fontSize: options.fontSize,
	});
	downloadBtn.disabled = false;
	updateStatus(messages.previewReady, "ok");
}

function handlePrint() {
	if (!generatedHtml) {
		updateStatus(messages.printWithoutPreview, "error");
		return;
	}

	const printWindow = previewFrame.contentWindow;
	if (!printWindow) {
		updateStatus(messages.printWindowError, "error");
		return;
	}

	printWindow.focus();
	printWindow.print();
	updateStatus(messages.printDialogOpened, "ok");
}

function handleDownload() {
	if (!generatedHtml) {
		updateStatus(messages.downloadWithoutPreview, "error");
		return;
	}

	const blob = new Blob([generatedHtml], { type: "text/html;charset=utf-8" });
	const link = document.createElement("a");
	const url = URL.createObjectURL(blob);
	link.href = url;
	link.download = DOWNLOAD_FILE_NAME;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
	updateStatus(messages.downloadSuccess, "ok");
}

function renderStats() {
	if (groupedStores.length === 0) {
		statsEl.innerHTML = "";
		previewMetaEl.textContent = labels.emptyPreview;
		return;
	}

	const storeCount = groupedStores.length;
	const itemCount = groupedStores.reduce((sum, store) => sum + store.items.length, 0);
	const maxStore = groupedStores.reduce((max, store) => Math.max(max, store.items.length), 0);

	statsEl.innerHTML = [
		`<li><strong>${storeCount}</strong><br>${escapeHtml(labels.statsStoreCount)}</li>`,
		`<li><strong>${itemCount}</strong><br>${escapeHtml(labels.statsItemCount)}</li>`,
		`<li><strong>${maxStore}</strong><br>${escapeHtml(labels.statsMaxRows)}</li>`
	].join("");
}
