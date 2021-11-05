import { ConnectionOptions } from 'typeorm';

const connectionOptions: ConnectionOptions = {
  type: 'mariadb',
  host: 'localhost',
  port: 3306,
  username: 'nestjs-realworld-example-app',
  password: 'passw0rd',
  database: 'nestjs-realworld-example-app',
};

export default connectionOptions;
