import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateProducerCropsTable1729630454979 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'producer_crops',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'producer_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'crop_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            onUpdate: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'producer_crops',
      new TableForeignKey({
        columnNames: ['producer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'producers',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'producer_crops',
      new TableForeignKey({
        columnNames: ['crop_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'crops',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('producer_crops');
  }
}
