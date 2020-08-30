export interface OrderBookItem{
    Type: 'ADD' | 'DELETE' | 'CANCEL' | 'EXECUTED' | 'EXECUTED_WITH_PRICE' | 'REPLACE',
    Shares? : string,
    Price? : string,
    Side? : 'S' | 'B',
    OrderID? : string,
    OriginalOrderID? : string,
    NewOrderID? : string,
    ExecutedShares?: string,
    CanceledShares?: string,
    Stock? : string,
    OrderBookName: 'SPY' | 'EQL',
}