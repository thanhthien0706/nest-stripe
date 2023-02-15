import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '@decorators/auth.decorator';
import { RefreshTokenGuard } from '@guards/refresh-token.guard';
import { User } from '@decorators/user.decorator';
import { UserEntity } from '@/common/database/entities/user.entity';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { Response, Request } from 'express';
import { ReponseService } from '@/base/reponse.service';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly reponseService: ReponseService,
  ) {}
  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.authService.signUp(createUserDto);

      return res
        .status(HttpStatus.OK)
        .json(
          this.reponseService.customResponeHttp(
            true,
            'Signup Successful',
            data,
            req.url,
          ),
        );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('signin')
  async signin(
    @Body() inforSignin: AuthDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.authService.signIn(inforSignin);

      return res
        .status(HttpStatus.OK)
        .json(
          this.reponseService.customResponeHttp(
            true,
            'Signin Successful',
            data,
            req.url,
          ),
        );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Auth()
  @Get('logout')
  logout(@User() user: UserEntity) {
    this.authService.logout(user.id);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@User() user: UserEntity) {
    const refreshToken = user.refreshToken;
    return this.authService.refreshTokens(user.id, refreshToken);
  }
}
