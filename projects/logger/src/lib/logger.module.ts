import {
  NgModule,
  ModuleWithProviders,
  InjectionToken,
  APP_INITIALIZER
} from '@angular/core';
import { LoggerService } from './logger.service';

export type LoggerProfile = 'console' | 'window';
const LOGGER_CONFIG = new InjectionToken<void>('LOGGER_CONFIG');

@NgModule({})
export class LoggerModule {
  static withProfile(
    profile: LoggerProfile
  ): ModuleWithProviders<LoggerModule> {
    return {
      ngModule: LoggerModule,
      providers: [
        {
          provide: LOGGER_CONFIG,
          useValue: profile
        },
        {
          provide: LoggerService,
          useFactory: createLoggerService,
          deps: [LOGGER_CONFIG]
        },
        {
          provide: APP_INITIALIZER,
          multi: true,
          useFactory: initializeLogger,
          deps: [LOGGER_CONFIG]
        },
        {
          provide: APP_INITIALIZER,
          multi: true,
          useFactory: sendLogEventToBackend,
          deps: [LOGGER_CONFIG]
        }
      ]
    };
  }
}

export function createLoggerService(profile: LoggerProfile) {
  return new LoggerService(profile);
}

export function initializeLogger(profile: LoggerProfile) {
  return () => console.log('[logger] was initialized with profile: ' + profile);
}

export function sendLogEventToBackend(profile: LoggerProfile) {
  return () => {
    fetch('https://reqres.in/api/users?delay=3').then(() =>
      console.log('[logger] sent log event to backend')
    );
    return null;
  };
}
