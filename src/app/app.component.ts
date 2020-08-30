import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrderBookService } from './serices/order-book.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  setupGroup: FormGroup = new FormGroup({
    timeControl: new FormControl('', [Validators.required, Validators.min(300)]),
    depthControl: new FormControl('',[ Validators.required, Validators.min(1)])
  });

  isOrderBooksLive: boolean = false;

  get depthControlValue(): number{
    return this.setupGroup.get('depthControl').value;
  }

  constructor(private orderBookService: OrderBookService){}

  startOrderBooks(){
    this.isOrderBooksLive = true;
    this.orderBookService.setConfig(Number(this.setupGroup.get('timeControl').value) );
    this.setupGroup.disable();
  }


}
