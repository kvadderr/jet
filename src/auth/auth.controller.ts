import {
    Controller,
    Post,
    Req,
    Body,
    ForbiddenException,
    UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponse } from './type/loginResponse';
import { LoginUserDto } from './dto/loginUser.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CookieInterceptor } from './interceptor/cookie.interceptor';
import { CheckCodeDto } from './dto/checkCode.dto';

@UseInterceptors(CookieInterceptor)
@Controller('/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) { }

    @Post('sendCode')
    async loginUser(@Body() loginUserDto: LoginUserDto){
        const { phone } = loginUserDto;
        let existingUser: Omit<User, 'createdAt' | 'updatedAt'>;
        let isValid: boolean = true;
        const code = '123456';
        try {
            existingUser = await this.userService.findOneByPhone(phone, code);
            if (!existingUser) {
                isValid = false;
                existingUser = await this.userService.create({ phone, code })
            }
            console.log(existingUser)
        } catch (error) {
            console.log(error)
            throw new ForbiddenException('Username or password is invalid');
        }
        const { id, tokenVersion } = existingUser;
        const tokens = this.authService.assignTokens(id, tokenVersion);
        console.log(tokens)
        return tokens
    }


    @Post('checkCode')
    async checkCode(@Body() checkCode: CheckCodeDto, @Req() req) {
        console.log(req)
    }

}