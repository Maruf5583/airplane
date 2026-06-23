import { Plane, Download, FileText, CheckCircle2, Armchair } from 'lucide-react';
import { format } from 'date-fns';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { useDownloadTicket, useDownloadBoardingPass, useCheckIn } from '../../hooks/useTickets';

export default function TicketCard({ ticket }) {
  const downloadTicket = useDownloadTicket();
  const downloadBoardingPass = useDownloadBoardingPass();
  const checkIn = useCheckIn();

  const canCheckIn = !ticket.isCheckedIn;

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-mono text-xs text-slate-400 mb-1">{ticket.ticketNumber}</p>
          <h3 className="font-semibold text-slate-800">{ticket.passengerName}</h3>
        </div>
        {ticket.isCheckedIn ? (
          <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium bg-emerald-50 px-2.5 py-1 rounded-full">
            <CheckCircle2 size={13} /> Checked In
          </span>
        ) : (
          <span className="text-amber-600 text-xs font-medium bg-amber-50 px-2.5 py-1 rounded-full">
            Not Checked In
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
          <Plane size={16} className="text-primary-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-700">
            {ticket.flightNumber} · {ticket.airlineName}
          </p>
          <p className="text-xs text-slate-400">
            {ticket.originIata} → {ticket.destinationIata} ·{' '}
            {format(new Date(ticket.departureTime), 'MMM d, h:mm a')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Badge status={ticket.seatClass} />
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <Armchair size={14} className="text-slate-400" />
          Seat {ticket.seatNumber || 'Not assigned'}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon={FileText}
          onClick={() => downloadTicket.mutate(ticket.ticketNumber)}
          isLoading={downloadTicket.isPending}
        >
          E-Ticket
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon={Download}
          onClick={() => downloadBoardingPass.mutate(ticket.ticketNumber)}
          isLoading={downloadBoardingPass.isPending}
        >
          Boarding Pass
        </Button>
        {canCheckIn && (
          <Button
            size="sm"
            icon={CheckCircle2}
            onClick={() => checkIn.mutate(ticket.ticketNumber)}
            isLoading={checkIn.isPending}
          >
            Check In
          </Button>
        )}
      </div>
    </div>
  );
}