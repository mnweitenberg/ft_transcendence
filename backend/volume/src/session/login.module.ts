import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginResolver } from './login.resolver';

@Module({
	providers: [LoginResolver, LoginService],
})
export class LoginModule {}
