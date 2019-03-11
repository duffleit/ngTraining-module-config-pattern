import { Injectable } from '@angular/core';
import { LoggerProfile } from './logger.module';

@Injectable()
export class LoggerService {
  constructor(private profile: LoggerProfile) {}

  public logMessage(message: string): void {
    this.logger(message);
  }

  private get logger(): (message: string) => void {
    switch (this.profile) {
      case 'console':
        return console.log;
      case 'window':
        return window.alert;
    }
  }
}
