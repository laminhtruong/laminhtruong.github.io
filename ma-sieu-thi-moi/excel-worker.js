"use strict";

importScripts("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js");

self.addEventListener("message", (event) => {
	const { type, id, buffer } = event.data || {};
	if (type !== "parse-excel") {
		return;
	}

	try {
		const parsed = parseWorkbook(buffer);
		self.postMessage({
			id,
			ok: true,
			payload: parsed,
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
	return {
		headMeta: {
			name: sanitizeCell(getDenseCellValue(firstSheet, 0, 0)),
			date: readHeaderDate(firstSheet),
		},
		groupedStores: groupRowsFromSheet(firstSheet),
	};
}

function readHeaderDate(sheet) {
	const b1Date = extractDateOnly(getDenseCellValue(sheet, 0, 1));
	if (b1Date) {
		return b1Date;
	}

	const sheetRange = sheet["!ref"];
	if (!sheetRange) {
		return "";
	}

	const range = XLSX.utils.decode_range(sheetRange);
	const endRow = Math.min(range.e.r, range.s.r + 5);
	const endCol = Math.min(range.e.c, range.s.c + 5);

	for (let rowIndex = range.s.r; rowIndex <= endRow; rowIndex += 1) {
		for (let colIndex = range.s.c; colIndex <= endCol; colIndex += 1) {
			if (rowIndex === 0 && colIndex === 0) {
				continue;
			}

			const date = extractDateOnly(getDenseCellValue(sheet, rowIndex, colIndex));
			if (date) {
				return date;
			}
		}
	}

	return "";
}

function extractDateOnly(value) {
	if (value === null || value === undefined || value === "") {
		return "";
	}

	if (typeof value === "number" && Number.isFinite(value)) {
		const parsed = XLSX.SSF.parse_date_code(value);
		if (parsed && parsed.y && parsed.m && parsed.d) {
			return `${parsed.d}.${parsed.m}.${parsed.y}`;
		}
	}

	const source = String(value).trim();
	const patterns = [
		/(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/,
		/(\d{4}[./-]\d{1,2}[./-]\d{1,2})/,
	];

	for (const pattern of patterns) {
		const match = source.match(pattern);
		if (match) {
			return match[1];
		}
	}

	return "";
}

function groupRowsFromSheet(sheet) {
	const sheetRange = sheet["!ref"];
	if (!sheetRange) {
		return [];
	}

	const range = XLSX.utils.decode_range(sheetRange);
	const map = new Map();

	for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex += 1) {
		const store = sanitizeCell(getDenseCellValue(sheet, rowIndex, 0));
		const product = sanitizeCell(getDenseCellValue(sheet, rowIndex, 1));
		const qty = sanitizeCell(getDenseCellValue(sheet, rowIndex, 2));
		const kg = sanitizeCell(getDenseCellValue(sheet, rowIndex, 5));

		if (!store && !product && !qty && !kg) {
			continue;
		}

		if (!isStoreCode(store)) {
			continue;
		}

		if (!map.has(store)) {
			map.set(store, []);
		}

		map.get(store).push({ product, qty, kg });
	}

	return Array.from(map.entries()).map(([store, items]) => ({ store, items }));
}

function isStoreCode(value) {
	const normalized = value.replace(/\.0+$/, "").trim();
	return /^\d+$/.test(normalized);
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
