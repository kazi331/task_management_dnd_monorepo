import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { statuses } from "@/lib/dummy";
import { Status, Ticket } from "@/lib/types";
import { ChangeEvent, Dispatch, memo, SetStateAction } from "react";
import { toast } from "sonner";

type TicketProps = {
    editContent: Ticket | null,
    setEditContent: Dispatch<SetStateAction<Ticket | null>>,
    setSheetOpen: Dispatch<SetStateAction<boolean>>,
    tickets: Ticket[],
    setTickets: Dispatch<SetStateAction<Ticket[]>>
}

function TicketsSheet({ editContent, setEditContent, setSheetOpen: setSheetOpen, tickets, setTickets }: TicketProps) {
    const handleChange = (key: keyof Ticket, value: string) => {
        if (editContent) {
            setEditContent({ ...editContent, [key]: value })
        }
    }

    const handleTicketUpdate = () => {
        try {
            const editContentIndex: number = tickets.findIndex(ticket => ticket.id === editContent?.id);
            if (editContent && editContentIndex !== -1) {
                const updatedTickets = tickets.toSpliced(editContentIndex, 1, editContent);
                setTickets(updatedTickets);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err?.message || 'Failed to update ticket')
            }
        } finally {
            setSheetOpen(false)
        }
    }
    return (
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
                    <Button variant="outline" aria-label="Cancel" onClick={() => setSheetOpen(false)}>Cancel</Button>
                    <Button variant="destructive" type="submit" aria-label="Save" onClick={handleTicketUpdate}>Save</Button>
                </SheetFooter>
            </SheetContent>
        </div>
    )
}
export default memo(TicketsSheet)