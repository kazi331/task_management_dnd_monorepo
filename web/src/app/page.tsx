'use client'
import TicketsSheet from "@/components/TicketsSheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet } from "@/components/ui/sheet";
import { tickets as DummyTickets } from "@/lib/dummy";
import { Ticket, Status } from "@/lib/types";
import { Delete, Edit } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { v6 } from 'uuid';

export const statuses = ['backlog', 'progress', 'completed']

export default function Home() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [tickets, setTickets] = useState<Ticket[] | []>(DummyTickets);
  const [textValue, setTextValue] = useState<string>('');
  const [editContent, setEditContent] = useState<Ticket | null>(null)
  
  // Drag and drop state
  const [draggedTicket, setDraggedTicket] = useState<Ticket | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<number | null>(null);

  useEffect(() => {
    const localTickets = localStorage.getItem('tickets');
    if (localTickets) {
      setTickets(JSON.parse(localTickets))
    }
  }, [])

  // automatically update localstorage after adding/deleting/updating tickets
  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }, [tickets]);

  const handleAddTicket = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (textValue.trim()) {
        const newTicket: Ticket = {
          id: v6(),
          title: textValue,
          status: 'backlog'
        }
        setTickets(prev => ([...prev, newTicket]));
      } else {
        toast.error("Add ticket title first!")
      }
      setTextValue('')
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err?.message || 'Failed to add ticket')
      }
    }
  }

  const handleDelete = (id: string) => {
    try {
      setTickets(tickets.filter(item => item.id != id))
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err?.message || 'Failed to delete ticket!')
    }
  }

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, ticket: Ticket) => {
    setDraggedTicket(ticket);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add some visual feedback by setting opacity
    const target = e.target as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Reset visual states
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
    setDraggedTicket(null);
    setDragOverColumn(null);
    setDragOverPosition(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Allow drop
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnterColumn = (status: Status) => {
    setDragOverColumn(status);
  };

  const handleDragLeaveColumn = () => {
    setDragOverColumn(null);
    setDragOverPosition(null);
  };

  const handleDragOverTicket = (e: React.DragEvent, ticketIndex: number, status: Status) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Calculate if we're in the top or bottom half of the ticket
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const mouseY = e.clientY;
    
    // Set position based on mouse position relative to ticket center
    const position = mouseY < midpoint ? ticketIndex : ticketIndex + 1;
    setDragOverPosition(position);
    setDragOverColumn(status);
  };

  const handleDropOnColumn = (e: React.DragEvent, targetStatus: Status) => {
    e.preventDefault();
    
    if (!draggedTicket) return;

    // Get tickets in target column
    const columnTickets = tickets.filter(ticket => ticket.status === targetStatus);
    
    // Determine drop position
    let dropPosition = dragOverPosition !== null ? dragOverPosition : columnTickets.length;
    
    // Update ticket status and reorder
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === draggedTicket.id) {
        return { ...ticket, status: targetStatus };
      }
      return ticket;
    });

    // Reorder tickets within the target column
    const sourceTickets = updatedTickets.filter(ticket => ticket.status !== targetStatus);
    const targetColumnTickets = updatedTickets.filter(ticket => ticket.status === targetStatus);
    
    // Remove the dragged ticket from its current position
    const draggedTicketUpdated = targetColumnTickets.find(ticket => ticket.id === draggedTicket.id);
    const otherTicketsInColumn = targetColumnTickets.filter(ticket => ticket.id !== draggedTicket.id);
    
    // Insert at the correct position
    if (draggedTicketUpdated) {
      otherTicketsInColumn.splice(dropPosition, 0, draggedTicketUpdated);
    }
    
    // Combine all tickets back together
    const finalTickets = [...sourceTickets, ...otherTicketsInColumn];
    
    setTickets(finalTickets);
    toast.success(`Moved "${draggedTicket.title}" to ${targetStatus}`);
  };

  const getDropIndicatorStyle = (status: Status, position: number) => {
    if (dragOverColumn === status && dragOverPosition === position) {
      return "border-t-2 border-blue-500 border-dashed";
    }
    return "";
  };

  return (
    <div className="max-w-6xl mx-auto px-10">
      <Sheet open={sheetOpen} onOpenChange={() => setSheetOpen(pre => !pre)}>
        <h3 className="text-center my-2">Task Management Tool</h3>
        <form onSubmit={handleAddTicket} className="px-6 mt-4 flex flex-row gap-4 ">
          <Input type="text" onChange={({ target: { value } }) => setTextValue(value)} value={textValue} />
          <Button type="submit" className="w-[100px] active:bg-gray-400 cursor-pointer">Add</Button>
        </form>
        <div className="grid grid-cols-3 p-6 pt-2 gap-10 ">
          {
            statuses.map(status => (
              <Card 
                className={`p-2 transition-colors ${dragOverColumn === status ? 'bg-blue-50 border-blue-300' : ''}`} 
                key={status}
                onDragOver={handleDragOver}
                onDragEnter={() => handleDragEnterColumn(status as Status)}
                onDragLeave={handleDragLeaveColumn}
                onDrop={(e) => handleDropOnColumn(e, status as Status)}
              >
                <h2 className="text-center capitalize pb-2 border-b">{status}</h2>
                <ScrollArea className="max-h-[500px] p-2 pt-0">
                  {/* Drop indicator at the top */}
                  <div className={`h-1 ${getDropIndicatorStyle(status as Status, 0)}`} />
                  
                  {
                    tickets.filter(item => item.status == status).reverse().map((ticket, index) => {
                      const isBeingDragged = draggedTicket?.id === ticket.id;
                      return (
                        <div key={ticket.id}>
                          <Card 
                            className={`py-2 px-3 m-2 rounded-sm block relative cursor-grab active:cursor-grabbing transition-all ${
                              isBeingDragged ? 'opacity-50 transform rotate-2 scale-105 shadow-lg' : 'hover:shadow-md'
                            }`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, ticket)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOverTicket(e, index + 1, status as Status)}
                          >
                            <p className="text-sm capitalize">{ticket.title}</p>
                            <p className="text-xs capitalize">{ticket.description}</p>
                            <div className="flex flex-row items-center justify-between">
                              <Badge className="m-0 capitalize" variant="outline">
                                {ticket.status} {ticket?.id.toString().slice(0, 2)}
                              </Badge>
                              <div className="space-x-2">
                                <Button
                                  onClick={() => {
                                    setEditContent(ticket);
                                    setSheetOpen(true);
                                  }}
                                  variant="secondary" 
                                  className="w-6 h-6" 
                                  aria-label="Edit Ticket"
                                >
                                  <Edit className="w-full p-0.5" />
                                </Button>
                                <Button
                                  onClick={() => handleDelete(ticket.id.toString())}
                                  variant="secondary" 
                                  className="w-6 h-6" 
                                  aria-label="Delete Ticket"
                                >
                                  <Delete className="w-full p-0.5" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                          {/* Drop indicator below each ticket */}
                          <div className={`h-1 ${getDropIndicatorStyle(status as Status, index + 1)}`} />
                        </div>
                      )
                    })
                  }
                </ScrollArea>
              </Card>
            ))
          }
        </div>
        <TicketsSheet editContent={editContent} setEditContent={setEditContent} setSheetOpen={setSheetOpen} tickets={tickets} setTickets={setTickets} />
      </Sheet>
      <Toaster closeButton />
    </div>
  )
}