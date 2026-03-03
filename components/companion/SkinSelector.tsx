"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import type { CompanionState } from "@/lib/spec-types";

interface SkinSelectorProps {
  selectedSkin: CompanionState["selectedSkin"];
  onSkinChange: (skin: CompanionState["selectedSkin"]) => void;
}

const skins = [
  { value: "custom", label: "Custom", color: "bg-violet-500" },
  { value: "modern-saas", label: "Modern SaaS", color: "bg-indigo-500" },
  { value: "warm-friendly", label: "Warm & Friendly", color: "bg-amber-500" },
  {
    value: "dark-technical",
    label: "Dark & Technical",
    color: "bg-emerald-500",
  },
] as const;

export function SkinSelector({ selectedSkin, onSkinChange }: SkinSelectorProps) {
  return (
    <Select
      value={selectedSkin}
      onValueChange={(v) => onSkinChange(v as CompanionState["selectedSkin"])}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select skin" />
      </SelectTrigger>
      <SelectContent>
        {skins.map((skin) => (
          <SelectItem key={skin.value} value={skin.value}>
            <span className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${skin.color}`} />
              {skin.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
