export interface OrdersDTO {
    orderId: number;
  mainGuid?: string;

  parentGuid?: string;

  orderedDate?: Date;

  invoiceNo?: string;

  receiptNo?: string;

  driverId?: number;

  paid?: boolean;

  paymentDate?: Date;

  checkNo?: string;

  serviceId?: number;
  paymentReason?: number;

  licenceNo?: string;
  paidAll?: boolean;

  orderedBy?: string;

  cashier?: string;
  location?: number;
  serviceGuid?: string;

  serviceApplicationGuid?: string;
  customerName?: string;
  region?: string;
}