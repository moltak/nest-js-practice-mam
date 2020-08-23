import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class UserMigration1598177028512 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar(10)',
            isNullable: false,
          },
          {
            name: 'birthDate',
            type: 'char(8)',
            isNullable: false,
          },
          {
            name: 'gender',
            type: 'varchar(5)',
            isNullable: false,
          },
          {
            name: 'userId',
            type: 'varchar(30)',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar(100)',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar(50)',
            isNullable: false,
          },
          {
            name: 'userRole',
            type: 'enum',
            enum: ['PARENT', 'SITTER', 'BOTH', 'NONE'],
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            onUpdate: 'now()',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_USER_ID',
        columnNames: ['userId'],
      }),
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_USER_EMAIL',
        columnNames: ['email'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('user', 'IDX_USER_ID');
    await queryRunner.dropIndex('user', 'IDX_USER_EMAIL');
    await queryRunner.dropTable('user');
  }
}
