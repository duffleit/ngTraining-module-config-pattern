import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {
  constructor() {}

  public logMessage(message: string): void {
    console.log(message);
  }
}
