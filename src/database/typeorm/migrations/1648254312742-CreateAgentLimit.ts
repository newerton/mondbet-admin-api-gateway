import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateAgentLimit1648254312742 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'agent_limit',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'agent_id',
            type: 'uuid',
          },
          {
            name: 'general_limit',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'reward_percentage',
            type: 'integer',
          },
          {
            name: 'daily_limit_single_bet',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'weekly_limit_single_bet',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: null,
            isNullable: true,
          },
          {
            name: 'daily_limit_double_bet',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'weekly_limit_double_bet',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: null,
            isNullable: true,
          },
          {
            name: 'daily_limit_triple_bet',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'weekly_limit_triple_bet',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: null,
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            default: null,
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'agent_limit',
      new TableForeignKey({
        name: 'fk-agent_limit-agent_id',
        columnNames: ['agent_id'],
        referencedTableName: 'agent',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'agent_limit',
      new TableIndex({
        name: 'fk-agent_limit-agent_id',
        columnNames: ['agent_id'],
        parser: 'btree',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('agent_limit');
  }
}
