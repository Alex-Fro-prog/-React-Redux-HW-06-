export interface TicketTime {
    departure: string;
    arrival: string;
}
  
export interface Ticket {
    id: number;
    from: string;
    to: string;
    company: string;
    price: number;
    currency: 'P';
    time: TicketTime;
    duration: number;
    date: string;
    connectionAmount: number | null;
}  