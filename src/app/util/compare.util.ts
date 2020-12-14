/**
 * Compares two values for further sorting.
 * From the angular Material examples (src = https://material.angular.io/components/sort/overview)
 * @param a the first plan.
 * @param b the second plan.
 * @param isAsc whether the sort will be ascending or descending
 */
export function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

/**
 * Compares two dates for further sorting.
 * @param a the first date.
 * @param b the second date.
 * @param isAsc whether the sort will be ascending or descending
 */
export function compareDates(a: string, b: string, isAsc: boolean) {
  return compare((new Date(a)).getTime(), (new Date(b)).getTime(), isAsc);
}

/**
 * Compares two task states for further sorting.
 * @param a the first plan.
 * @param b the second plan.
 * @param isAsc whether the sort will be ascending or descending
 */
export function compareStates(a: boolean, b: boolean, isAsc: boolean) {
  return compare(a ? 1 : 0, b ? 1 : 0, isAsc);
}
