import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CustomButtonComponent } from "../../shared/components/button-component/button.component";

@Component({
  selector: 'home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  imports: [
    CustomButtonComponent,
    RouterLink
  ]
})
export class HomeComponent {
}