import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs'
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		httpsOptions: {
			key: fs.readFileSync('/home/secrets/key.pem'),
			cert: fs.readFileSync('/home/secrets/cert.pem'),
		}
	});
	app.use(cookieParser());
	app.enableCors({
		origin: `https://${process.env.DOMAIN}:5574`,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true,
	});
	await app.listen(4242);
}
bootstrap();
