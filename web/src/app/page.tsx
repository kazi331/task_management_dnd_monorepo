'use client'
import TicketCardContent from "@/components/TicketCardContent";
import TicketsSheet from "@/components/TicketsSheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet } from "@/components/ui/sheet";
import { tickets as DummyTickets, statuses } from "@/lib/dummy";
import { IdType, Status, Ticket } from "@/lib/types";
import { ChangeEvent, DragEvent, useEffect, useState, } from "react";
import { toast, Toaster } from "sonner";
import { v6 } from 'uuid';

export default function Home() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [tickets, setTickets] = useState<Ticket[] | []>(DummyTickets);
  const [textValue, setTextValue] = useState<string>('');
  const [editContent, setEditContent] = useState<Ticket | null>(null)

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

  const handleDelete = (id: IdType,) => {
    try {
      setTickets(tickets.filter(item => item.id != id))
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err?.message || 'Failed to delete ticket!')
    }
  }

  // dnd functions
  const dragStart = (e: DragEvent<HTMLDivElement>, id: IdType) => {
    // e.preventDefault();
    e.dataTransfer.setData('text/json', id.toString());
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.5'
    e.currentTarget.style.cursor = 'grabbing'

  }
  const handleDrop = (e: any, newStatus: Status) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('text/json');
    console.log({ ticketId })
    try {
      setTickets(prev =>
        prev.map(ticket =>
          ticket.id.toString() === ticketId
            ? { ...ticket, status: newStatus }
            : ticket
        )
      );
      toast.success('Ticket moved successfully!');
    } catch (err) {
      toast.error('Failed to move ticket');
    }
  };
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-10">
      <Sheet open={sheetOpen} onOpenChange={() => setSheetOpen(pre => !pre)}>
        <h3 className="text-center my-2">Task Management Tool</h3>
        <form onSubmit={handleAddTicket} className="p-2 lg:px-6 mt-4 flex flex-row gap-4 ">
          <Input type="text" onChange={({ target }) => setTextValue(target.value)} value={textValue} />
          <Button type="submit" className="w-[100px] active:bg-gray-400 cursor-pointer">Add</Button>
        </form>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 p-2 lg:p-6 pt-2 gap-10 ">
          {
            statuses.map(status => (
              <Card
                onDragOver={e => {
                  e.preventDefault();
                  e.dataTransfer.effectAllowed = 'move'
                }}
                onDrop={e => handleDrop(e, status)}
                className="p-2" key={status}
              >
                <h2 className="text-center capitalize pb-2 border-b">{status}</h2>
                <ScrollArea className="max-h-[500px] p-2 pt-0">
                  {
                    tickets.filter(item => item.status == status)
                      .reverse()
                      .map(ticket => (
                        <Card
                          draggable
                          onDragStart={(e) => dragStart(e, ticket.id)}
                          onDragEnd={(e: DragEvent<HTMLDivElement>) => {
                            e.currentTarget.style.cursor = 'default';
                          }}
                          className="py-2 px-3 m-2 rounded-sm block relative active:cursor-grabbing "
                          key={ticket.id}
                        >
                          <TicketCardContent
                            ticket={ticket}
                            handleDelete={handleDelete}
                            setEditContent={setEditContent}
                            setSheetOpen={setSheetOpen}
                          />
                        </Card>
                      ))
                  }
                </ScrollArea>
              </Card>
            ))
          }
        </div>
        <TicketsSheet
          editContent={editContent}
          setEditContent={setEditContent}
          setSheetOpen={setSheetOpen}
          tickets={tickets}
          setTickets={setTickets} />
      </Sheet>
      <Toaster closeButton />
    </div>
  )
}
