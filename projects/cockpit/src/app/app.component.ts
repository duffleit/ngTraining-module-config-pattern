import { Component } from '@angular/core';
import { LoggerService } from 'logger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public logMessage = '';

  public constructor(private logger: LoggerService) {}

  public createLog(): void {
    this.logger.logMessage(this.logMessage);
  }
}
