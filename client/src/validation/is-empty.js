//implied return of true is it is empty
const isEmptyAG = value =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof valu === "string" && value.trim().length === 0);

export default isEmptyAG;
