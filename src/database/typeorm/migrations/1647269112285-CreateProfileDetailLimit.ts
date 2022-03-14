import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateProfileDetailLimit1647269112285
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'profile_detail_limit',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'profile_detail_id',
            type: 'uuid',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'bet_max',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'bet_max_multiple',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'bet_max_event',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'bet_max_win',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'bet_max_multiple_win',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'bet_min',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'bet_min_multiple',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'quote_min_ticket',
            type: 'decimal',
            precision: 10,
            scale: 2,
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
      'profile_detail_limit',
      new TableForeignKey({
        name: 'fk-profile_detail_limit-profile_detail_id',
        columnNames: ['profile_detail_id'],
        referencedTableName: 'profile_detail',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'profile_detail_limit',
      new TableIndex({
        name: 'fk-profile_detail_limit-profile_detail_id',
        columnNames: ['profile_detail_id'],
        parser: 'btree',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('profile_detail_limit');
  }
}
