import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'

import { HomeController } from './home.controller';

@Module({
    imports: [
        HttpModule,
    ],

    controllers: [HomeController],
})

export class HomeModule { }
