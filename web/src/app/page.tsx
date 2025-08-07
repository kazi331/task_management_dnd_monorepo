'use client'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { tickets as DummyTickets } from "@/lib/dummy";
import { Delete, Edit } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { v6 } from 'uuid';

type Status = 'backlog' | 'progress' | 'completed';
export interface Ticket {
  id: number | string;
  title: string;
  status: Status
  description?: string;
}
const statuses = ['backlog', 'progress', 'completed']

export default function Home() {
  const [sheetOpen, setsheetOpen] = useState(false)
  const [tickets, setTickets] = useState<Ticket[] | []>(DummyTickets);
  const [textValue, setTextValue] = useState<string>('');
  const [editContent, setEditContent] = useState<Ticket | null>(null)

  useEffect(() => {
    const localTickets = localStorage.getItem('tickets');
    if (localTickets) {
      setTickets(JSON.parse(localTickets))
    }
  }, [])

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
        // localStorage.setItem('tickets', JSON.stringify([...tickets, newTicket]))
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

  const handleTicketUpdate = () => {
    try {
      const editContentIndex: number = tickets.findIndex(ticket => ticket.id === editContent?.id);
      if (editContent && editContentIndex !== -1) {
        const updatedTickets = tickets.toSpliced(editContentIndex, 1, editContent);
        setTickets(updatedTickets);
        // localStorage.setItem('tickets', JSON.stringify(updatedTickets))
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err?.message || 'Failed to update ticket')
      }
    } finally {
      setsheetOpen(false)
    }
  }
  const handleChange = (key: keyof Ticket, value: string) => {
    if (editContent) {
      setEditContent({ ...editContent, [key]: value })
    }
  }

  const handleDelete = (id: string) => {
    try {
      tickets.splice(tickets.findIndex(item => item.id == id), 1);
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err?.message || 'Failed to delete ticket!')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-10">
      <Sheet open={sheetOpen} onOpenChange={() => setsheetOpen(pre => !pre)}>
        <h3 className="text-center my-2">Task Management Tool</h3>
        <form onSubmit={handleAddTicket} className="px-6 mt-4 flex flex-row gap-4 ">
          <Input type="text" onChange={({ target: { value } }) => setTextValue(value)} value={textValue} />
          <Button type="submit" className="w-[100px] active:bg-gray-400 cursor-pointer">Add</Button>
        </form>
        <div className="grid grid-cols-3 p-6 pt-2 gap-10 ">
          {
            statuses.map(status => (<Card className="p-2" key={status}>
              <h2 className="text-center capitalize pb-2 border-b">{status}</h2>
              <ScrollArea className="max-h-[500px] p-2 pt-0">
                {
                  tickets.filter(item => item.status == status).reverse().map(ticket => {
                    return <Card className="py-2 px-3 m-2 rounded-sm block relative" key={ticket.id}>
                      <p className="text-sm capitalize">{ticket.title}</p>
                      <p className="text-xs capitalize">{ticket.description}</p>
                      <div className="flex flex-row items-center justify-between">
                        <Badge className="m-0 capitalize" variant="outline">{ticket.status} {ticket?.id.toString().slice(0, 2)}</Badge>
                        <div className="space-x-2">
                          <Button
                            onClick={() => {
                              setEditContent(ticket);
                              setsheetOpen(true);
                            }}
                            variant="secondary" className="w-6 h-6" aria-label="Edit Ticket"><Edit className="w-full p-0.5" /> </Button>
                          <Button
                            onClick={() => handleDelete(ticket.id.toString())}
                            variant="secondary" className="w-6 h-6" aria-label="Delete Ticket"><Delete className="w-full p-0.5" /> </Button>
                        </div>
                      </div>
                    </Card>
                  })
                }
              </ScrollArea>
            </Card>
            )
            )
          }
        </div>
        <div className="space-y-2">
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{editContent?.title}</SheetTitle>
              <SheetDescription>{editContent?.description}</SheetDescription>
              <Badge className="m-0 capitalize" variant="outline">{editContent?.status}</Badge>
              <Input type="text" value={editContent?.title} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('title', e.target.value)} />
              <Textarea value={editContent?.description} onChange={(e) => handleChange('description', e.target.value)} />
              <Select value={editContent?.status} onValueChange={(status: Status) => handleChange('status', status)}>
                <SelectTrigger className="w-full capitalize">
                  <SelectValue className="capitalize" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(item => <SelectItem value={item} key={item} className="capitalize">{item}</SelectItem>)}
                </SelectContent>
              </Select>
            </SheetHeader>
            <SheetFooter className="grid grid-cols-1">
              <Button variant="outline" aria-label="Cancel" onClick={() => setsheetOpen(false)}>Cancel</Button>
              <Button variant="destructive" type="submit" aria-label="Save" onClick={handleTicketUpdate}>Save</Button>
            </SheetFooter>
          </SheetContent>
        </div>
      </Sheet>
      <Toaster closeButton />
    </div>
  )
}
