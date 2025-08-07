'use client'
import TicketCardContent from "@/components/TicketCardContent";
import TicketsSheet from "@/components/TicketsSheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet } from "@/components/ui/sheet";
import { tickets as DummyTickets } from "@/lib/dummy";
import { Ticket } from "@/lib/types";
import { ChangeEvent, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { v6 } from 'uuid';


export const statuses = ['backlog', 'progress', 'completed']

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

  const handleDelete = (id: string) => {
    try {
      setTickets(tickets.filter(item => item.id != id))
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err?.message || 'Failed to delete ticket!')
    }
  }

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
              <Card className="p-2" key={status}>
                <h2 className="text-center capitalize pb-2 border-b">{status}</h2>
                <ScrollArea className="max-h-[500px] p-2 pt-0">
                  {
                    tickets.filter(item => item.status == status)
                      .reverse()
                      .map(ticket => (
                        <Card className="py-2 px-3 m-2 rounded-sm block relative" key={ticket.id}>
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
