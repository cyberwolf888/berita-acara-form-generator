"use client";

import { useId, useRef } from "react";
import { ImageIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  value: string;
  onChange: (base64: string) => void;
  accept?: string;
  label?: string;
}

export function FileUpload({
  value,
  onChange,
  accept = "image/*",
  label = "Upload file",
}: FileUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="sr-only"
      />
      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="h-24 w-auto rounded-md border object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon-xs"
            className="absolute -top-2 -right-2"
            onClick={handleRemove}
          >
            <XIcon className="size-3" />
          </Button>
        </div>
      ) : (
        <Button variant="outline" className={cn("w-full")} asChild>
          <label htmlFor={inputId} className="cursor-pointer">
            <ImageIcon className="mr-2 size-4" />
            {label}
          </label>
        </Button>
      )}
    </div>
  );
}
