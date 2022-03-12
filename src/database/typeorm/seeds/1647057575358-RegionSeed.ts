import { randomUUID } from 'crypto';
import { MigrationInterface, QueryRunner } from 'typeorm';
import fs from 'fs';

const json: any = JSON.parse(
  fs.readFileSync(`${__dirname}/data/region.json`, 'utf-8'),
);

export class RegionSeed1647057575358 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      json.map(async (data) => {
        return await queryRunner.query(
          `INSERT INTO region (id, title) VALUES ('${data.id}', '${data.title}');`,
        );
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      json.map((data) =>
        queryRunner.query(`DELETE FROM region WHERE title='${data.title}';`),
      ),
    );
  }
}
