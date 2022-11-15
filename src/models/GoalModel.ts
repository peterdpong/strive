export enum GoalType {
  PAYDEBT,
  SAVINGS,
  RETIREMENT,
}

// TODO(Peter): Model only for SAVINGS goal
export type GoalModel = {
  type: GoalType;
  targetNetWorth: number;
  isTimeframeGoal: boolean;
  constriant: number; // Constraint here depends on isTimeframeGoal
};
