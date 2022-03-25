export interface SubscriptionDetailCommand {
    Discount: number;
    IsSubscribed: number;
    SubscriptionActualPrice: number;
    SubscriptionPlanDescription: string;
    SubscriptionPlanDuration: number;
    SubscriptionPlanID: number;
    SubscriptionPlanName: string;
    SubscriptionPrice: number;
}

export enum PaymentMethod {
    WALLET,
    PAYMENT_GATEWAY,
    CREDIT_CARD,
    DEBIT_CARD,
    DISHD2H_WALLET,
    NET_BANKING,
    UPI
}

export class SubscriptionRequestWithPrepaidBalanceCommand {
    OTTSubscriberID: number;
    SubscriptionPlanID: number;
    CoupenCode: string;
    Discount: number;
    TotalPayableAmount: number;
    IsAutoRenewal: number;
    Source: string;
}

export class UpdatePaymentStatusCommand {
    OTTSubscriberID: number;
    OrderID: string;
    TransactionNo: string;
    TotalPayableAmount: number;
    Status: string;
    PGResponse: string
}

export class SubscriptionRequestWithPaymentCommand {
    OTTSubscriberID: number;
    SubscriptionPlanID: number;
    CoupenCode: string;
    Discount: number;
    TotalPayableAmount: Number;
    IsAutoRenewal: number;
    PaymentMode: string;
    PaymentGatewayDetails: string;
    Source: string;
    PaymentGatewayID: any;
    SubscriptionParam?: any;
}

export class PayTMRequesrBody {
    requestType: string;
    mid: string;
    websiteName: string;
    orderId: string;
    subscriptionAmountType: string;
    subscriptionFrequency: string;
    subscriptionFrequencyUnit: string;
    subscriptionStartDate: string;
    subscriptionGraceDays: string;
    subscriptionExpiryDate: string;
    subscriptionEnableRetry: string;
    txnAmount: any;
    userInfo: any;
    callbackUrl: string;
}

export interface InitiatePayTMRequest {
    body: PayTMRequesrBody;
    head: any;
}

export interface PaytmSvodCommand {
    mid: string,
    orderId: string,
    txnToken: string
}

export class UpdatePaytmPaymentStatusCommand {
    OTTSubscriberID: number;
    OrderID: string;
    TransactionNo: string;
    TotalPayableAmount: number;
    Status: string;
    SubscriptionID: string;
    AutoRenewalStatus: string;
    PaymentGatewayToken: string;
    PGResponse: string;
}
export class CancelSvodRequestCommand {
    OTTSubscriberID: number;
    PaymentGatewayID: string;
    Source: string;
    SubscriptionParam: any;
}
export class CancelPayTMRequestBody {
    mid: string;
    subsId: string;
}
export class CancelPaytmSubscriptionCommand {
    body: CancelPayTMRequestBody;
    head: any;
}

export class CancelSubscriptionRequestCommand {
    OTTSubscriberID: number;
    PaymentGatewayID: string;
    Source: string;
    Status: string;
}