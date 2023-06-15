import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		httpsOptions: {
			// key: fs.readFileSync("../secrets/key.pem"),
			// cert: fs.readFileSync("../secrets/cert.pem"),
			key: fs.readFileSync("/etc/ssl/private/ft_transcendence.key"),
			cert: fs.readFileSync("/etc/ssl/certs/ft_transcendence.crt"),
		}
	});
	app.use(cookieParser());
	app.enableCors({
		origin: `https://${process.env["DOMAIN"]}:5574`,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true,
	});
	await app.listen(4242);
}
bootstrap();
