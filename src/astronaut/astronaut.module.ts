import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'

import { AstronautController } from './astronaut.controller';

import { AstronautService } from './astronaut.service';


@Module({
    imports: [
        HttpModule,
    ],
    providers: [AstronautService],
    controllers: [AstronautController],
})

export class AstronautModule { }
