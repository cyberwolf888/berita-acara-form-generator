"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImageIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ImageUploadValue =
  | ""
  | {
      kind: "pending";
      file: File;
      previewUrl: string;
      fileName: string;
      mimeType: string;
      size: number;
    }
  | {
      kind: "uploaded";
      storagePath: string;
      fileName: string;
      mimeType: string;
      size: number;
      previewUrl?: string;
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
  const localPreviewUrlRef = useRef<string | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    return () => {
      if (localPreviewUrlRef.current) {
        URL.revokeObjectURL(localPreviewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const activePendingPreview =
      typeof value === "object" && value.kind === "pending"
        ? value.previewUrl
        : null;

    if (
      localPreviewUrlRef.current &&
      localPreviewUrlRef.current !== activePendingPreview
    ) {
      URL.revokeObjectURL(localPreviewUrlRef.current);
      localPreviewUrlRef.current = null;
    }

    if (activePendingPreview) {
      localPreviewUrlRef.current = activePendingPreview;
    }
  }, [value]);

  const previewSrc =
    typeof value === "string"
      ? /^data:|^https?:\/\//.test(value)
        ? value
        : ""
      : value.kind === "pending"
        ? value.previewUrl
        : value.kind === "uploaded"
        ? (value.previewUrl ?? "")
        : "";

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

    if (localPreviewUrlRef.current) {
      URL.revokeObjectURL(localPreviewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    localPreviewUrlRef.current = previewUrl;

    onChange({
      kind: "pending",
      file,
      previewUrl,
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
    });
  };

  const handleRemove = () => {
    if (localPreviewUrlRef.current) {
      URL.revokeObjectURL(localPreviewUrlRef.current);
      localPreviewUrlRef.current = null;
    }

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
        <div className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewSrc}
            alt="Preview"
            className="h-24 w-auto rounded-md border object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={handleRemove}
          >
            <XIcon className="mr-1 size-4" />
            Hapus
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className={cn("w-full")}
          asChild
        >
          <label htmlFor={inputId} className="cursor-pointer">
            <ImageIcon className="mr-2 size-4" />
            {label}
          </label>
        </Button>
      )}
      {typeof value === "object" && !previewSrc ? (
        <p className="text-muted-foreground text-sm">{value.fileName}</p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
