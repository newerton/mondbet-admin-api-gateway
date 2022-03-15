import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateManagerLimit1647277714344 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'manager_limit',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'manager_id',
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
            default: null,
            isNullable: true,
          },
          {
            name: 'agent_max',
            type: 'integer',
          },
          {
            name: 'daily_limit',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'weekly_limit',
            type: 'decimal',
            precision: 10,
            scale: 2,
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
          },
          {
            name: 'daily_limit_triple_bet',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: null,
            isNullable: true,
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
      'manager_limit',
      new TableForeignKey({
        name: 'fk-manager_limit-manager_id',
        columnNames: ['manager_id'],
        referencedTableName: 'manager',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'manager_limit',
      new TableIndex({
        name: 'fk-manager_limit-manager_id',
        columnNames: ['manager_id'],
        parser: 'btree',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('manager_limit');
  }
}
