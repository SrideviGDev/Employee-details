import { Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import {  MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DatePickerInput {
  calendarVisible: boolean;
  toDate: boolean;
  minDate: Date
}

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})



export class DatePickerComponent {
  viewDate = new Date();
  selectedDate: Date | null = null;
  selectedButton: string;

  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  constructor(public dialogRef: MatDialogRef<DatePickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DatePickerInput) {}

  prevMonth() {
    this.viewDate.setMonth(this.viewDate.getMonth() - 1);
    this.viewDate = new Date(this.viewDate);
  }

  nextMonth() {
    this.viewDate.setMonth(this.viewDate.getMonth() + 1);
    this.viewDate = new Date(this.viewDate);
  }

  setToday() {
    this.selectedDate = new Date();
    this.selectedButton = 'today';
  }

  setNextMonday() {
    this.setRelativeDay(1);
    this.selectedButton = 'nextMonday';
  }

  setNextTuesday() {
    this.setRelativeDay(2);
    this.selectedButton = 'nextTuesday';
  }

  setAfterOneWeek() {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    this.selectDate(date);
    this.selectedButton = 'afterOneWeek';
  }

  selectDate(date: any) {
    this.selectedDate = date?date:null;
  }

  private setRelativeDay(dayOfWeek: number) {
    const date = new Date();
    const currentDay = date.getDay();
    const daysUntilNext = (dayOfWeek - currentDay + 7) % 7 || 7;
    date.setDate(date.getDate() + daysUntilNext);
    this.selectDate(date);
  }

  getCalendarDays() {
    const start = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth(),
      1
    );
    const end = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth() + 1,
      0
    );

    const days = [];
    for (let i = start.getDay(); i > 0; i--) {
      days.push(null);
    }

    for (let i = 0; i < end.getDate(); i++) {
      days.push(
        new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
      );
    }

    // for (let i = 1; days.length % 7 !== 0; i++) {
    //   days.push(new Date(end.getFullYear(), end.getMonth(), end.getDate() + i));
    // }

    return days;
  }

  

  isSelected(date:any): boolean {
    return this.selectedDate && date ? this.selectedDate?.getTime() === date?.getTime() : false;
  }

  isDisabled(day: any): boolean {
    return day < new Date(this.data.minDate) || day > new Date();
  }


  setNoDate() {
    this.selectedDate = null;
    this.selectedButton = 'noDate';
  }

  onCancel() {
    // Handle cancel logic
    this.selectedDate = null;
    this.dialogRef.close();
  }

  onSave() {
    // Handle save logic
    this.dialogRef.close(this.selectedDate);
  }
}
