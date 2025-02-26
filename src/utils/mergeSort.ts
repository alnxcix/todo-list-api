import { Task } from "../models/Task";

// ** Utility function: Merge Sort **
export const mergeSort = (
  arr: Task[],
  key: keyof Task,
  order: "asc" | "desc"
): Task[] => {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), key, order);
  const right = mergeSort(arr.slice(mid), key, order);

  return merge(left, right, key, order);
};

// ** Merge function for Merge Sort **
export const merge = (
  left: Task[],
  right: Task[],
  key: keyof Task,
  order: "asc" | "desc"
): Task[] => {
  let result: Task[] = [];
  let i = 0,
    j = 0;

  while (i < left.length && j < right.length) {
    const leftValue = left[i][key]!;
    const rightValue = right[j][key]!;

    let condition: boolean;
    if (typeof leftValue === "string") {
      condition =
        order === "asc"
          ? leftValue.localeCompare(rightValue as string) < 0
          : leftValue.localeCompare(rightValue as string) > 0;
    } else {
      condition =
        order === "asc" ? leftValue < rightValue : leftValue > rightValue;
    }

    if (condition) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  return [...result, ...left.slice(i), ...right.slice(j)];
};
