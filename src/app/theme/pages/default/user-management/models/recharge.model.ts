export class SubscriberDetailCommand {
    Dishd2hSubscriberID: string;
    Name: string;
    Status: number;
    RechargeAmount: number;
    MinimumRechargeAmount: number;
    SubscriberCategory: number;
}

export class OfferCommand {
    OfferID: number;
    OfferName: string;
    OfferDiscription: string;
    OfferAmount: number;
    offerIndex?: number;
}

export class GenerateTransactionforRechargeCommand {
    OTTSubscriberID: number;
    Dishd2hSubscriberID: string;
    OfferID: number;
    Amount: number;
    PaymentMode: string;
    PaymentGatewayDetails: string;
    Source: string;
    CallbackUrl: string;
}

export class UpdatePaymentStatusRechargeCommand {
    OTTSubscriberID: number;
    OrderID: string;
    TransactionNo: string;
    Amount: number;
    Status: string;
    PGResponse: string;
    DishD2HCustomerID: string;
}

export interface PaytmCommand {
    MID: string, // paytm provide
    WEBSITE: string, // paytm provide
    INDUSTRY_TYPE_ID: string, // paytm provide
    CHANNEL_ID: string, // paytm provide
    ORDER_ID: string, // unique id
    CUST_ID?: string, // customer id
    MOBILE_NO?: string, // customer mobile number
    EMAIL?: string, // customer email
    TXN_AMOUNT: string, // transaction amount
    CALLBACK_URL: string, // Call back URL that i want to redirect after payment fail or success
    CHECKSUMHASH: string
}


export interface PaytmResponseCommand {
    ORDERID: string,
    MID: string,
    TXNID: string,
    TXNAMOUNT: string,
    PAYMENTMODE: string,
    CURRENCY: string,
    TXNDATE: string,
    STATUS: string,
    RESPCODE: string,
    RESPMSG: string,
    GATEWAYNAME: string,
    BANKTXNID: string,
    BANKNAME: string,
    CHECKSUMHASH: string
}

export enum PaytmResponse {
    ORDERID,
    MID,
    TXNID,
    TXNAMOUNT,
    PAYMENTMODE,
    CURRENCY,
    TXNDATE,
    STATUS,
    RESPCODE,
    RESPMSG,
    GATEWAYNAME,
    BANKTXNID,
    BANKNAME,
    CHECKSUMHASH
}