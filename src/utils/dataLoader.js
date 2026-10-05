import Papa from 'papaparse';

/**
 * Validates a single row from the CSV.
 * Rules:
 * - hub_id: unique non-empty string
 * - numeric fields valid and finite (latitude, longitude, package_count, avg_dwell_hours, median_dwell_hours)
 * - package_count: non-negative integer
 * - latitude: between -90 and 90
 * - longitude: between -180 and 180 (geographic coordinate bounds)
 * - zero coordinates (0, 0) remain valid
 */
export function validateAndParseHubRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('Data CSV kosong atau tidak memiliki baris data operasional.');
  }

  const seenHubIds = new Set();
  const validatedHubs = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // header is row 1

    const rawId = row.hub_id !== undefined && row.hub_id !== null ? String(row.hub_id).trim() : '';
    if (!rawId) {
      throw new Error(`Baris ${rowNum}: ID Hub (hub_id) tidak boleh kosong.`);
    }

    if (seenHubIds.has(rawId)) {
      throw new Error(`Baris ${rowNum}: ID Hub '${rawId}' duplikat. Setiap hub_id harus unik.`);
    }
    seenHubIds.add(rawId);

    const rawName = row.hub_name !== undefined && row.hub_name !== null ? String(row.hub_name).trim() : '';
    if (!rawName) {
      throw new Error(`Baris ${rowNum}: Nama Hub (hub_name) tidak boleh kosong pada ID '${rawId}'.`);
    }

    // Verify all required numeric fields exist and are finite numbers
    const numericFields = ['latitude', 'longitude', 'package_count', 'avg_dwell_hours', 'median_dwell_hours'];
    for (const field of numericFields) {
      const val = row[field];
      if (val === undefined || val === null || String(val).trim() === '') {
        throw new Error(`Baris ${rowNum}: Field numerik '${field}' tidak boleh kosong pada hub '${rawId}'.`);
      }
      const num = Number(val);
      if (!Number.isFinite(num)) {
        throw new Error(`Baris ${rowNum}: Field numerik '${field}' harus berupa angka valid dan finite pada hub '${rawId}'.`);
      }
    }

    const lat = Number(row.latitude);
    const lng = Number(row.longitude);
    const pkgCount = Number(row.package_count);
    const avgDwell = Number(row.avg_dwell_hours);
    const medianDwell = Number(row.median_dwell_hours);

    // Validate latitude (-90 to 90)
    if (lat < -90 || lat > 90) {
      throw new Error(`Baris ${rowNum}: Latitude harus antara -90 dan 90 (diterima: ${lat}) pada hub '${rawId}'.`);
    }

    // Validate longitude (-180 to 180), including the Indonesian hubs in this dataset.
    if (lng < -180 || lng > 180) {
      throw new Error(`Baris ${rowNum}: Longitude harus antara -180 dan 180 (diterima: ${lng}) pada hub '${rawId}'.`);
    }

    // Validate package_count (non-negative integer)
    if (!Number.isInteger(pkgCount) || pkgCount < 0) {
      throw new Error(`Baris ${rowNum}: package_count harus berupa bilangan bulat nonnegatif (diterima: ${row.package_count}) pada hub '${rawId}'.`);
    }

    // Validate dwell hours non-negative
    if (avgDwell < 0) {
      throw new Error(`Baris ${rowNum}: avg_dwell_hours tidak boleh negatif pada hub '${rawId}'.`);
    }
    if (medianDwell < 0) {
      throw new Error(`Baris ${rowNum}: median_dwell_hours tidak boleh negatif pada hub '${rawId}'.`);
    }

    // Determine priority: avg_dwell_hours >= 6.00
    const isPriority = avgDwell >= 6.0;

    validatedHubs.push({
      hub_id: rawId,
      hub_name: rawName,
      latitude: lat,
      longitude: lng,
      package_count: pkgCount,
      avg_dwell_hours: avgDwell,
      median_dwell_hours: medianDwell,
      is_priority: isPriority
    });
  }

  return validatedHubs;
}

/**
 * Fetches the CSV file, checks response.ok, and parses using Papa Parse with headers.
 */
export async function fetchAndParseHubs(csvUrl) {
  const response = await fetch(csvUrl);
  if (!response.ok) {
    throw new Error(`Gagal memuat file CSV dari ${csvUrl}: HTTP ${response.status} (${response.statusText || 'Gagal terhubung'})`);
  }

  const csvText = await response.text();
  if (!csvText || !csvText.trim()) {
    throw new Error('File data CSV kosong.');
  }

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          const firstErr = results.errors[0];
          return reject(new Error(`Kesalahan parsing CSV (baris ${firstErr.row}): ${firstErr.message}`));
        }
        try {
          const hubs = validateAndParseHubRows(results.data);
          resolve(hubs);
        } catch (valErr) {
          reject(valErr);
        }
      },
      error: (err) => {
        reject(new Error(`Kesalahan Papa Parse: ${err.message}`));
      }
    });
  });
}

/**
 * Formats a number with Indonesian locale (e.g. 10.000).
 */
export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '-';
  return Number(num).toLocaleString('id-ID');
}

/**
 * Formats dwell hours to 2 decimal places with explicit 'jam' unit.
 */
export function formatDwell(num) {
  if (num === null || num === undefined || isNaN(num)) return '- jam';
  return `${Number(num).toFixed(2)} jam`;
}

/**
 * Calculates global Top 3 hubs sorted descending by mean dwell (avg_dwell_hours).
 * Tie-breaker: hub_id ascending (alphabetical).
 */
export function getTop3Hubs(hubs) {
  return [...hubs]
    .sort((a, b) => {
      if (b.avg_dwell_hours !== a.avg_dwell_hours) {
        return b.avg_dwell_hours - a.avg_dwell_hours;
      }
      return a.hub_id.localeCompare(b.hub_id);
    })
    .slice(0, 3);
}

/**
 * Calculates Global KPIs:
 * - totalHubs
 * - totalPackages
 * - priorityCount
 * - priorityPercentage
 */
export function calculateGlobalKPI(hubs) {
  const totalHubs = hubs.length;
  const totalPackages = hubs.reduce((sum, h) => sum + h.package_count, 0);
  const priorityCount = hubs.filter(h => h.is_priority).length;
  const priorityPercentage = totalHubs > 0 ? Math.round((priorityCount / totalHubs) * 100) : 0;

  return {
    totalHubs,
    totalPackages,
    priorityCount,
    priorityPercentage
  };
}
