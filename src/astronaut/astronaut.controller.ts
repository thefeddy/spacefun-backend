import { Body, Controller, Get, HttpStatus, Post, Render, Res, Param, Patch, Put, UseGuards, Request, HttpCode, Catch, HttpException, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import e, { Response } from 'express';
import { firstValueFrom } from 'rxjs';

import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';


/* DTOS */

/* Services */
import { AstronautService } from './astronaut.service';
import { HttpService } from '@nestjs/axios';

@ApiTags('Astronauts')
@Controller('')
export class AstronautController {
    constructor(
        private _astronautService: AstronautService,
        private _http: HttpService,
        @Inject(CACHE_MANAGER) private _cacheService: Cache,
    ) { }


    @Get('')
    @ApiOperation({ summary: 'List All Astronauts' })
    /**
     * Retrieves the list of astronauts.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves to the list of astronauts.
     */
    async getAstronauts(@Request() req, @Res() res: Response) {

        const url = `${process.env.API_ENDPOINT}${process.env.API_VERSION}/astronaut`;
        const astronauts = await firstValueFrom(this._http.get(url));

        res.status(HttpStatus.OK).json({ astronauts: astronauts.data });
    }

    @Get('details/:id/')
    @ApiOperation({ summary: 'Get Astronauts By Id' })
    /**
     * Retrieves an astronaut by ID.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @param id - The ID of the astronaut to retrieve.
     */
    async getAstronaut(@Request() req, @Res() res: Response, @Param('id') id: number) {
        try {
            const url = `${process.env.API_ENDPOINT}${process.env.API_VERSION}/astronaut/${id}`;
            const cacheKey = `astronaut-${id}`;

            let data = await this._cacheService.get<{ name: string }>(cacheKey);
            if (!data) {
                const { data: fetchedData } = await firstValueFrom(this._http.get(url));
                const agencyUrl = `${process.env.API_ENDPOINT}${process.env.API_VERSION}/agencies/${fetchedData.agency.id}`;
                const { data: agencyData } = await firstValueFrom(this._http.get(agencyUrl));
                fetchedData.agency = agencyData;

                await this._cacheService.set(cacheKey, fetchedData);
                data = fetchedData;
            }

            res.status(HttpStatus.OK).json({ data });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                res.status(HttpStatus.NOT_FOUND).json({ error: 'Astronaut not found' });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
            }
        }
    }

}
