import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateUserAddress1647053775962 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_address',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'user_id',
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
      'user_address',
      new TableForeignKey({
        name: 'fk-user_address-user_id',
        columnNames: ['user_id'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'user_address',
      new TableForeignKey({
        name: 'fk-user_address-state_id',
        columnNames: ['state_id'],
        referencedTableName: 'state',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'user_address',
      new TableForeignKey({
        name: 'fk-user_address-city_id',
        columnNames: ['city_id'],
        referencedTableName: 'city',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'user_address',
      new TableIndex({
        name: 'fk-user_address-user_id',
        columnNames: ['user_id'],
        parser: 'btree',
      }),
    );

    await queryRunner.createIndex(
      'user_address',
      new TableIndex({
        name: 'fk-user_address-state_id',
        columnNames: ['state_id'],
        parser: 'btree',
      }),
    );

    await queryRunner.createIndex(
      'user_address',
      new TableIndex({
        name: 'fk-user_address-city_id',
        columnNames: ['city_id'],
        parser: 'btree',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_address');
  }
}
