import React from "react";
import Lucide from "@/Components/Base/Lucide";
import {FormInput} from "@/Components/Base/Form";

interface SearchControlProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function InlineTableSearch({value, onChange, placeholder = 'Поиск...'}: SearchControlProps) {
  return (
    <div className="flex flex-col p-5 sm:items-center sm:flex-row gap-y-2">
      <div>
        <div className="relative">
          <Lucide
            icon="Search"
            className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500"
          />
          <FormInput
            type="text"
            placeholder={placeholder}
            className="pl-9 sm:w-64 rounded-[0.5rem]"
            onChange={(e) => onChange(e.target.value)}
            value={value}
          />
        </div>
      </div>
    </div>
  );
}
