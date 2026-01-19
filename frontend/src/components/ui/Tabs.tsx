type TabKey = "detail" | "translation" | "ocr";

export function Tabs({
  value,
  onChange,
}: {
  value: TabKey;
  onChange: (v: TabKey) => void;
}) {
  const items: { key: TabKey; label: string }[] = [
    { key: "detail", label: "DETAIL" },
    { key: "translation", label: "TRANSLATION" },
    { key: "ocr", label: "OCR RAW" },
  ];

  return (
    <div className="flex gap-6 border-b border-neutral-200">
      {items.map((it) => (
        <button
          key={it.key}
          type="button"
          onClick={() => onChange(it.key)}
          className={[
            "py-3 text-sm font-semibold",
            value === it.key
              ? "border-b-2 border-neutral-900 text-neutral-900"
              : "text-neutral-500 hover:text-neutral-900",
          ].join(" ")}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
