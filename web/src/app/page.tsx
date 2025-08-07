'use client'
import TicketsSheet from "@/components/TicketsSheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet } from "@/components/ui/sheet";
import { tickets as DummyTickets } from "@/lib/dummy";
import { Status, Ticket } from "@/lib/types";
import { Delete, Edit } from "lucide-react";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import { v6 } from 'uuid';


export const statuses = ['backlog', 'progress', 'completed']

export default function Home() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [tickets, setTickets] = useState<Ticket[] | []>(DummyTickets);
  const [textValue, setTextValue] = useState<string>('');
  const [editContent, setEditContent] = useState<Ticket | null>(null)
  // drag and drop states
  const [isDragging, setIsDragging] = useState<string | number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<Status | string | null>(null);
  // const [dragOverPosition, setDragOverPosition] = useState<number | null>(null);


  // Refs to store the ID of the item being dragged and the drop target
  const dragItem = useRef<string | number | null>(null);
  const dragOverItem = useRef<string | number | null>(null);

  useEffect(() => {
    const localTickets = localStorage.getItem('tickets');
    if (localTickets) {
      setTickets(JSON.parse(localTickets))
    }
  }, [])

  // automatically update localstorage afeter adding/deleting/updating tickets
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

  const TicketCardContent = ({ ticket }: { ticket: Ticket }) => {
    return (<>
      <p className="text-sm capitalize">{ticket.title}</p>
      <p className="text-xs capitalize">{ticket.description}</p>
      <div className="flex flex-row items-center justify-between">
        <Badge className="m-0 capitalize" variant="outline">{ticket.status} {ticket?.id.toString().slice(0, 2)}</Badge>
        <div className="space-x-2">
          <Button
            onClick={() => {
              setEditContent(ticket);
              setSheetOpen(true);
            }}
            variant="secondary" className="w-6 h-6" aria-label="Edit Ticket"><Edit className="w-full p-0.5" /> </Button>
          <Button
            onClick={() => handleDelete(ticket.id.toString())}
            variant="secondary" className="w-6 h-6" aria-label="Delete Ticket"><Delete className="w-full p-0.5" /> </Button>
        </div>
      </div>
    </>)
  }

  // Drag and drop handlers
  const handleDragStart = (id: string | number) => {
    dragItem.current = id;
    setIsDragging(id);
  };

  const handleDragEnter = (id: string | number) => {
    dragOverItem.current = id;
  };

  const handleDragEnd = () => {
    setIsDragging(null);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, status: Status) => {
    // This function handles dropping a ticket in a new column or reordering within the same column.
    e.preventDefault();

    const draggedId = dragItem.current;
    const targetId = dragOverItem.current;

    if (!draggedId) return;

    // Find the dragged ticket
    const draggedTicket = tickets.find(ticket => ticket.id === draggedId);
    if (!draggedTicket) return;

    // Remove the dragged ticket from its original position
    const updatedTickets = tickets.filter(ticket => ticket.id !== draggedId);

    // Update the status of the dragged ticket if the column is different
    const updatedDraggedTicket = { ...draggedTicket, status: status };

    // Find the index of the drop target in the new list
    let dropIndex = updatedTickets.findIndex(ticket => ticket.id === targetId);

    // If there is no specific drop target (e.g., dropping into an empty column), add it to the end.
    if (dropIndex === -1) {
      dropIndex = updatedTickets.filter(ticket => ticket.status === status).length;
    }

    // Create a new array with the dragged item at the new position
    const newTickets = [...updatedTickets.slice(0, dropIndex), updatedDraggedTicket, ...updatedTickets.slice(dropIndex)];

    setTickets(newTickets);
    handleDragEnd(); // Reset the dragging state
  };

  return (
    <div className="max-w-6xl mx-auto px-10">
      <Sheet open={sheetOpen} onOpenChange={() => setSheetOpen(pre => !pre)}>
        <h3 className="text-center my-2">Task Management Tool</h3>
        <form onSubmit={handleAddTicket} className="px-6 mt-4 flex flex-row gap-4 ">
          <Input type="text" onChange={({ target: { value } }) => setTextValue(value)} value={textValue} />
          <Button type="submit" className="w-[100px] active:bg-gray-400 cursor-pointer">Add</Button>
        </form>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 p-6 pt-2 gap-10 ">
          {
            statuses.map(status => (
              <Card
                className={`p-2 transition-all duration-200 ${dragOverColumn === status ? "border-blue-300 bg-blue-50" : ""
                  }`} key={status}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOverColumn(status);
                }}
                onDragLeave={(e) => {
                  if (dragOverColumn === status) setDragOverColumn(null);
                }}
                onDrop={(e) => {
                  handleDrop(e, status)
                  setDragOverColumn(null);
                }}
              >
                <h2 className="text-center capitalize pb-2 border-b">{status}</h2>
                <ScrollArea className="max-h-[500px] p-2 pt-0">
                  {
                    tickets.filter(item => item.status == status).map(ticket => {
                      const isDraggingOver = dragOverItem.current == ticket.id;
                      return (
                        <div key={ticket.id}>
                          {/* not performant */}
                          {/* {isDraggingOver && <div className="border-t-2 border-dashed border-t-blue-300 m-2"></div>} */}
                          <Card
                            className={`py-2 m-2 px-3 rounded-sm block  ${isDragging === ticket.id ? 'opacity-50 ring-2 ring-blue-300' : ''}`}
                            // key={ticket.id}
                            draggable
                            onDragStart={() => handleDragStart(ticket.id)}
                            onDragEnter={() => handleDragEnter(ticket.id)}
                            onDragEnd={handleDragEnd}
                          >
                            <TicketCardContent ticket={ticket} />
                          </Card>
                        </div>
                      )
                    })
                  }
                </ScrollArea>
              </Card>
            )
            )
          }
        </div>
        <TicketsSheet
          editContent={editContent}
          setEditContent={setEditContent}
          setSheetOpen={setSheetOpen}
          tickets={tickets} setTickets={setTickets}
        />
      </Sheet>
      <Toaster closeButton />
    </div>
  )
}
