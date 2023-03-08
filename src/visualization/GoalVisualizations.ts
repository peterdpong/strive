import { ScriptableContext } from "chart.js";
import { networkInterfaces } from "os";

// Holds all budget optimization functions
//import { GoalModel } from "../models/GoalModel";
import { UserModel } from "../models/UserModel";


export const goalGraphOptions = {
  scales: {
    x: {
      title: {
        display: true,
        text: 'Timeline Period',
      }
    },
    y: {
      title: {
        display: true,
        text: 'Net Worth',
      }
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Net worth goal visualization",
    }
  },
};

export const buildGoalGraphData = (
  userInfo: 
    {
      userData: UserModel | null,
      //savingsData: GoalModel | null,
      goalNetWorth: number,
      goalTimeline: number
    }
  // selectedGoal:
  //   {
  //     monthlyAmount: number;
  //     networthGoal: number;
  //     timelineGoal: number;
  //   }
  //   | undefined
) => {
  // if (selectedGoal === undefined) return null;

  if (userInfo.userData == null) {
    return undefined;
  }

  // if (selectedGoal == null) {
  //   return undefined;
  // }

  // Year timeline labels -> from 1 to timelineGoal
  const xAxisLabels = Array.from(
    new Array(userInfo.goalTimeline*12), //converted goalTimeline in years to months
    (x, i) => i
  );

  // Current net worth generation
  //total assets
  //goal timeline is in number of years

  //bank accounts
  let bankAcctTotal = 0;

    Object.values(userInfo.userData.financialInfo.accounts.bankAccounts).map(
      (account) => {
        bankAcctTotal += account.value;
      }
    );

  //fixed investments
  let fixedInvTotal = 0;

    Object.values(userInfo.userData.financialInfo.accounts.fixedInvestments).map(
      (account) => {
        fixedInvTotal += account.startingValue;
      }
    );

  //other assets
  let houseTotal = 0;
  let vehicleTotal = 0;
  let collectiblesTotal = 0;
  let artTotal = 0;
  let valuablesTotal = 0;

    Object.values(userInfo.userData.financialInfo.accounts.otherAssets).map(
      (account) => {
        if (account.type == "House") {
          houseTotal += account.value;
        } else if (account.type == "Vehicle") {
          vehicleTotal += account.value;
        } else if (account.type == "Collectibles") {
          collectiblesTotal += account.value;
        } else if (account.type == "Art") {
          artTotal += account.value;
        } else if (account.type == "Valuables") {
          valuablesTotal += account.value;
        }
      }
    );

  //total other assets
  const otherAssetsTotal =
    +houseTotal +
    +vehicleTotal +
    +collectiblesTotal +
    +artTotal +
    +valuablesTotal;

  //summation
  let totalAssets = 0;
  totalAssets = +bankAcctTotal + +fixedInvTotal + +otherAssetsTotal;

  //total liabilities

  //credit card debt
  let creditCardTotal = 0;

    Object.values(userInfo.userData.financialInfo.accounts.creditCards).map(
      (account) => {
        creditCardTotal += account.amountOwned;
      }
    );

  //loans debt
  let loansTotal = 0;

    Object.values(userInfo.userData.financialInfo.accounts.loans).map((account) => {
      loansTotal += account.remainingAmount;
    });

  //summation

  let totalLiabilities = 0;
  totalLiabilities = +creditCardTotal + +loansTotal;

  //present net worth
  
  let currNetWorth = 0;
  currNetWorth = totalAssets - totalLiabilities;

  
  // Generate goal data array size mapped to timeline goal (months)
  
  //array to store net worth amounts per month
  const NetWorthData = [currNetWorth];
  let FVPrevNetWorth = currNetWorth;
  for (let i = 0; i < userInfo.goalTimeline*12; i++) {
    FVPrevNetWorth = FVPrevNetWorth*(1+(0.05/12)) + userInfo.userData.goalInfo.monthlyAmount
    //const FVNetWorth = currNetWorth*(1.05/12)**i;
    NetWorthData.push(FVPrevNetWorth);
  }

  // Generate goal data array size mapped to timeline goal(years)
  // const valueEveryYear: number =
  //   selectedGoal.networthGoal / selectedGoal.timelineGoal;

  // const goalData = xAxisLabels.map((element) => {
  //   return element * valueEveryYear;
  // });

  return {
    labels: xAxisLabels,
    datasets: [
      {
        fill: true,
        label: "Net Worth",
        //data needs to be dynamic - port in a list of any size
        data: NetWorthData,
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Timeline Period',
                font: {
                  size: 25
                }
              }
            },
            y: {
              title: {
                display: true,
                text: 'Net Worth',
                font: {
                  size: 25
                }
              }
            }
          }
        },
        borderColor: "rgb(30, 159, 92)",
        backgroundColor: (context: ScriptableContext<"line">) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 500);
          gradient.addColorStop(0, "rgba(45,216,129,1)");
          gradient.addColorStop(1, "rgba(45,216,129,0)");
          return gradient;
        },
      },
    ],
  };
};