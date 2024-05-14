export function chunkArrayInGroups<T>(arr: T[], size: number) {
  let result: T[][] = [];
  if (size === 0) {
    return result;
  }

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}
