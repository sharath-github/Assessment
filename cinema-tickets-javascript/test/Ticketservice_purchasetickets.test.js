import {assert} from "chai";
import { describe,it } from "mocha";
import {ticket_service} from "../src/pairtest/TicketService.js"

describe( "Function: purchaseTickets", () =>
{
	it( "Should be defined", () =>
	{
		const is_function = typeof ticket_service.purchaseTickets === "function";
		assert.isTrue( is_function );
	});

	it( "Should throw error if user tries to book more than 20 tickets", () =>
	{
		try
		{
			ticket_service.purchaseTickets(2014,{"INFANT":1,"ADULT":20,"CHILD":2});
		}
		catch ( e )
		{
			assert.equal( e.message,"Booking Limit Exceeded");
		}
	});

	it( "Should throw error if user tries to book adult or infant ticket without an adult ticket", () =>
	{
		try
		{
			ticket_service.purchaseTickets(2014,{"INFANT":1,"ADULT":0,"CHILD":2});
		}
		catch ( e )
		{
			assert.equal( e.message,"No adult");
		}
	});

	it( "Should return status as success with details of booking when successfully booked tickets", () =>
	{
		try
		{
			const result = ticket_service.purchaseTickets(2014,{"INFANT":1,"ADULT":1,"CHILD":2});
			assert.strictEqual( "success", result["status"] )
			assert.strictEqual(3, result["details"].seats )
			assert.strictEqual(4, result["details"].total_tickets )
			assert.strictEqual(40, result["details"].total_cost )
		}
		catch ( e )
		{
			assert.Throw( e );
		}
	});
});

