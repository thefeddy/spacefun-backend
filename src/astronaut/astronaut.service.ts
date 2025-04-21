import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

/* Constants */


@Injectable()
export class AstronautService {

    constructor() { }

    // async findCommunity(id: number): Promise<any> {
    //     return await this.communityRepository.findOneOrFail({
    //         where: { id },
    //         relations: ['owner', 'members', 'movies']
    //     });
    // }
}