import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';

class HttpServiceMock {
  get = jest.fn().mockResolvedValue({ data: {} });
}

describe('AppService', () => {
  let appService: AppService;
  let httpService: HttpService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: HttpService,
          useClass: HttpServiceMock,
        },
      ],
    }).compile();

    appService = moduleRef.get<AppService>(AppService);
    httpService = moduleRef.get<HttpService>(HttpService);
  });
  describe('findSectionNameById', () => {
    it('should return the description of a section given its id', () => {
      const sections = [
        { Id: 1, Description: 'Section A' },
        { Id: 2, Description: 'Section B' },
      ];

      const sectionId = 2;
      const result = appService.findSectionNameById(sections, sectionId);

      expect(result).toBe('Section B');
    });
  });

  describe('findPriceByZoneId', () => {
    it('should return the price of a zone given its id', () => {
      const prices = [
        { ZoneId: 1, Price: 100, PerformanceId: 2 },
        { ZoneId: 2, Price: 200, PerformanceId: 2 },
      ];

      const zoneId = 1;
      const result = appService.findPriceByZoneId(prices, zoneId);

      expect(result).toBe(100);
    });
  });

  describe('getAvailableSeats', () => {
    it('should return the available seats with section name and price', async () => {
      const getDataSeatsStatusMock = jest
        .spyOn(appService, 'getDataSeatsStatus')
        .mockResolvedValue([
          {
            Id: 1,
            Description: 'Available',
            SectionId: 1,
            SeatRow: '4',
            ZoneId: 6,
            SeatNumber: '123',
            SeatStatusId: 0,
          },
          {
            Id: 2,
            Description: 'Occupied',
            SectionId: 1,
            SeatRow: '4',
            ZoneId: 6,
            SeatNumber: '123',
            SeatStatusId: 0,
          },
        ]);

      const getAllSeatsMock = jest
        .spyOn(appService, 'getAllSeats')
        .mockResolvedValue([
          {
            Id: 1,
            SectionId: 1,
            SeatRow: 'A',
            ZoneId: 1,
            SeatNumber: '1',
            SeatStatusId: 1,
            Description: 'A description',
          },
          {
            Id: 2,
            SectionId: 2,
            SeatRow: 'B',
            ZoneId: 2,
            SeatNumber: '2',
            SeatStatusId: 1,
            Description: 'A description',
          },
        ]);

      const getSectionsMock = jest
        .spyOn(appService, 'getSections')
        .mockResolvedValue([
          { Id: 1, Description: 'Section A' },
          { Id: 2, Description: 'Section B' },
        ]);

      const getPricesMock = jest
        .spyOn(appService, 'getPrices')
        .mockResolvedValue([
          { ZoneId: 1, Price: 100, PerformanceId: 1 },
          { ZoneId: 2, Price: 200, PerformanceId: 2 },
        ]);

      const performanceId = '123';
      const type = 'Performances';

      const result = await appService.getAvailableSeats(performanceId, type);

      expect(getDataSeatsStatusMock).toHaveBeenCalled();
      expect(getAllSeatsMock).toHaveBeenCalledWith(performanceId, type);
      expect(getSectionsMock).toHaveBeenCalled();
      expect(getPricesMock).toHaveBeenCalledWith(performanceId, type);

      expect(result).toEqual([
        { Section: 'Section A', SeatRow: 'A', SeatNumber: '1', price: 100 },
        { Section: 'Section B', SeatRow: 'B', SeatNumber: '2', price: 200 },
      ]);
    });
  });
});
