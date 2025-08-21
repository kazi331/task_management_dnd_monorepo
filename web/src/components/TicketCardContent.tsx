import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/lib/types";
import { Delete, Edit } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type PropsType = { ticket: Ticket, setEditContent: Dispatch<SetStateAction<Ticket | null>>, setSheetOpen: Dispatch<SetStateAction<boolean>>, handleDelete: (id: string) => void }

function TicketCardContent({ ticket, setEditContent, setSheetOpen, handleDelete }: PropsType) {
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
    </>
    )
}
export default TicketCardContent