export enum GoalType {
  PAYDEBT,
  SAVINGS,
  RETIREMENT,
}

// TODO(Peter): Model only for SAVINGS goal
export type GoalModel = {
  monthlyAmount: number;
  networthGoal: number;
  timelineGoal: number;
};
