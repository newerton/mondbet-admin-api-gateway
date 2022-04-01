import { Manager } from 'src/app/manager/entities/manager.entity';
import { Action, AppAbility } from 'src/common/casl/casl-ability.factory';

interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

export class CreateUpdatePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Create, Manager);
  }
}

export class ReadManagerPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Read, Manager);
  }
}

export class UpdateManagerPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Update, Manager);
  }
}
