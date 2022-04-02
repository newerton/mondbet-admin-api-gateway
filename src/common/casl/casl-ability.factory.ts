import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Agent } from 'src/app/agent/entities/agent.entity';
import { Collect } from 'src/app/collect/entities/collect.entity';
import { Manager } from 'src/app/manager/entities/manager.entity';
import { JwtData } from '../auth/jwt/jwt.strategy';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

const entities = new Map();
entities.set(Agent.name, Agent);
entities.set(Collect.name, Collect);
entities.set(Manager.name, Manager);

type Subjects =
  | InferSubjects<typeof Agent | typeof Collect | typeof Manager>
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  async defineAbility(user: JwtData) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (!user) {
      return build({
        detectSubjectType: (item) =>
          item.constructor as ExtractSubjectType<Subjects>,
      });
    }

    if (user.entity === 'user') {
      can(Action.Manage, 'all');
    } else {
      if (user?.resource_access?.length > 0) {
        user.resource_access.forEach((role) => {
          const resource = entities.get(role.resource);
          if (role.create) {
            can(Action.Create, resource);
          }
          if (role.read) {
            can(Action.Read, resource, { manager_id: user.id });
          }
          if (role.update) {
            can(Action.Read, resource, { manager_id: user.id });
            can(Action.Update, resource, { manager_id: user.id });
          }
        });
      } else {
        cannot(Action.Manage, 'all');
      }
    }

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
