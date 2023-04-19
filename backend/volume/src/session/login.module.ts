import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginResolver } from './login.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [HttpModule],
	providers: [LoginResolver, LoginService],
})
export class LoginModule {}
