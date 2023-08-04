export interface Seats {
  Id: number;
  SectionId: number;
  SeatRow: string;
  ZoneId: number;
  SeatNumber: string;
  SeatStatusId: number;
  Description: string;
}

export interface Price {
  ZoneId: number;
  Price: number;
  PerformanceId: number;
}

export interface Section {
  Id: number;
  Description: string;
}
export interface AvailableSeats {
  Section: string;
  SeatRow: string;
  SeatNumber: number;
  price: number;
}
