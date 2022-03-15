import { MigrationInterface, QueryRunner } from 'typeorm';
import fs from 'fs';
import { randomUUID } from 'crypto';

const json: any = JSON.parse(
  fs.readFileSync(`${__dirname}/data/city.json`, 'utf-8'),
);

export class CitySeed1647057798558 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      json.map(async (data) => {
        data.title = data.title.replace(/'/g, "\\'");
        return await queryRunner.query(
          `INSERT INTO city (id, state_id, title, iso_code, iso_calling, latitude, longitude, timezone, gmt)
          VALUES ('${data.id}', '${data.state_id}', E'${data.title}', '${data.iso_code}', '${data.iso_calling}', '${data.latitude}' ,'${data.longitude}' ,'${data.timezone}' ,'${data.gmt}');`,
        );
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      json.map((data) => {
        queryRunner.query(`DELETE FROM city WHERE id='${data.id}';`);
      }),
    );
  }
}
