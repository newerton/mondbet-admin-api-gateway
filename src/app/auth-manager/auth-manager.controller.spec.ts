import { Test, TestingModule } from '@nestjs/testing';
import { AuthManagerController } from './auth-manager.controller';
import { AuthManagerService } from './auth-manager.service';

describe('AuthManagerController', () => {
  let controller: AuthManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthManagerController],
      providers: [AuthManagerService],
    }).compile();

    controller = module.get<AuthManagerController>(AuthManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
