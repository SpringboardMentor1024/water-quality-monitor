import { useState, useEffect } from "react";

export default function AddEditReadingModal({
  open,
  onClose,
  onSave,
  station,
  initialData,
}) {
  const [form, setForm] = useState({
    ph: "",
    temperature: "",
    turbidity: "",
    do: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ph: initialData.ph ?? "",
        temperature: initialData.temperature ?? "",
        turbidity: initialData.turbidity ?? "",
        do: initialData.do ?? "",
      });
    } else {
      setForm({ ph: "", temperature: "", turbidity: "", do: "" });
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onSave({
      station,
      ph: form.ph === "" ? null : Number(form.ph),
      temperature:
        form.temperature === "" ? null : Number(form.temperature),
      turbidity:
        form.turbidity === "" ? null : Number(form.turbidity),
      do: form.do === "" ? null : Number(form.do),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[380px] rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">
          {initialData ? "Edit Reading" : "Add Reading"}
        </h3>

        {["ph", "temperature", "turbidity", "do"].map((f) => (
          <input
            key={f}
            name={f}
            value={form[f]}
            onChange={handleChange}
            placeholder={f.toUpperCase()}
            className="w-full border rounded px-3 py-2"
          />
        ))}

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#4FA3B5] text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
