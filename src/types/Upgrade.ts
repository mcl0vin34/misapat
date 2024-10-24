export interface Upgrade {
  upgrade_id: number;
  name: string;
  description: string;
  url: string;
  current_level: number;
  next_level: number | null;
  next_level_cost: number | null;
  income_increase_per_level: number;
  cumulative_income: number;
}
