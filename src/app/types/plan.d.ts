import {Schema} from './schema';

export interface Plan {
  task: string;
  finished?: boolean;
  createdAt?: string;
  due?: string;
}

export type PlanSchema = Plan & Schema;
