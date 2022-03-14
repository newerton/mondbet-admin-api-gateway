import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateState1647053670283 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'state',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'country_id',
            type: 'uuid',
          },
          {
            name: 'region_id',
            type: 'uuid',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'letter',
            type: 'varchar',
          },
          {
            name: 'iso_code',
            type: 'varchar',
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
      'state',
      new TableForeignKey({
        name: 'fk-state-country_id',
        columnNames: ['country_id'],
        referencedTableName: 'country',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'state',
      new TableForeignKey({
        name: 'fk-state-region_id',
        columnNames: ['region_id'],
        referencedTableName: 'region',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'state',
      new TableIndex({
        name: 'fk-state-country_id',
        columnNames: ['country_id'],
        parser: 'btree',
      }),
    );

    await queryRunner.createIndex(
      'state',
      new TableIndex({
        name: 'fk-state-region_id',
        columnNames: ['region_id'],
        parser: 'btree',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('state');
  }
}
