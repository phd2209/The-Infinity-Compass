/**
 * Test file for yearSeriesService calculations
 * Testing with Toni Habib Awwad (born 29 March 1975)
 *
 * Known values:
 * - Top diamond: 2 (birth day 29 -> 11 -> 2)
 * - Bottom diamond: 1 (from 19/1)
 * - Column number: 8 (from 17/8)
 */

import {
  calculateYearPeriods,
  determineYearType,
  getChartYearsForBirthYear,
} from './yearSeriesService';

const topDiamond = 2;
const bottomDiamond = 1;
const birthYear = 1975;
const columnNumber = 8; // Reduced value (from 17/8)

console.log('=== Testing Year Series Calculations for Toni Habib Awwad ===\n');

// Get chart years for column
const chartYears = getChartYearsForBirthYear(birthYear);
console.log('Chart years in column:', chartYears.map(e => `${e.year}-${e.value}`).join(', '));
console.log('');

// Test 2022 (regular - 7 periods)
console.log('--- 2022 (Regular - 7 periods) ---');
const type2022 = determineYearType(2022, chartYears);
console.log('Type:', type2022.type, 'Periods:', type2022.periodCount);
const result2022 = calculateYearPeriods(2022, topDiamond, bottomDiamond, birthYear, columnNumber);
console.log('Calculated:', result2022.numbers.map(n => n.display).join(', '));
console.log('Expected:   6, 2, 8, 1, 9, 2, 11/2');
console.log('');

// Test 2023 (regular - 7 periods)
console.log('--- 2023 (Regular - 7 periods) ---');
const type2023 = determineYearType(2023, chartYears);
console.log('Type:', type2023.type, 'Periods:', type2023.periodCount);
const result2023 = calculateYearPeriods(2023, topDiamond, bottomDiamond, birthYear, columnNumber);
console.log('Calculated:', result2023.numbers.map(n => n.display).join(', '));
console.log('Expected:   7, 2, 9, 1, 10/1, 3, 4');
console.log('');

// Test 2025 (before chart year - 11 periods)
console.log('--- 2025 (Before chart - 11 periods) ---');
const type2025 = determineYearType(2025, chartYears);
console.log('Type:', type2025.type, 'Periods:', type2025.periodCount);
const result2025 = calculateYearPeriods(2025, topDiamond, bottomDiamond, birthYear, columnNumber);
console.log('Calculated:', result2025.numbers.map(n => n.display).join(', '));
console.log('Expected:   9, 2, 11/2, 1, 3, 5, 8, 8, 16/7, 5, 12/3');
console.log('');

// Test 2026 (chart year with next - 15 periods)
console.log('--- 2026 (Chart with next - 15 periods) ---');
const type2026 = determineYearType(2026, chartYears);
console.log('Type:', type2026.type, 'Periods:', type2026.periodCount);
const result2026 = calculateYearPeriods(2026, topDiamond, bottomDiamond, birthYear, columnNumber);
console.log('Calculated:', result2026.numbers.map(n => n.display).join(', '));
console.log('Expected:   1, 2, 3, 1, 4, 5, 9, 1, 10/1, 1, 2, 8, 10/1, 6, 7');
console.log('');

// Test 2027 (chart year without next - 13 periods)
console.log('--- 2027 (Chart without next - 13 periods) ---');
const type2027 = determineYearType(2027, chartYears);
console.log('Type:', type2027.type, 'Periods:', type2027.periodCount);
const result2027 = calculateYearPeriods(2027, topDiamond, bottomDiamond, birthYear, columnNumber);
console.log('Calculated:', result2027.numbers.map(n => n.display).join(', '));
console.log('Expected:   2, 2, 4, 1, 5, 1, 6, 2, 8, 8, 16/7, 7, 14/5');
