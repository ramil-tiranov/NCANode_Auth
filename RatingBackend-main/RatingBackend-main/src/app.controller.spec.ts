import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn().mockReturnValue('Welcome to the API!'),
            getStatus: jest.fn().mockReturnValue({ status: 'OK' }),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should return "Welcom to the API!" from getHello()', () => {
    expect(appController.getHello()).toBe('Welcome to the API!');

    expect(appService.getHello).toHaveBeenCalled();
  });

  it('should return status from getStatus()', () => {
    const status = { status: 'OK' };
    expect(appController.getStatus()).toEqual(status);
    expect(appService.getStatus).toHaveBeenCalled();
  });

  it('should return version from getVersion()', () => {
    const version = { version: '0.0.1' };
    expect(appController.getVersion()).toEqual(version);
  });
});
