import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-blog1',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './blog1.component.html',
  styleUrl: './blog1.component.css'
})
export class Blog1Component {

}
