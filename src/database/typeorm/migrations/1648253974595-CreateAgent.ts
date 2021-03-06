import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateAgent1648253974595 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'agent',
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
            name: 'submanager_id',
            type: 'uuid',
            default: null,
            isNullable: true,
          },
          {
            name: 'collect_id',
            type: 'uuid',
          },
          {
            name: 'profile_id',
            type: 'uuid',
          },
          {
            name: 'first_name',
            type: 'varchar',
          },
          {
            name: 'last_name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'email_verified',
            type: 'boolean',
            default: false,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'document',
            type: 'varchar',
            default: null,
            isNullable: true,
          },
          {
            name: 'birthday',
            type: 'date',
            default: null,
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            default: null,
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            default: null,
            isNullable: true,
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

    /** FOREING KEY */
    await queryRunner.createForeignKey(
      'agent',
      new TableForeignKey({
        name: 'fk-agent-manager_id',
        columnNames: ['manager_id'],
        referencedTableName: 'manager',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'agent',
      new TableForeignKey({
        name: 'fk-agent-submanager_id',
        columnNames: ['submanager_id'],
        referencedTableName: 'manager',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'agent',
      new TableForeignKey({
        name: 'fk-agent-collect_id',
        columnNames: ['collect_id'],
        referencedTableName: 'collect',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'agent',
      new TableForeignKey({
        name: 'fk-agent-profile_id',
        columnNames: ['profile_id'],
        referencedTableName: 'profile',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
      }),
    );

    /** INDEXES */
    await queryRunner.createIndex(
      'agent',
      new TableIndex({
        name: 'fk-agent-manager_id',
        columnNames: ['manager_id'],
        parser: 'btree',
      }),
    );

    await queryRunner.createIndex(
      'agent',
      new TableIndex({
        name: 'fk-agent-submanager_id',
        columnNames: ['submanager_id'],
        parser: 'btree',
      }),
    );

    await queryRunner.createIndex(
      'agent',
      new TableIndex({
        name: 'fk-agent-collect_id',
        columnNames: ['collect_id'],
        parser: 'btree',
      }),
    );

    await queryRunner.createIndex(
      'agent',
      new TableIndex({
        name: 'fk-agent-profile_id',
        columnNames: ['profile_id'],
        parser: 'btree',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('agent');
  }
}
