import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCity1647053730213 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'city',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'state_id',
            type: 'uuid',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'iso_code',
            type: 'varchar',
          },
          {
            name: 'iso_calling',
            type: 'varchar',
          },
          {
            name: 'latitude',
            type: 'varchar',
            default: null,
            isNullable: true,
          },
          {
            name: 'longitude',
            type: 'varchar',
            default: null,
            isNullable: true,
          },
          {
            name: 'timezone',
            type: 'varchar',
            default: null,
            isNullable: true,
          },
          {
            name: 'gmt',
            type: 'varchar',
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

    await queryRunner.createForeignKey(
      'city',
      new TableForeignKey({
        name: 'fk-city-state_id',
        columnNames: ['state_id'],
        referencedTableName: 'state',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('city');
  }
}
