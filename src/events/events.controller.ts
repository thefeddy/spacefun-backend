import { Controller, Get, HttpStatus, Res, Param, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';


/* DTOS */

/* Services */
import { EventsService } from './events.service';
import { HttpService } from '@nestjs/axios';

@ApiTags('Events')
@Controller('')
export class EventsController {
    constructor(
        private _astronautService: EventsService,
        @Inject(CACHE_MANAGER) private _cacheService: Cache,
        private _http: HttpService
    ) { }


    @Get('/:limit/')
    @ApiOperation({ summary: 'List Events Limit' })
    async getEventsByLimit(@Request() req, @Res() res: Response, @Param('limit') limit: number) {

        const date = new Date().toISOString().split('T')[0];
        const cachedData = await this._cacheService.get<{ name: string }>('news-slider');
        let data;
        if (cachedData) {
            data = cachedData;
        } else {
            const url = `${process.env.API_ENDPOINT}${process.env.API_VERSION}/event/?limit=${limit}&date__gte=${date}`;
            const { data: fetchedData } = await firstValueFrom(this._http.get(url));
            await this._cacheService.set('news-slider', fetchedData);
            data = fetchedData;
        }

        res.status(HttpStatus.OK).json({ data });

    }

    @Get('details/:id/')
    @ApiOperation({ summary: 'Get Event By Id' })
    async getEventById(@Request() req, @Res() res: Response, @Param('id') id: number) {
        const cachedData = await this._cacheService.get<{ id: string }>(id.toString());

        let data;
        if (cachedData) {
            data = cachedData;
        } else {
            const { data: fetchedData } = await firstValueFrom(this._http.get(`${process.env.API_ENDPOINT}${process.env.API_VERSION}/event/${id}/`));
            await this._cacheService.set(id.toString(), fetchedData);
            data = fetchedData;
        }

        res.status(HttpStatus.OK).json({ data });
    }

}
