import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { OrderBookItem } from '../models/order-book-item.model';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { SubjectData } from '../models/subject-data.model';



@Injectable({
  providedIn: 'root'
})
export class OrderBookService {

  newItemSubject: Subject<Array<SubjectData>> = new Subject();
  currentOrderBookArray: Array<SubjectData> = [];
  orderBookData: Array<SubjectData> = [];
  currentReadPosition: number = 0;
  readInterval: number = 100;
  

  constructor(
    private http: HttpClient
  ) {
    this.generateOrderBooks();
  }

  private generateOrderBooks(){
    try {
      const spyJsonPath: string = '../../assets/SPY.json';
    const eqlJsonPath: string = '../../assets/EQL.json';
      this.http.get(spyJsonPath).pipe(
        switchMap((data: Array<OrderBookItem>) => {
          this.orderBookData.push({
            name: 'SPY',
            array: data
          });
          return this.http.get(eqlJsonPath);
        }),
      ).subscribe(
        (data: Array<OrderBookItem>) => {
          this.orderBookData.push({
            name: 'EQL',
            array: data
          });
          this.orderBookData.forEach(item => this.currentOrderBookArray.push({
            name: item.name,
            array: []
          }));
        },
        err => console.log(err)
      )
    } catch (error) {
      console.log('generateOrderBooks error' , error);
    }
  }

  setConfig(readInterval: number){
    this.readInterval = readInterval;
    this.readNewItem();
    this.setUpInterval();
  }

  private setUpInterval(){
    setInterval(() => this.readNewItem(), this.readInterval);
  }

  private readNewItem(){
    try {
      this.orderBookData.forEach(item => {
        const readField = item.array[this.currentReadPosition];
        if(readField.Type === 'ADD'){
          this.add(readField, item.name);
        } else if(readField.Type === 'DELETE'){
          this.delete(readField, item.name);
        } else if(readField.Type === 'REPLACE'){
          this.replace(readField, item.name);
        } else {
          this.execute(readField, item.name);
        }
      });
      this.currentReadPosition ++ ;
      this.newItemSubject.next(this.currentOrderBookArray);
    } catch (error) {
      console.log('readNewItem error', error);
    }
  }

  private add(item: OrderBookItem, orderBookName: 'SPY' | 'EQL'){
    this.currentOrderBookArray.find(item => item.name === orderBookName).array.push(item);
  }

  private delete(item: OrderBookItem, orderBookName: 'SPY' | 'EQL'){
    this.currentOrderBookArray.find(item => item.name === orderBookName).array.filter(elem => elem.OrderID !== item.OrderID );
  }

  private execute(item: OrderBookItem, orderBookName: 'SPY' | 'EQL'){
     const orderItem = this.currentOrderBookArray.find(item => item.name === orderBookName).array.find(elem => elem.OrderID === item.OrderID);
     let findItemShares = Number(orderItem.Shares);
     const executedShares = item.ExecutedShares ? Number(item.ExecutedShares) : Number(item.CanceledShares);
     if(findItemShares > executedShares){
      const resultShares = findItemShares - executedShares;
      orderItem.Shares = resultShares.toString();
     } else {
       this.delete(item, orderBookName);
     }
  }

  private replace(item: OrderBookItem, orderBookName: 'SPY' | 'EQL'){
    const orderItem = this.currentOrderBookArray.find(item => item.name === orderBookName).array.find(elem => elem.OrderID === item.OriginalOrderID);
    if(orderItem === undefined){
      return;
    }
    if(item.Price){
      orderItem.Price = item.Price;
    }
    if(item.Shares){
      orderItem.Shares = item.Shares;
    }
    orderItem.OrderID = item.NewOrderID;
  }
}
