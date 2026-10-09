export type RolloutStrategy = 'immediate' | 'canary' | 'staged';
export type DeploymentState = 'pending' | 'dispatched' | 'installing' | 'installed' | 'rolled_back' | 'failed';

export class FirmwareService {
  shouldAbort(batchStatuses: Array<'nominal' | 'degraded' | 'fault' | 'maintenance' | 'offline'>): boolean {
    return batchStatuses.some((status) => status === 'fault' || status === 'offline');
  }

  nextState(current: DeploymentState, healthPassed: boolean): DeploymentState {
    if (current === 'installing' && !healthPassed) return 'rolled_back';
    if (current === 'installing' && healthPassed) return 'installed';
    return current;
  }
}
