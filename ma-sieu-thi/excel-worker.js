"use strict";

importScripts("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js");

self.addEventListener("message", (event) => {
	const { type, id, buffer } = event.data || {};
	if (type !== "parse-excel") {
		return;
	}

	try {
		const groupedStores = parseWorkbook(buffer);
		self.postMessage({
			id,
			ok: true,
			payload: { groupedStores },
		});
	} catch (error) {
		self.postMessage({
			id,
			ok: false,
			error: error && error.message ? error.message : String(error),
		});
	}
});

function parseWorkbook(arrayBuffer) {
	const workbook = XLSX.read(arrayBuffer, {
		type: "array",
		dense: true,
		cellFormula: false,
		cellHTML: false,
		cellStyles: false,
		cellText: false,
	});

	const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
	return groupRowsFromSheet(firstSheet);
}

function groupRowsFromSheet(sheet) {
	const sheetRange = sheet["!ref"];
	if (!sheetRange) {
		return [];
	}

	const range = XLSX.utils.decode_range(sheetRange);
	const map = new Map();

	for (let rowIndex = range.s.r + 1; rowIndex <= range.e.r; rowIndex += 1) {
		const store = sanitizeCell(getDenseCellValue(sheet, rowIndex, 0));
		const product = sanitizeCell(getDenseCellValue(sheet, rowIndex, 1));
		const qty = sanitizeCell(getDenseCellValue(sheet, rowIndex, 2));

		if (!store && !product && !qty) {
			continue;
		}

		if (!store) {
			continue;
		}

		if (!map.has(store)) {
			map.set(store, []);
		}

		map.get(store).push({ product, qty });
	}

	return Array.from(map.entries()).map(([store, items]) => ({ store, items }));
}

function getDenseCellValue(sheet, rowIndex, colIndex) {
	const row = sheet[rowIndex];
	if (!row) {
		return "";
	}

	const cell = row[colIndex];
	if (!cell) {
		return "";
	}

	return cell.v;
}

function sanitizeCell(value) {
	if (value === null || value === undefined) {
		return "";
	}
	return String(value).trim();
}
