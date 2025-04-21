import { Controller, Get, Request, } from '@nestjs/common';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

/* DTOS */

/* Services */
import { HttpService } from '@nestjs/axios';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('')

export class HomeController {

    constructor() { }


    @Get('/')
    @ApiExcludeEndpoint()
    index(@Request() req) {

    }

}
