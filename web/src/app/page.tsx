
'use client'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { todos as DummyTodos } from "@/lib/dummy";
import { Edit } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { toast, Toaster } from "sonner";
import { v6 } from 'uuid';

type Status = 'backlog' | 'progress' | 'completed';
export interface Todo {
  id: number | string;
  title: string;
  status: Status
  descrition?: string;
}
const statuses = ['backlog', 'progress', 'completed']

export default function Home() {
  const [sheetOpen, setsheetOpen] = useState(false)
  const [todos, setTodos] = useState<Todo[] | []>(DummyTodos);
  const [textValue, setTextValue] = useState<string>('');
  const [editContent, setEditContent] = useState<Todo | null>(null)

  const handleSubmit = (e: any) => {
    e.preventDefault();
    try {
      if (textValue) {
        const newTodo: Todo = {
          id: v6(),
          title: textValue,
          status: 'backlog'
        }
        setTodos([...todos, newTodo])
      } else {
        // alert('Add todo title')
        toast.error("Add todo title first!")
      }
      setTextValue('')
    } catch (err: any) {
      console.log(err?.message)
    }
  }

  const handleUpdate = (e: any) => {
    e.preventDefault();
    try {
      const editContentIndex: number = todos.findIndex(todo => todo.id === editContent?.id);
      if (editContent && editContentIndex !== -1) {
        setTodos(todos.toSpliced(editContentIndex, 1, editContent));
      }
    } catch (err: any) {
      toast.error('Failed to update todo')
    } finally {
      setsheetOpen(false)
    }

  }

  return (
    <div className="max-w-6xl mx-auto px-10">
      <Sheet open={sheetOpen} onOpenChange={() => setsheetOpen(pre => !pre)}>
        <h3 className="text-center my-2">Task Management Tool</h3>
        <form onSubmit={handleSubmit} className="px-6 mt-4 flex flex-row gap-4 ">
          <Input type="text" onChange={({ target: { value } }) => setTextValue(value)} value={textValue} />
          <Button type="submit" className="w-[100px] active:bg-gray-400 cursor-pointer">Add</Button>
        </form>
        <div className="grid grid-cols-3 p-6 pt-2 gap-10 ">
          {
            statuses.map(status => (<Card className="p-2" key={status}>
              <h2 className="text-center capitalize pb-2 border-b">{status}</h2>
              <ScrollArea className="max-h-[500px] p-2 pt-0">
                {
                  todos.filter(item => item.status == status).reverse().map(todo => {
                    return <Card className="py-2 px-3 m-2 rounded-sm block relative" key={todo.id}>
                      <p className="text-sm capitalize">{todo.title}</p>
                      <p className="text-xs capitalize">{todo.descrition}</p>
                      <div className="flex flex-row items-center justify-between">
                        <Badge className="m-0 capitalize" variant="outline">{todo.status} {todo?.id.toString().slice(0, 2)}</Badge>
                        {/* <SheetTrigger asChild> */}
                        <Button onClick={() => {
                          setEditContent(todo);
                          setsheetOpen(true);
                        }} size="icon" variant="secondary" className="w-6 h-6"><Edit className="w-full p-0.5" /> </Button>
                        {/* </SheetTrigger> */}
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
              <SheetDescription>{editContent?.descrition}</SheetDescription>
              <Badge className="m-0 capitalize" variant="outline">{editContent?.status}</Badge>
              <Input type="text" value={editContent?.title} onChange={(e: ChangeEvent<HTMLInputElement>) => editContent ? setEditContent({ ...editContent, title: e.target.value }) : null} />
              <Textarea value={editContent?.descrition} onChange={(e) => editContent ? setEditContent({ ...editContent, descrition: e.target.value }) : null} />
              <Select onValueChange={(status: Status) => editContent ? setEditContent({ ...editContent, status: status }) : null}>
                <SelectTrigger className="w-full capitalize">
                  <SelectValue className="capitalize" vocab="hello" placeholder={editContent?.status} />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(item => <SelectItem value={item} key={item} className="capitalize">{item}</SelectItem>)}
                </SelectContent>
              </Select>
            </SheetHeader>
            <SheetFooter className="grid grid-cols-1">
              {/* <SheetClose asChild> */}
              <Button variant="outline" onClick={() => setsheetOpen(false)}>Cancel</Button>
              {/* </SheetClose> */}
              {/* <SheetClose asChild> */}
              <Button variant="destructive" type="submit" onClick={handleUpdate}>Save</Button>
              {/* </SheetClose> */}
            </SheetFooter>
          </SheetContent>
        </div>
      </Sheet>
      <Toaster closeButton />
    </div>
  )
}
