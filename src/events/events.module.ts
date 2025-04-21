import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'

import { EventsController } from './events.controller';

import { EventsService } from './events.service';


@Module({
    imports: [
        HttpModule,
    ],
    providers: [EventsService],
    controllers: [EventsController],
})

export class EventsModule { }
