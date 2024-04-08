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

import { CheckCodeDto } from './dto/checkCode.dto';

@Controller('/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) { }

    @Post('sendCode')
    async loginUser(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
        const { phone } = loginUserDto;
        let existingUser: Omit<User, 'createdAt' | 'updatedAt'>;
        let isValid: boolean = false;
        const code = '123456';
        try {
            existingUser = await this.userService.findOneByPhone(phone, code);
            if (!existingUser) {
                isValid = true;
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
        console.log(code)
        console.log(isValid)
        const data = {
            accessToken: tokens.accessToken,
            code: code,
            isNew: isValid
        }
        console.log(data)
        return data;
    }


    @Post('checkCode')
    async checkCode(@Body() checkCode: CheckCodeDto, @Req() req) {
        const currentCode = await this.userService.getCode(req.user.id)
        console.log(currentCode)
        console.log(checkCode.code)
        return currentCode === checkCode.code;
    }

}