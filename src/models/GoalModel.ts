export enum GoalType {
  PAYDEBT,
  SAVINGS,
  RETIREMENT,
}

// TODO(Peter): Model only for SAVINGS goal
export type GoalModel = {
  goalType: string;
  goalValue: number;
  monthlyAmount: number;
  timeframeValue: number;
};
