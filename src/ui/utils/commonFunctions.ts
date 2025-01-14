export const formatToYYYYMMDD = (date: any) => {
  const parsedDate = new Date(date);

  // Check if the parsed date is valid
  // if (isNaN(parsedDate):any) {
  //   console.error("Invalid date provided:", date);
  //   return "";
  // }

  // Format the date as yyyy-MM-dd
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const createFunctionWithParams = (func: Function, params: any) => {
  return () => func(...params);
};
