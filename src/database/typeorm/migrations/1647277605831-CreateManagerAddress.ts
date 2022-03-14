import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateManagerAddress1647277605831 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'manager_address',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'manager_id',
            type: 'uuid',
          },
          {
            name: 'zipcode',
            type: 'varchar',
          },
          {
            name: 'street',
            type: 'varchar',
          },
          {
            name: 'number',
            type: 'varchar',
          },
          {
            name: 'neighborhood',
            type: 'varchar',
          },
          {
            name: 'complement',
            type: 'varchar',
            default: null,
            isNullable: true,
          },
          {
            name: 'state_id',
            type: 'uuid',
          },
          {
            name: 'city_id',
            type: 'uuid',
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
      'manager_address',
      new TableForeignKey({
        name: 'fk-manager_address-manager_id',
        columnNames: ['manager_id'],
        referencedTableName: 'manager',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'manager_address',
      new TableForeignKey({
        name: 'fk-manager_address-state_id',
        columnNames: ['state_id'],
        referencedTableName: 'state',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'manager_address',
      new TableForeignKey({
        name: 'fk-manager_address-city_id',
        columnNames: ['city_id'],
        referencedTableName: 'city',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'manager_address',
      new TableIndex({
        name: 'fk-manager_address-manager_id',
        columnNames: ['manager_id'],
        parser: 'btree',
      }),
    );

    await queryRunner.createIndex(
      'manager_address',
      new TableIndex({
        name: 'fk-manager_address-state_id',
        columnNames: ['state_id'],
        parser: 'btree',
      }),
    );

    await queryRunner.createIndex(
      'manager_address',
      new TableIndex({
        name: 'fk-manager_address-city_id',
        columnNames: ['city_id'],
        parser: 'btree',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('manager_address');
  }
}
