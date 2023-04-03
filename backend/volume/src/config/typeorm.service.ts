import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
	@Inject(ConfigService)
	private readonly config: ConfigService;

	public createTypeOrmOptions(): TypeOrmModuleOptions {
		return {
			type: 'postgres',
			host: this.config.get<string>('POSTGRES_DB_HOST'),
			port: this.config.get<number>('POSTGRES_DB_PORT'),
			username: this.config.get<string>('PONG_DB_USER'),
			password: this.config.get<string>('PONG_DB_PASSWORD'),
			database: this.config.get<string>('POSTGRES_DB'),
			schema: this.config.get<string>('PONG_DB_USER'),
			autoLoadEntities: true,
			synchronize: true,
		};
	}
}
