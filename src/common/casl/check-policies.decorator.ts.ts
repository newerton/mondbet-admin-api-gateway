import { SetMetadata } from '@nestjs/common';
import { PolicyHandler } from './policy-handler.interface.ts';

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
