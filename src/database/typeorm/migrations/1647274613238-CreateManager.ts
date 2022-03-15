import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateSubManager1647274613238 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'manager',
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
            default: null,
            isNullable: true,
          },
          {
            name: 'profile_detail_id',
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
            name: 'permission_delete_tocket',
            type: 'boolean',
          },
          {
            name: 'visible',
            type: 'boolean',
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
      'manager',
      new TableForeignKey({
        name: 'fk-manager-profile_detail_id',
        columnNames: ['profile_detail_id'],
        referencedTableName: 'profile_detail',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'manager',
      new TableIndex({
        name: 'fk-manager-profile_detail_id',
        columnNames: ['profile_detail_id'],
        parser: 'btree',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('manager');
  }
}