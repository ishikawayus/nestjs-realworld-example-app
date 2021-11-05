import { DefaultNamingStrategy } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export class SnakeCaseNamingStrategy extends DefaultNamingStrategy {
  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return snakeCase(
      embeddedPrefixes.concat(customName || propertyName).join('_'),
    );
  }
}
