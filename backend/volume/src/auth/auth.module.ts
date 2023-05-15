import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
	imports: [
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '60s' },
		}),
		forwardRef(() => UserModule),
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
