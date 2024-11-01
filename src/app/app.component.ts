import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {evaluate} from "@alansuprnation/evaluator";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly title = 'suprnation-test';
  public expression = evaluate("1+2+sin(24+cos(23))")

}
