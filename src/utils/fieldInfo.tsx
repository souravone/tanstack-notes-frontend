import type { AnyFieldApi } from "@tanstack/react-form";

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <div className="min-h-[24px]">
      {field.state.meta.isTouched && !field.state.meta.isValid
        ? field.state.meta.errors.map((err) => (
            <em className="text-rose-400" key={err.message}>
              {err.message}
            </em>
          ))
        : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </div>
  );
}
