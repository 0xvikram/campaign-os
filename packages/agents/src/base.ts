import { OrchestrationContext } from '@repo/types';

export interface Agent<T> {
  name: string;
  execute(context: OrchestrationContext): Promise<T>;
}
