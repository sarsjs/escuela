"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import * as htmlToImage from "html-to-image";

type Props = {
  name: string;
  role: string;
  cycle?: string;
  avatarUrl?: string;
  idLabel: string;
};

export function IdCard({ name, role, cycle, avatarUrl, idLabel }: Props) {
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const [generating, setGenerating] = React.useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#fff",
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${name.replace(/\s+/g, "_")}_credencial.png`;
      link.click();
    } catch (error) {
      console.error("ID card download error", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-3">
      <div
        ref={cardRef}
        className="w-full max-w-sm rounded-2xl border border-border bg-gradient-to-br from-slate-900 to-blue-900 px-6 py-5 text-white shadow-xl"
      >
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-2xl border border-white/60 bg-white/20">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-lg font-semibold uppercase">
                {name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              EDCHAIN MEMBER
            </p>
            <p className="text-lg font-bold leading-snug">{name}</p>
            <p className="text-sm text-white/70">{role}</p>
          </div>
        </div>
        {cycle && (
          <div className="mt-4 flex items-center justify-between">
            <span className="rounded-full border border-white/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              {cycle}
            </span>
            <span className="text-xs font-semibold tracking-[0.3em] text-white/70">
              {idLabel}
            </span>
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        className="w-full max-w-sm"
        onClick={handleDownload}
        disabled={generating}
      >
        {generating ? "Generando..." : "Descargar credencial"}
      </Button>
    </div>
  );
}
