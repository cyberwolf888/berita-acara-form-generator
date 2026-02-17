"use client";

import { useId, useRef, useState } from "react";
import { ImageIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ImageUploadValue =
  | ""
  | {
      kind: "new-upload";
      dataUrl: string;
      fileName: string;
      mimeType: string;
      size: number;
    };

interface FileUploadProps {
  value: ImageUploadValue;
  onChange: (value: ImageUploadValue) => void;
  accept?: string;
  label?: string;
  maxSizeMB?: number;
}

export function FileUpload({
  value,
  onChange,
  accept = "image/*",
  label = "Upload file",
  maxSizeMB = 10,
}: FileUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  const previewSrc =
    typeof value === "string" ? value : (value.dataUrl ?? "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`Ukuran file maksimal ${maxSizeMB} MB.`);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    setError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) {
        setError("Gagal membaca file gambar.");
        return;
      }

      onChange({
        kind: "new-upload",
        dataUrl,
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange("");
    setError("");
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
      {previewSrc ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewSrc}
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
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
