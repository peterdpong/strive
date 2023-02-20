import { ScriptableContext } from "chart.js";

export const goalGraphOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Net worth goal visualization",
    },
  },
};

export const buildGoalGraphData = (
  selectedGoal:
    | {
        monthlyAmount: number;
        networthGoal: number;
        timelineGoal: number;
      }
    | undefined
) => {
  if (selectedGoal === undefined) return null;

  // Year timeline labels -> from 1 to timelineGoal
  const xAxisLabels = Array.from(
    new Array(selectedGoal.timelineGoal),
    (x, i) => i + 1
  );

  // Generate goal data array size mapped to timeline goal(years)
  const valueEveryYear: number =
    selectedGoal.networthGoal / selectedGoal.timelineGoal;

  const goalData = xAxisLabels.map((element) => {
    return element * valueEveryYear;
  });

  return {
    labels: xAxisLabels,
    datasets: [
      {
        fill: true,
        label: "Net Worth",
        //data needs to be dynamic - port in a list of any size
        data: goalData,
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
