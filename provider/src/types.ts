export enum Status {
  Pending = 'pending',
  FirstTeamWon = 'first_team_won',
  SecondTeamWon = 'second_team_won',
}

export type Event = {
  id: string;
  coefficient: number;
  deadline: number;
  status: Status;
};
