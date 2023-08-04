import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Price, Section, AvailableSeats, Seats } from './models/interfaces';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  findSectionNameById(arr: Array<Section>, sectionId: number): string {
    return arr.find((elem) => elem.Id === sectionId).Description;
  }

  findPriceByZoneId(prices: Array<Price>, zoneId: number): number {
    return prices.find((elem) => elem.ZoneId === zoneId).Price;
  }

  async getAllSeats(performanceId: string, type: string): Promise<Seats[]> {
    const url = `https://my.laphil.com/en/rest-proxy/TXN/${type}/${performanceId}/Seats?constituentId=0&modeOfSaleId=26&performanceId=${performanceId}`;
    try {
      const res = await this.httpService.get(url).toPromise();
      return res.data;
    } catch (e) {
      console.log(e);
    }
  }

  async getSections(): Promise<Section[]> {
    const url = `https://my.laphil.com/en/rest-proxy/ReferenceData/Sections?seatMapId=12`;
    try {
      const res = await this.httpService.get(url).toPromise();
      return res.data;
    } catch (e) {
      console.log(e);
    }
  }

  async getPrices(performanceId: string, type: string): Promise<Price[]> {
    const url =
      type === 'Packages'
        ? `https://my.laphil.com/en/rest-proxy/TXN/Packages/${performanceId}/Prices`
        : `https://my.laphil.com/en/rest-proxy/TXN/Performances/Prices?performanceIds=${performanceId}`;

    try {
      const res = await this.httpService.get(url).toPromise();
      return res.data;
    } catch (e) {
      console.log(e);
    }
  }

  async getDataSeatsStatus(): Promise<Seats[]> {
    const url =
      'https://my.laphil.com/en/rest-proxy/ReferenceData/SeatStatuses';
    try {
      const res = await this.httpService.get(url).toPromise();
      return res.data;
    } catch (e) {
      console.log(e);
    }
  }

  async getAvailableSeats(id: string, type: string): Promise<AvailableSeats[]> {
    const statuses = await this.getDataSeatsStatus();
    const allSeats = await this.getAllSeats(id, type);
    const allSections = await this.getSections();
    const prices = (await this.getPrices(id, type)).filter((elem) => {
      if (type === 'Packages') {
        return elem.PerformanceId === 0;
      }
      return true;
    });
    const available = allSeats
      .filter((el: any) => el.SeatStatusId === statuses[0].Id)
      .map((el: any) => {
        const sectionName = this.findSectionNameById(allSections, el.SectionId);
        const price = this.findPriceByZoneId(prices, el.ZoneId);
        return {
          Section: sectionName,
          SeatRow: el.SeatRow,
          SeatNumber: el.SeatNumber,
          price,
        };
      });
    return available;
  }
}
