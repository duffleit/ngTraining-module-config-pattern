# Module-Config pattern

This exercise shows you how to make use of the module-config pattern.

_This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.5._

## Boilerplate:

A project which contains a library and an app is already created for the sake of this exercise. The app represents a simple `cockpit` and the library is a simple `logger` which can log messages. The `cockpit` uses the `logger` to log messages. 

```
ng new ngTraining-module-config-pattern --create-application=false
cd ngTraining-module-config-pattern
ng g lib logger
# add a simple logger service which is provided on root-scope
ng g app cockpit
# import and use the logger
```

## Tasks: 

1. The logger should be configurable by a profile to log on `window.alert()` or on `console.log`. This configuration should be performed during import. 

```
imports: [BrowserModule, FormsModule, LoggerModule.withProfile('console')],
```

2. Create a static method `withProfile(profile: string): ModuleWithProviders<LoggerModule>` in the `LoggerModule` which should later provide the `LoggerService`. 

```
export type LoggerProfile = 'console' | 'window';

@NgModule({})
export class LoggerModule {
  static withProfile(config: LoggerProfile): ModuleWithProviders<LoggerModule> {
    return {
      ngModule: LoggerModule,
      providers: []
    };
  }
}
```

3. Provide the config as Injection token to provide it later to the `LoggerService`.

```
const LOGGER_CONFIG = new InjectionToken<void>('LOGGER_CONFIG');

@NgModule({})
export class LoggerModule {
    ...
      providers: [
        {
          provide: LOGGER_CONFIG,
          useValue: profile
        },
    ...
```

4. Provide the `LoggerService` by creating it via the `useFactory`-approach. Pass the `profile` as a dependency. Extend the `LoggerService`-constructor to accept a profile.

```
@NgModule({})
export class LoggerModule {
    ...
      providers: [
        {
          provide: LoggerService,
          useFactory: createLoggerService,
          deps: [LOGGER_CONFIG]
        }
}

export function createLoggerService(profile: LoggerProfile) {
  return new LoggerService(profile);
}
```

5. Extend the `LoggerService` to act correctly based on a given profile.

6. The Logger should print a `console.log` on application-startup to show which profile is used. This can be achieved by extending the `APP_INITIALIZER` token. 

```
@NgModule({})
export class LoggerModule {
    ...
        {
          provide: APP_INITIALIZER,
          multi: true,
          useFactory: initializeLogger,
          deps: [LOGGER_CONFIG]
        }
    ...
}

export function initializeLogger(profile: LoggerProfile) {
  return () =>
    console.log('[logger] was initialized with profile: ' + profile);
}
```

7. The Logger should receive some data from a backend-system on application-startup. Check how this long-running request impacts the page-loading.

```
@NgModule({})
export class LoggerModule {
    ...
        {
          provide: APP_INITIALIZER,
          multi: true,
          useFactory: sendLogEventToBackend,
          deps: [LOGGER_CONFIG]
        }
    ...
}

export function sendLogEventToBackend(profile: LoggerProfile) {
  return () =>
    fetch('https://reqres.in/api/users?delay=3').then(() =>
      console.log('[logger] sent log event to backend')
    );
}
```

8. Find a solution to run the fetch-call by the `APP_INITIALIZER`-token without blocking the application-bootstrapping.