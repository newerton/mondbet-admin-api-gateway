import { MigrationInterface, QueryRunner } from 'typeorm';
import fs from 'fs';

const json: any = JSON.parse(
  fs.readFileSync(`${__dirname}/data/state.json`, 'utf-8'),
);

export class StateSeed1647057789197 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      json.map(async (data) => {
        return await queryRunner.query(
          `INSERT INTO state (id, country_id, region_id, title, letter, iso_code)
          VALUES ('${data.id}', '${data.country_id}', '${data.region_id}', '${data.title}', '${data.letter}', '${data.iso_code}');`,
        );
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      json.map((data) =>
        queryRunner.query(`DELETE FROM state WHERE title='${data.title}';`),
      ),
    );
  }
}
