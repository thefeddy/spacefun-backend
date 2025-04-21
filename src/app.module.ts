/* NestJS */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule, Routes } from '@nestjs/core';

/* App */
import { AppController } from './app.controller';
import { AppService } from './app.service';

/* Modules */
import { AstronautModule } from './astronaut/astronaut.module';
import { HomeModule } from './home/home.module';
import { EventsModule } from './events/events.module';

/* Entities */

/* Redis */
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';

/* Routes */
const routes: Routes = [
    {
        path: '/',
        module: HomeModule,
    },
    {
        path: '/api/',
        children: [
            {
                path: '/astronauts/',
                module: AstronautModule,
            },
            {
                path: '/events/',
                module: EventsModule,
            }
        ]
    }
];

@Module({
    imports: [
        HomeModule,
        AstronautModule,
        EventsModule,
        CacheModule.register({
            isGlobal: true,
            store: redisStore,
            host: 'localhost',
            port: 6379,
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        RouterModule.register(routes)
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
