import { Penality } from "./penality";

export interface OrderDetailDTO{
  id: number;

  orderId?: number;

  amount?: number;

  interst?: number;

  paymentReason?: number;

  ticketNo?: string;

  accountCode?: string;

  isPenalty?: boolean;

  description?: string;

  mainGuid?: string;

  parentGuid?: string;
}


export interface OrderWithPenalityRequest {
  orderDetailDTO: OrderDetailDTO;
  penalityDTO: Penality;
}