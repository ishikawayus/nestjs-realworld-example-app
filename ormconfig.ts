import { ConnectionOptions } from 'typeorm';
import { SnakeCaseNamingStrategy } from './src/snake-case-naming-strategy';
import * as entity from './src/entity';
import * as migration from './src/migration';

const connectionOptions: ConnectionOptions = {
  type: 'mariadb',
  host: 'localhost',
  port: 3306,
  username: 'nestjs-realworld-example-app',
  password: 'passw0rd',
  database: 'nestjs-realworld-example-app',
  namingStrategy: new SnakeCaseNamingStrategy(),
  entities: Object.values(entity),
  migrations: Object.values(migration),
  cli: {
    migrationsDir: 'src/migration',
  },
};

export default connectionOptions;
