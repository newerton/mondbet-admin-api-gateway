import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateAgentRoles1649081831445 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'agent_role',
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
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'resource',
            type: 'varchar',
          },
          {
            name: 'manager',
            type: 'boolean',
            default: false,
          },
          {
            name: 'create',
            type: 'boolean',
            default: false,
          },
          {
            name: 'read',
            type: 'boolean',
            default: false,
          },
          {
            name: 'update',
            type: 'boolean',
            default: false,
          },
          {
            name: 'delete',
            type: 'boolean',
            default: false,
          },
          {
            name: 'visible',
            type: 'boolean',
            default: true,
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
      'agent_role',
      new TableForeignKey({
        name: 'fk-agent_role-agent_id',
        columnNames: ['agent_id'],
        referencedTableName: 'agent',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'agent_role',
      new TableIndex({
        name: 'idx_agent_id',
        columnNames: ['agent_id'],
        isUnique: false,
        parser: 'btree',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('agent_role');
  }
}
