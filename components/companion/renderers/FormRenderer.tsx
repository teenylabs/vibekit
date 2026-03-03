"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Section } from "@/lib/spec-types";

interface FormRendererProps {
  section: Section;
  onNavigate: (screenId: string) => void;
}

export function FormRenderer({ section, onNavigate }: FormRendererProps) {
  const props = section.props || {};
  const fields: any[] = props.fields || [];

  return (
    <Card>
      <CardContent className="p-6">
        {props.title && (
          <h3 className="text-h3 text-foreground mb-4">{props.title}</h3>
        )}
        <div className="space-y-4">
          {fields.map((field: any, index: number) => (
            <FieldRenderer key={field?.id || index} field={field} />
          ))}
          {fields.length === 0 && (
            <p className="text-small text-muted-foreground">No fields defined</p>
          )}
        </div>
        {props.submitLabel && (
          <div className="mt-6">
            <Button
              onClick={
                props.onSubmit?.navigateTo
                  ? () => onNavigate(props.onSubmit.navigateTo)
                  : undefined
              }
            >
              {props.submitLabel}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FieldRenderer({ field }: { field: any }) {
  if (!field) return null;

  const label = field.label || field.name || "Field";
  const placeholder = field.placeholder || "";
  const type = field.type || "input";

  switch (type) {
    case "textarea":
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <Textarea placeholder={placeholder} readOnly />
        </div>
      );

    case "select":
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {(field.options || ["Option 1", "Option 2", "Option 3"]).map(
                (opt: any, i: number) => {
                  const value = typeof opt === "string" ? opt : opt?.value || opt?.label || `opt-${i}`;
                  const optLabel = typeof opt === "string" ? opt : opt?.label || value;
                  return (
                    <SelectItem key={i} value={value}>
                      {optLabel}
                    </SelectItem>
                  );
                }
              )}
            </SelectContent>
          </Select>
        </div>
      );

    case "checkbox":
      return (
        <div className="flex items-center gap-2">
          <Checkbox id={`field-${label}`} />
          <Label htmlFor={`field-${label}`}>{label}</Label>
        </div>
      );

    case "switch":
      return (
        <div className="flex items-center justify-between">
          <Label>{label}</Label>
          <Switch />
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <Input
            type={type === "password" ? "password" : type === "email" ? "email" : "text"}
            placeholder={placeholder}
            readOnly
          />
        </div>
      );
  }
}
