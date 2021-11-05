import { ConnectionOptions } from 'typeorm';
import { SnakeCaseNamingStrategy } from './src/snake-case-naming-strategy';

const connectionOptions: ConnectionOptions = {
  type: 'mariadb',
  host: 'localhost',
  port: 3306,
  username: 'nestjs-realworld-example-app',
  password: 'passw0rd',
  database: 'nestjs-realworld-example-app',
  namingStrategy: new SnakeCaseNamingStrategy(),
  entities: ['src/entity/*.ts'],
  migrations: ['src/migration/*.ts'],
  cli: {
    migrationsDir: 'src/migration',
  },
};

export default connectionOptions;
