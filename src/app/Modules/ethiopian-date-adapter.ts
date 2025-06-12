import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class EthiopianDateAdapter extends NativeDateAdapter {
  // Ethiopian calendar starts in 8 CE (Gregorian)
  private readonly ETHIOPIAN_EPOCH = 8;

  // Number of days in each Ethiopian month
  private readonly ETHIOPIAN_MONTH_DAYS = [
    30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5 // 5 or 6 days in Pagume (13th month)
  ];

  // Convert Gregorian date to Ethiopian date
  private gregorianToEthiopian(date: Date): { year: number, month: number, day: number } {
    const gregDate = new Date(date);
    const gregYear = gregDate.getFullYear();
    const gregMonth = gregDate.getMonth();
    const gregDay = gregDate.getDate();

    // Calculate days since Gregorian epoch
    const gregEpoch = new Date(gregYear, gregMonth, gregDay);
    const diffMs = gregEpoch.getTime() - new Date(1, 0, 1).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Calculate Ethiopian date
    const ethDays = diffDays + this.ETHIOPIAN_EPOCH;
    const ethYear = Math.floor(ethDays / 365) + 1;
    let remainingDays = ethDays % 365;

    // Handle leap year (every 4 years)
    const isLeap = ethYear % 4 === 3;
    if (isLeap && remainingDays >= 366) {
      remainingDays -= 366;
      return { year: ethYear + 1, month: 1, day: 1 };
    } else if (!isLeap && remainingDays >= 365) {
      remainingDays -= 365;
      return { year: ethYear + 1, month: 1, day: 1 };
    }

    // Calculate month and day
    let ethMonth = 1;
    for (const daysInMonth of this.ETHIOPIAN_MONTH_DAYS) {
      const adjustedDays = ethMonth === 13 && isLeap ? daysInMonth + 1 : daysInMonth;
      if (remainingDays < adjustedDays) {
        break;
      }
      remainingDays -= adjustedDays;
      ethMonth++;
    }

    return { year: ethYear, month: ethMonth, day: remainingDays + 1 };
  }

  // Convert Ethiopian date to Gregorian date
  private ethiopianToGregorian(year: number, month: number, day: number): Date {
    let totalDays = (year - 1) * 365;
    totalDays += Math.floor((year - 1) / 4);

    // Add days for completed months
    for (let m = 1; m < month; m++) {
      totalDays += m === 13 && year % 4 === 3 ? 6 : this.ETHIOPIAN_MONTH_DAYS[m - 1];
    }

    // Add days in current month
    totalDays += day - 1;

    // Subtract Ethiopian epoch offset
    totalDays -= this.ETHIOPIAN_EPOCH;

    // Convert to Gregorian date
    const gregDate = new Date(1, 0, 1);
    gregDate.setDate(gregDate.getDate() + totalDays);
    return gregDate;
  }

  // Override format method to display Ethiopian dates
  override format(date: Date, displayFormat: any): string {
    const ethDate = this.gregorianToEthiopian(date);
    return `${ethDate.day}/${ethDate.month}/${ethDate.year}`;
  }

  // Override parse method to handle Ethiopian date input
  override parse(value: any): Date | null {
    if (typeof value === 'string' && value.indexOf('/') > -1) {
      const parts = value.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        return this.ethiopianToGregorian(year, month, day);
      }
    }
    return null;
  }

  // Optional: Override other methods as needed
}