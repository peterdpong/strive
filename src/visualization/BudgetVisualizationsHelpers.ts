import { BudgetEngineUtils } from "../engine/BudgetEngineUtils";
import { BudgetModel } from "../models/BudgetModel";
import { UserModel } from "../models/UserModel";

export const buildDoughnutGraphData = (budgetInfo: BudgetModel) => {
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

export const buildBudgetCategoryBarGraphData = (userData: UserModel) => {
  const userBudgetInfo = userData.budgetInfo;

  const labels = ["Non-budgetted spending"];
  const allocationData = [0];
  const backgroundColor = ["#4BC0C0"];

  for (const allocationKey of Object.keys(userBudgetInfo.monthlyAllocations)) {
    labels.push(allocationKey);
    allocationData.push(
      userBudgetInfo.monthlyAllocations[allocationKey].allocation
    );
    backgroundColor.push(
      userBudgetInfo.monthlyAllocations[allocationKey].color
    );
  }

  const userCurrentMonthTransactions =
    BudgetEngineUtils.getCurrentMonthTransactions(userData);

  // Note we do negative of amount since transactions of spending will be entered as a negative value
  const transactionData = new Array(labels.length).fill(0);
  for (const transaction of userCurrentMonthTransactions) {
    if (transaction.amount > 0) continue;

    const categoryIndex = labels.indexOf(
      transaction.category.toLocaleUpperCase()
    );
    if (categoryIndex !== -1) {
      transactionData[categoryIndex] += -transaction.amount;
    } else {
      transactionData[0] += -transaction.amount;
    }
  }

  return {
    labels: labels,
    datasets: [
      {
        labels: "",
        data: transactionData,
        backgroundColor: new Array(transactionData.length).fill(
          "rgba(224,43,20, 0.75)"
        ),
        borderWidth: 1,
      },
      {
        data: allocationData,
        backgroundColor: backgroundColor,
        borderWidth: 1,
        grouped: false,
      },
    ],
  };
};

export const buildDebtPayoffGraph = (
  paymentSchedule: {
    payment: number;
    interest: number;
    principal: number;
    balance: number;
  }[][],
  userData: UserModel
) => {
  let maxMonths = 0;

  const datasets = Object.values(userData.financialInfo.accounts.loans).map(
    (account, index) => {
      if (maxMonths < paymentSchedule[index].length)
        maxMonths = paymentSchedule[index].length;

      return {
        fill: true,
        label: account.name,
        data: paymentSchedule[index].map((obj) => obj.balance),
        borderColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
      };
    }
  );

  const xAxisLabels = Array.from(new Array(maxMonths + 1), (x, i) => i + 1);

  return {
    labels: xAxisLabels,
    datasets: datasets,
  };
};
