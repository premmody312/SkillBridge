"use client";
export default function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
      <textarea
        {...props}
        className={`w-full p-2 border rounded text-sm ${props.className ?? ""}`}
      />
    );
  }
  