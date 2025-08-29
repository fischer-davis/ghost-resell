import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Props {
  value: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export function DatePicker({ value, onDateChange }: Props) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  return (
    <div>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className="w-48 justify-between font-normal"
            id="date"
            variant="outline"
          >
            {date ? date.toLocaleDateString() : 'Select date'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto overflow-hidden p-0">
          <Calendar
            captionLayout="dropdown"
            mode="single"
            onSelect={(d) => {
              setDate(d);
              onDateChange(d);
              setOpen(false);
            }}
            selected={date}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
