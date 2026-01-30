import { Test, TestingModule } from '@nestjs/testing';
import { HistorySessionService } from './history-session.service';

describe('HistorySessionService', () => {
  let service: HistorySessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistorySessionService],
    }).compile();

    service = module.get<HistorySessionService>(HistorySessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
