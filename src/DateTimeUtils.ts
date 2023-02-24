// returns current date in format: yyy-mm-dd
export const getCurrentDate = () => {
  const dateInit = new Date();
  const currentDate = dateInit.toISOString().split("T");
  return currentDate[0];
};

// returns month in format: MonthName yyyy
export const getMonth = (
  month: number | undefined,
  year: number | undefined
) => {
  let date = new Date();
  if (month && year) {
    date = new Date(year, month, 1);
  }
  return date.toLocaleString("default", { month: "long", year: "numeric" });
};

export const getMonthFromString = (monthAndYear: string) => {
  const dateParts = monthAndYear.split("-");
  const date = new Date(parseInt(dateParts[1]), parseInt(dateParts[0]) - 1, 1);

  return date.toLocaleString("default", { month: "long", year: "numeric" });
};
