import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js'
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js'


export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  #get_ticket_type_cost(ticket_type){

    let ticket_prices = [{"Ticket_Type":"ADULT","Price":20},{"Ticket_Type":"CHILD","Price":10},{"Ticket_Type":"INFANT","Price":0}]
    const ticket_obj = ticket_prices.filter(ticket => ticket.Ticket_Type === ticket_type)

    return ticket_obj[0]["Price"]
  }

  #get_total_bookings_from_req(ticket_req){
    let seats = 0;
    let total_tickets = 0;
    let total_cost = 0;

    for (let key in ticket_req) {

      let ticket_count = ticket_req[key];
      let ticket_price = this.#get_ticket_type_cost(key)
      total_cost+= (ticket_count*ticket_price);
      total_tickets+=ticket_count;

      if(key!="INFANT"){
        seats += ticket_count;
      }
   }
   return {"seats":seats,"total_tickets":total_tickets,"total_cost":total_cost}
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    Object.freeze(...ticketTypeRequests);

    let booking_details = this.#get_total_bookings_from_req(...ticketTypeRequests)
    let total_tickets = booking_details["total_tickets"];
    let total_cost = booking_details["total_cost"];
    let seats = booking_details["seats"];

    if(total_tickets>20){
     throw new InvalidPurchaseException("Booking Limit Exceeded");
    }

    if(((ticketTypeRequests[0]["INFANT"]>0 || ticketTypeRequests[0]["CHILD"]>0) && (ticketTypeRequests[0]["ADULT"]>0)) || (ticketTypeRequests[0]["ADULT"]>0)){

    let payment_instance = new TicketPaymentService()
    payment_instance.makePayment(accountId,total_cost);

    let reservation_instance = new SeatReservationService()
    reservation_instance.reserveSeat(accountId,seats);

    return {status:"success",details:booking_details}
    }
    throw new InvalidPurchaseException("No adult")
  }
}

let ticket_service = new TicketService();
export {ticket_service}
