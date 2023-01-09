import { BudgetModel } from "../models/BudgetModel";

export const buildDoughnutGraphData = (budgetInfo: BudgetModel | undefined) => {
  if (budgetInfo === undefined) {
    return {
      labels: ["Food", "Entertainment", "Savings", "Unallocated"],
      datasets: [
        {
          label: "$ Dollars",
          data: [123, 23, 34, 45],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  }

  const labels = ["Unallocated"];
  const data = [budgetInfo.monthlyVariableBudgetUnallocated];
  const backgroundColor = ["#4BC0C0"];

  for (const allocationKey of Object.keys(budgetInfo.monthlyAllocations)) {
    labels.push(allocationKey);
    data.push(budgetInfo.monthlyAllocations[allocationKey].allocation);
    backgroundColor.push(budgetInfo.monthlyAllocations[allocationKey].color);
  }

  return {
    labels: labels,
    datasets: [
      {
        label: "$ Dollars",
        data: data,
        backgroundColor: backgroundColor,
      },
    ],
  };
};
