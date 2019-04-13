//implied return of true if it is empty
const isEmptyAG = value =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

export default isEmptyAG;
