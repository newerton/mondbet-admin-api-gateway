import { MigrationInterface, QueryRunner } from 'typeorm';
import fs from 'fs';
import { randomUUID } from 'crypto';

const json: any = JSON.parse(
  fs.readFileSync(`${__dirname}/data/country.json`, 'utf-8'),
);

export class CountrySeed1647056050012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      json.map(async (data) => {
        if (!data.id) {
          data.id = randomUUID();
        }
        return await queryRunner.query(
          `INSERT INTO country
            (id, iso_code, title, latitude, longitude, calling_code)
          VALUES ('${data.id}', '${data.iso_code}', '${data.title}', '${data.latitude}', '${data.longitude}', '${data.calling_code}');`,
        );
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      json.map((data) =>
        queryRunner.query(
          `DELETE FROM country WHERE iso_code='${data.iso_code}';`,
        ),
      ),
    );
  }
}
