import { CMSService } from './cms.service';
import { CMS } from './cms.schema';
import { CreateCmsDto } from 'src/data/dto/cms.dto/cms.dto';
export declare class CMSController {
    private readonly cmsService;
    constructor(cmsService: CMSService);
    create(createCmsDto: CreateCmsDto): Promise<CMS>;
    findAll(): Promise<CMS[]>;
    findById(id: string): Promise<CMS>;
    update(id: string, updateCmsDto: Partial<CreateCmsDto>): Promise<CMS>;
    delete(id: string): Promise<CMS>;
    viewContent(id: string): Promise<string>;
}
