import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCountry1647053597514 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'country',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'iso_code',
            type: 'varchar',
          },
          {
            name: 'calling_code',
            type: 'varchar',
            default: null,
            isNullable: true,
          },
          {
            name: 'title',
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
            name: 'visible',
            type: 'boolean',
            default: true,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('country');
  }
}
