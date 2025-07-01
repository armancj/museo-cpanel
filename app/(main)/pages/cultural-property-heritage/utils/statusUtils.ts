import { Status } from '../types';

/**
 * Utility function to automatically update the status of a field from "Pending" to "To Review"
 * when it's filled, but keep it as "Pending" if it's empty.
 *
 * @param value The current value of the field
 * @param currentStatus The current status of the field
 * @returns The new status (To Review if filled and was Pending, unchanged otherwise)
 */
export const getUpdatedStatus = (value: any, currentStatus: Status): Status => {
  // Only update status if it's currently Pending
  if (currentStatus !== Status.Pending) {
    return currentStatus;
  }

  // Check if the value is filled
  const isFilled = (() => {
    // Handle different value types
    if (value === null || value === undefined) {
      return false;
    }

    if (typeof value === 'string') {
      return value.trim() !== '';
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === 'object') {
      // For objects like dates or complex structures
      // Check if it's an empty object
      if (Object.keys(value).length === 0) {
        return false;
      }

      // For date ranges, check if at least one date is set
      if (value.start || value.end) {
        return true;
      }

      // For location objects, check if any field is filled
      const objectValues = Object.values(value);
      return objectValues.some(v =>
        (typeof v === 'string' && v.trim() !== '') ||
        (v !== null && v !== undefined)
      );
    }

    // For boolean values, consider them filled regardless of true/false
    if (typeof value === 'boolean') {
      return true;
    }

    // For numbers, consider them filled if not NaN
    if (typeof value === 'number') {
      return !isNaN(value);
    }

    return true;
  })();

  return isFilled ? Status.ToReview : Status.Pending;
};

export const getFieldStatus = (field: any): Status => {
    return field?.status || Status.Pending;
};

export const hasHistory = (field: any): boolean => {
    return field && field.history && Array.isArray(field.history) && field.history.length > 0;
};

