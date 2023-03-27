export enum GoalType {
  PAYDEBT,
  SAVINGS,
  RETIREMENT,
}

export type GoalModel = {
  startingNetWorth: number;
  monthlyAmount: number;
  networthGoal: number;
  timelineGoal: number;
};
