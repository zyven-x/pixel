import React from "react";

export default function VaultForm({
  mode,
  form,
  setForm,
  handleUpdate,
  handleSave,
  handleCancelVaultEdit,
}) {
  return (
    <div className="max-w-lg space-y-4">
      <h2 className="text-lg font-bold">
        {mode === "edit" ? "Edit Credential" : "Add New Credential"}
      </h2>

      {/* site */}
      <input
        className="input"
        placeholder="Site"
        value={form.site}
        onChange={(e) => setForm({ ...form, site: e.target.value })}
      />

      {/* email */}
      <input
        className="input"
        placeholder="Email / Username"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      {/* pass */}
      <input
        className="input"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {/* web-url */}
      <input
        className="input"
        placeholder="Website URL"
        value={form.url}
        onChange={(e) => setForm({ ...form, url: e.target.value })}
      />
      <button
        className="btn-primary"
        onClick={mode === "edit" ? handleUpdate : handleSave}
      >
        Save
      </button>
      {mode === "edit" && (
        <button className="btn-secondary mx-3" onClick={handleCancelVaultEdit}>
          Cancel
        </button>
      )}
    </div>
  );
}
