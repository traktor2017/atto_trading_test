import { Component, OnInit, Input } from '@angular/core';
import {OrderBookService} from '../../serices/order-book.service';
import { OrderBookItem } from 'src/app/models/order-book-item.model';

@Component({
  selector: 'app-order-book',
  templateUrl: './order-book.component.html',
  styleUrls: ['./order-book.component.scss']
})
export class OrderBookComponent implements OnInit {

  @Input() fondName: 'SPY' | 'EQL' = 'SPY';
  @Input() amountItemsToShow: number = 20;
  orderBookArray: Array<OrderBookItem> = [];

  get orderBookBuyArray(){
    return this.orderBookArray.filter(item => item.Side === 'B').reverse().slice(0, this.amountItemsToShow);
  }

  get orderBookSellArray(){
    return this.orderBookArray.filter(item => item.Side === 'S').reverse().slice(0, this.amountItemsToShow);
  }


  constructor(private orderBookService: OrderBookService) { }

  ngOnInit(): void {
    this.orderBookService.newItemSubject.subscribe(
      data => {
        this.orderBookArray = data.find(item => item.name === this.fondName).array;
      }
    )
  }

}
