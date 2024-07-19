"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "../time-picker-input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface TimePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
}

const weekDays = [
    {
        name: "Minggu",
        value: 0
    },
    {
        name: "Senin",
        value: 1
    },
    {
        name: "Selasa",
        value: 2
    },
    {
        name: "Rabu",
        value: 3
    },
    {
        name: "Kamis",
        value: 4
    },
    {
        name: "Jumat",
        value: 5
    },
    {
        name: "Sabtu",
        value: 6
    },
]

export function TimePicker({ date, setDate }: TimePickerProps) {
    const minuteRef = React.useRef<HTMLInputElement>(null);
    const hourRef = React.useRef<HTMLInputElement>(null);
    const secondRef = React.useRef<HTMLInputElement>(null);

    const handleWeekDay = (val: string) => {
        const time = new Date().setDate(new Date(date || new Date()).getDate() + Number(val))
        const myDate = new Date(time)

        setDate(myDate)
    }

    return (
        <div className="flex items-center gap-2">
            <div className="grid gap-1 text-center ">
                <Select
                    onValueChange={handleWeekDay}
                    defaultValue={new Date(date || new Date()).getDay() + ""}
                >
                    <SelectTrigger className="h-9">
                        <SelectValue className="capitalize" placeholder={"Hari"} />
                    </SelectTrigger>
                    <SelectContent>
                        {weekDays.map(weekDay => (
                            <SelectItem key={weekDay.name} className="capitalize" value={`${weekDay.value}`}>{weekDay.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-1 text-center">
                <TimePickerInput
                    picker="hours"
                    date={date}
                    setDate={setDate}
                    ref={hourRef}
                    onRightFocus={() => minuteRef.current?.focus()}
                />
            </div>
            :
            <div className="grid gap-1 text-center">
                <TimePickerInput
                    picker="minutes"
                    date={date}
                    setDate={setDate}
                    ref={minuteRef}
                    onLeftFocus={() => hourRef.current?.focus()}
                    onRightFocus={() => secondRef.current?.focus()}
                />
            </div>
            <div className="flex h-10 items-center">
                <Clock className="ml-2 h-4 w-4" />
            </div>
        </div>
    );
}