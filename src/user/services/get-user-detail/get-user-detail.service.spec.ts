import { Test, TestingModule } from '@nestjs/testing';
import { GetUserDetailService } from './get-user-detail.service';

describe('GetUserDetailService', () => {
  let service: GetUserDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetUserDetailService],
    }).compile();

    service = module.get<GetUserDetailService>(GetUserDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
