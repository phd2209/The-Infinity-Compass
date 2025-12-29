/**
 * Year Series Calculation Service
 *
 * Handles the "Series of Years" numerology calculations for dynamic yearly forecasts.
 *
 * KEY CONCEPT: Your birth year determines which COLUMN you belong to.
 * Only years in YOUR column are "chart years" for you.
 * - Years NOT in your column → 7-period calculation
 * - Year BEFORE a chart year → 11-period calculation
 * - Chart year WITH next chart year following → 15-period calculation
 * - Chart year WITHOUT next chart year following → 13-period calculation
 */

interface YearEntry {
  year: number;
  value: number;
}

// Column 2 (3rd column - contains 1975, verified correct)
// TODO: Add other columns once we verify the calculation logic works
const COLUMN_2: YearEntry[] = [
  { year: 1906, value: 7 },
  { year: 1913, value: 5 },
  { year: 1918, value: 1 }, { year: 1919, value: 2 }, { year: 1921, value: 4 },
  { year: 1925, value: 8 },
  { year: 1933, value: 7 },
  { year: 1940, value: 5 },
  { year: 1945, value: 1 }, { year: 1946, value: 2 }, { year: 1948, value: 4 },
  { year: 1952, value: 8 },
  { year: 1960, value: 7 },
  { year: 1967, value: 5 },
  { year: 1972, value: 1 }, { year: 1973, value: 2 }, { year: 1975, value: 4 },
  { year: 1979, value: 8 },
  { year: 1987, value: 7 },
  { year: 1994, value: 5 },
  { year: 1999, value: 1 }, { year: 2000, value: 2 }, { year: 2002, value: 4 },
  { year: 2006, value: 8 },
  { year: 2014, value: 7 },
  { year: 2021, value: 5 },
  { year: 2026, value: 1 }, { year: 2027, value: 2 }, { year: 2029, value: 4 },
  { year: 2033, value: 8 },
  { year: 2041, value: 7 },
];

// Period date ranges for different period counts
type PeriodDateRange = [number, number, number, number]; // [startMonth, startDay, endMonth, endDay]

const PERIOD_7_DATES: PeriodDateRange[] = [
  [1, 1, 2, 21],    // Period 1: Jan 1 - Feb 21 (52 days)
  [2, 21, 4, 14],   // Period 2: Feb 21 - Apr 14
  [4, 14, 6, 6],    // Period 3: Apr 14 - Jun 6
  [6, 6, 7, 28],    // Period 4: Jun 6 - Jul 28
  [7, 28, 9, 18],   // Period 5: Jul 28 - Sep 18
  [9, 18, 11, 9],   // Period 6: Sep 18 - Nov 9
  [11, 9, 12, 31],  // Period 7: Nov 9 - Dec 31
];

const PERIOD_11_DATES: PeriodDateRange[] = [
  [1, 1, 2, 3],     // ~33-34 days each
  [2, 3, 3, 9],
  [3, 9, 4, 12],
  [4, 12, 5, 15],
  [5, 15, 6, 18],
  [6, 18, 7, 21],
  [7, 21, 8, 24],
  [8, 24, 9, 27],
  [9, 27, 10, 30],
  [10, 30, 12, 3],
  [12, 3, 12, 31],
];

const PERIOD_13_DATES: PeriodDateRange[] = [
  [1, 1, 1, 28],    // ~28 days each
  [1, 28, 2, 25],
  [2, 25, 3, 25],
  [3, 25, 4, 22],
  [4, 22, 5, 20],
  [5, 20, 6, 17],
  [6, 17, 7, 15],
  [7, 15, 8, 12],
  [8, 12, 9, 9],
  [9, 9, 10, 7],
  [10, 7, 11, 4],
  [11, 4, 12, 2],
  [12, 2, 12, 31],
];

const PERIOD_15_DATES: PeriodDateRange[] = [
  [1, 1, 1, 24],    // ~24-25 days each
  [1, 24, 2, 17],
  [2, 17, 3, 14],
  [3, 14, 4, 7],
  [4, 7, 5, 1],
  [5, 1, 5, 26],
  [5, 26, 6, 19],
  [6, 19, 7, 13],
  [7, 13, 8, 6],
  [8, 6, 8, 30],
  [8, 30, 9, 23],
  [9, 23, 10, 17],
  [10, 17, 11, 10],
  [11, 10, 12, 4],
  [12, 4, 12, 31],
];

/**
 * Reduce a number to single digit
 */
export const reduceNumber = (num: number): number => {
  while (num > 9) {
    let sum = 0;
    let temp = num;
    while (temp > 0) {
      sum += temp % 10;
      temp = Math.floor(temp / 10);
    }
    num = sum;
  }
  return num;
};

/**
 * Format number as compound if > 9 (e.g., 10 -> "10/1")
 */
export const formatCompound = (num: number): string => {
  if (num <= 9) return num.toString();
  return `${num}/${reduceNumber(num)}`;
};

/**
 * Get the chart years for a person's column
 * For now, only column 2 (containing 1975) is implemented
 */
export const getChartYearsForBirthYear = (birthYear: number): YearEntry[] => {
  // TODO: Implement column detection for all columns
  // For now, return column 2 if birth year is in it, empty otherwise
  if (COLUMN_2.some(e => e.year === birthYear)) {
    return COLUMN_2;
  }
  // Temporary: return column 2 for testing
  return COLUMN_2;
};

/**
 * Check if a year is a chart year for the given column
 */
export const isChartYear = (year: number, chartYears: YearEntry[]): boolean => {
  return chartYears.some(e => e.year === year);
};

/**
 * Get the value for a chart year
 */
export const getChartYearValue = (year: number, chartYears: YearEntry[]): number | null => {
  const entry = chartYears.find(e => e.year === year);
  return entry ? entry.value : null;
};

/**
 * Find the previous chart year and its value
 */
export const findPreviousChartYear = (year: number, chartYears: YearEntry[]): YearEntry | null => {
  const sorted = [...chartYears].sort((a, b) => b.year - a.year);
  return sorted.find(e => e.year < year) || null;
};

/**
 * Find the next chart year and its value
 */
export const findNextChartYear = (year: number, chartYears: YearEntry[]): YearEntry | null => {
  const sorted = [...chartYears].sort((a, b) => a.year - b.year);
  return sorted.find(e => e.year > year) || null;
};

/**
 * Calculate the year value (sum of digits reduced)
 */
export const calculateYearValue = (year: number): number => {
  const digits = year.toString().split('').map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  return reduceNumber(sum);
};

/**
 * Determine the year type and number of periods
 */
export type YearType = 'regular' | 'before_chart' | 'chart_with_next' | 'chart_without_next';

export const determineYearType = (year: number, chartYears: YearEntry[]): {
  type: YearType;
  periodCount: 7 | 11 | 13 | 15
} => {
  const isChart = isChartYear(year, chartYears);
  const nextChart = findNextChartYear(year, chartYears);

  if (!isChart) {
    // Check if next year is a chart year
    if (nextChart && nextChart.year === year + 1) {
      return { type: 'before_chart', periodCount: 11 };
    }
    return { type: 'regular', periodCount: 7 };
  } else {
    // It's a chart year - check if next chart year is immediately following
    if (nextChart && nextChart.year === year + 1) {
      return { type: 'chart_with_next', periodCount: 15 };
    }
    return { type: 'chart_without_next', periodCount: 13 };
  }
};

export interface PeriodNumber {
  value: number;
  display: string;
}

export interface YearPeriodCalculation {
  year: number;
  yearType: YearType;
  periodCount: 7 | 11 | 13 | 15;
  numbers: PeriodNumber[];
  periods: {
    number: PeriodNumber;
    startDate: string;
    endDate: string;
  }[];
}

/**
 * Calculate 7 period numbers for a regular year
 */
export const calculate7Periods = (
  year: number,
  topDiamond: number,
  bottomDiamond: number,
  birthYear: number
): PeriodNumber[] => {
  const n1 = calculateYearValue(year);
  const n2 = topDiamond;
  const n3 = reduceNumber(n2) + n1;
  const n4 = bottomDiamond;
  const n5 = reduceNumber(n3) + n4;
  const age = year - birthYear;
  const n6 = reduceNumber(age);
  const n7 = reduceNumber(n5) + n6;

  return [
    { value: n1, display: formatCompound(n1) },
    { value: n2, display: formatCompound(n2) },
    { value: n3, display: formatCompound(n3) },
    { value: n4, display: formatCompound(n4) },
    { value: n5, display: formatCompound(n5) },
    { value: n6, display: formatCompound(n6) },
    { value: n7, display: formatCompound(n7) },
  ];
};

/**
 * Calculate 11 period numbers for year before chart year
 * Note: columnNumber should be the REDUCED value (e.g., 8 from 17/8)
 */
export const calculate11Periods = (
  year: number,
  topDiamond: number,
  bottomDiamond: number,
  birthYear: number,
  columnNumber: number, // Reduced value (e.g., 8 from 17/8)
  exitValue: number
): PeriodNumber[] => {
  const n1 = calculateYearValue(year);
  const n2 = topDiamond;
  const n3 = n1 + n2;
  const n4 = bottomDiamond;
  const n5 = reduceNumber(n3) + n4;
  const n6 = exitValue;
  const n7 = reduceNumber(n5) + n6;
  const n8 = columnNumber;
  const n9 = reduceNumber(n7) + n8;
  const age = year - birthYear;
  const n10 = reduceNumber(age);
  const n11 = reduceNumber(n9) + n10;

  return [
    { value: n1, display: formatCompound(n1) },
    { value: n2, display: formatCompound(n2) },
    { value: n3, display: formatCompound(n3) },
    { value: n4, display: formatCompound(n4) },
    { value: n5, display: formatCompound(n5) },
    { value: n6, display: formatCompound(n6) },
    { value: n7, display: formatCompound(n7) },
    { value: n8, display: formatCompound(n8) },
    { value: n9, display: formatCompound(n9) },
    { value: n10, display: formatCompound(n10) },
    { value: n11, display: formatCompound(n11) },
  ];
};

/**
 * Calculate 13 period numbers for chart year without next chart year
 */
export const calculate13Periods = (
  year: number,
  topDiamond: number,
  bottomDiamond: number,
  birthYear: number,
  columnNumber: number,
  exitValue: number,
  enterValue: number
): PeriodNumber[] => {
  const n1 = calculateYearValue(year);
  const n2 = topDiamond;
  const n3 = n1 + n2;
  const n4 = bottomDiamond;
  const n5 = reduceNumber(n3) + n4;
  const n6 = exitValue;
  const n7 = reduceNumber(n5) + n6;
  const n8 = enterValue;
  const n9 = reduceNumber(n7) + n8;
  const n10 = columnNumber;
  const n11 = reduceNumber(n9) + n10;
  const age = year - birthYear;
  const n12 = reduceNumber(age);
  const n13 = reduceNumber(n11) + n12;

  return [
    { value: n1, display: formatCompound(n1) },
    { value: n2, display: formatCompound(n2) },
    { value: n3, display: formatCompound(n3) },
    { value: n4, display: formatCompound(n4) },
    { value: n5, display: formatCompound(n5) },
    { value: n6, display: formatCompound(n6) },
    { value: n7, display: formatCompound(n7) },
    { value: n8, display: formatCompound(n8) },
    { value: n9, display: formatCompound(n9) },
    { value: n10, display: formatCompound(n10) },
    { value: n11, display: formatCompound(n11) },
    { value: n12, display: formatCompound(n12) },
    { value: n13, display: formatCompound(n13) },
  ];
};

/**
 * Calculate 15 period numbers for chart year with next chart year
 */
export const calculate15Periods = (
  year: number,
  topDiamond: number,
  bottomDiamond: number,
  birthYear: number,
  columnNumber: number,
  exitValue: number,
  enterValue: number,
  exitAgainValue: number
): PeriodNumber[] => {
  const n1 = calculateYearValue(year);
  const n2 = topDiamond;
  const n3 = n1 + n2;
  const n4 = bottomDiamond;
  const n5 = reduceNumber(n3) + n4;
  const n6 = exitValue;
  const n7 = reduceNumber(n5) + n6;
  const n8 = enterValue;
  const n9 = reduceNumber(n7) + n8;
  const n10 = exitAgainValue;
  const n11 = reduceNumber(n9) + n10;
  const n12 = columnNumber;
  const n13 = reduceNumber(n11) + n12;
  const age = year - birthYear;
  const n14 = reduceNumber(age);
  const n15 = reduceNumber(n13) + n14;

  return [
    { value: n1, display: formatCompound(n1) },
    { value: n2, display: formatCompound(n2) },
    { value: n3, display: formatCompound(n3) },
    { value: n4, display: formatCompound(n4) },
    { value: n5, display: formatCompound(n5) },
    { value: n6, display: formatCompound(n6) },
    { value: n7, display: formatCompound(n7) },
    { value: n8, display: formatCompound(n8) },
    { value: n9, display: formatCompound(n9) },
    { value: n10, display: formatCompound(n10) },
    { value: n11, display: formatCompound(n11) },
    { value: n12, display: formatCompound(n12) },
    { value: n13, display: formatCompound(n13) },
    { value: n14, display: formatCompound(n14) },
    { value: n15, display: formatCompound(n15) },
  ];
};

/**
 * Get the period dates for a given period count
 */
export const getPeriodDates = (periodCount: 7 | 11 | 13 | 15, year: number): { start: string; end: string }[] => {
  let dates: PeriodDateRange[];

  switch (periodCount) {
    case 7: dates = PERIOD_7_DATES; break;
    case 11: dates = PERIOD_11_DATES; break;
    case 13: dates = PERIOD_13_DATES; break;
    case 15: dates = PERIOD_15_DATES; break;
  }

  return dates.map(([sm, sd, em, ed]) => ({
    start: `${year}-${String(sm).padStart(2, '0')}-${String(sd).padStart(2, '0')}`,
    end: `${year}-${String(em).padStart(2, '0')}-${String(ed).padStart(2, '0')}`
  }));
};

/**
 * Main function: Calculate year periods for a person
 */
export const calculateYearPeriods = (
  year: number,
  topDiamond: number,
  bottomDiamond: number,
  birthYear: number,
  columnNumber: number
): YearPeriodCalculation => {
  const chartYears = getChartYearsForBirthYear(birthYear);
  const { type, periodCount } = determineYearType(year, chartYears);

  let numbers: PeriodNumber[];

  switch (type) {
    case 'regular': {
      numbers = calculate7Periods(year, topDiamond, bottomDiamond, birthYear);
      break;
    }
    case 'before_chart': {
      const prevChart = findPreviousChartYear(year, chartYears);
      const exitValue = prevChart?.value ?? 0;
      numbers = calculate11Periods(year, topDiamond, bottomDiamond, birthYear, columnNumber, exitValue);
      break;
    }
    case 'chart_without_next': {
      const prevChart = findPreviousChartYear(year, chartYears);
      const exitValue = prevChart?.value ?? 0;
      const enterValue = getChartYearValue(year, chartYears) ?? 0;
      numbers = calculate13Periods(year, topDiamond, bottomDiamond, birthYear, columnNumber, exitValue, enterValue);
      break;
    }
    case 'chart_with_next': {
      const prevChart = findPreviousChartYear(year, chartYears);
      const exitValue = prevChart?.value ?? 0;
      const enterValue = getChartYearValue(year, chartYears) ?? 0;
      const exitAgainValue = enterValue; // Same as enter value
      numbers = calculate15Periods(year, topDiamond, bottomDiamond, birthYear, columnNumber, exitValue, enterValue, exitAgainValue);
      break;
    }
  }

  const periodDates = getPeriodDates(periodCount, year);
  const periods = numbers.map((num, i) => ({
    number: num,
    startDate: periodDates[i].start,
    endDate: periodDates[i].end
  }));

  return {
    year,
    yearType: type,
    periodCount,
    numbers,
    periods
  };
};

/**
 * Get the current period index for a given date
 */
export const getCurrentPeriodIndex = (date: Date, periodCount: 7 | 11 | 13 | 15): number => {
  const year = date.getFullYear();
  const periods = getPeriodDates(periodCount, year);

  for (let i = 0; i < periods.length; i++) {
    const endDate = new Date(periods[i].end);
    if (date <= endDate) {
      return i;
    }
  }

  return periods.length - 1;
};

/**
 * Get interpretation for a period number (basic titles)
 */
export const getPeriodTitle = (value: number): string => {
  const reduced = reduceNumber(value);
  const titles: Record<number, string> = {
    1: 'The Leader',
    2: 'The Harmonizer',
    3: 'The Creator',
    4: 'The Builder',
    5: 'The Freedom Seeker',
    6: 'The Nurturer',
    7: 'The Seeker',
    8: 'The Powerhouse',
    9: 'The Completer'
  };
  return titles[reduced] || 'Unknown';
};
