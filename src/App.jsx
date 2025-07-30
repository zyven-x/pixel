import { useEffect, useState } from "react";
import { encrypt, decrypt } from "./utils/crypto";
import { supabase } from "./supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import NoteForm from "./components/NoteForm";
import VaultForm from "./components/VaultForm";
import NoteViewer from "./components/NoteViewer";
import VaultViewer from "./components/VaultViewer";
import PreviewImage from "./components/PreviewImage";
import NoteContent from "./components/NoteContent";
import PasswordContent from "./components/PasswordContent";
import Login from "./pages/Login";

export default function App() {
  const [vault, setVault] = useState([]);
  const [notes, setNotes] = useState([]);
  const [masterKey, setMasterKey] = useState("pixelmaster");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  const [form, setForm] = useState({
    site: "",
    email: "",
    password: "",
    url: "",
  });
  const [noteText, setNoteText] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteAttachment, setNoteAttachment] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState("view");
  const [previewImage, setPreviewImage] = useState(null);
  const [activePanel, setActivePanel] = useState("vault");
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [activeTab, setActiveTab] = useState("Notes");
  const [searchText, setSearchText] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [filteredVault, setFilteredVault] = useState([]);
  const isNotesTab = activeTab === "Notes";
  const user = useUser();
  const [profile, setProfile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, email")
        .eq("id", user.id)
        .maybeSingle();

      if (!data) {
        const defaultProfile = {
          id: user.id,
          username: user.user_metadata?.username || user.user_metadata?.full_name || "Pixel User",
          avatar_url: user.user_metadata?.avatar_url || "",
          email: user.email,
        };

        const { error: insertError } = await supabase
          .from("profiles")
          .insert(defaultProfile);

        if (!insertError) setProfile(defaultProfile);
      } else {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [user]);

  const handleEditUsername = async (newUsername) => {
    if (!newUsername) return;

    const { error } = await supabase
      .from("profiles")
      .update({ username: newUsername })
      .eq("id", user.id);

    if (!error) {
      setProfile((prev) => ({ ...prev, username: newUsername }));
    }
  };

  const handleEditAvatar = async () => {
    if (!user) return alert("You must be logged in.");

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async () => {
      const file = fileInput.files[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `avtars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avtars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Avtar upload failed:", uploadError.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avtars").getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (!updateError) {
        setProfile((prev) => ({ ...prev, avatar_url: publicUrl }));
      }
    };

    fileInput.click();
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const { data: vaultData } = await supabase
        .from("vault")
        .select("*")
        .eq("user_id", user.id);

      const { data: notesData } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id);

      setVault(vaultData || []);
      setNotes(notesData || []);
    };
    fetchData();
  }, [user]);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredNotes(notes);
      setFilteredVault(vault);
      return;
    }
    const lower = text.toLowerCase();
    if (activePanel === "notes") {
      const filtered = notes.filter(
        (note) =>
          note.title?.toLowerCase().includes(lower) ||
          note.content?.toLowerCase().includes(lower)
      );
      setFilteredNotes(filtered);
    } else {
      const filtered = vault.filter(
        (item) =>
          item.site?.toLowerCase().includes(lower) ||
          item.email?.toLowerCase().includes(lower)
      );
      setFilteredVault(filtered);
    }
  };

  const selectedEntry = selectedIndex !== null ? vault[selectedIndex] : null;
  const selectedNote =
    selectedNoteIndex !== null ? notes[selectedNoteIndex] : null;

  const handleSave = async () => {
    const { data, iv } = await encrypt(form.password, masterKey);
    const entry = {
      ...form,
      password: data,
      iv,
      created: new Date(),
      updated: new Date(),
      user_id: user.id,
    };
    const { error } = await supabase.from("vault").insert([entry]);
    if (error) return;
    const { data: updatedVault } = await supabase
      .from("vault")
      .select("*")
      .order("updated", { ascending: false });
    setVault(updatedVault);
    setForm({ site: "", email: "", password: "", url: "" });
    setMode("view");
    setSelectedIndex(updatedVault.length - 1);
  };

  const handleUpdate = async () => {
    const { data, iv } = await encrypt(form.password, masterKey);
    const target = vault[selectedIndex];
    const { error } = await supabase
      .from("vault")
      .update({
        site: form.site,
        email: form.email,
        password: data,
        iv,
        url: form.url,
        updated: new Date(),
      })
      .eq("id", target.id);
    if (error) return;
    const { data: updatedVault } = await supabase
      .from("vault")
      .select("*")
      .order("updated", { ascending: false });
    setVault(updatedVault);
    setForm({ site: "", email: "", password: "", url: "" });
    setMode("view");
  };

  const handleSaveNote = async () => {
    let attachmentUrl = null;
    if (noteAttachment) {
      const fileExt = noteAttachment.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `attachments/${fileName}`;
      const { error } = await supabase.storage
        .from("attachments")
        .upload(filePath, noteAttachment);
      if (error) return;

      attachmentUrl = filePath;
    }
    const { data: encryptedData, iv } = await encrypt(noteText, masterKey);
    const note = {
      title: noteTitle || `Note ${notes.length + 1}`,
      content: encryptedData,
      iv,
      created: new Date(),
      updated: new Date(),
      attachment: attachmentUrl,
      user_id: user.id,
    };
    const { error } = await supabase.from("notes").insert([note]);
    if (error) return;
    const { data: updatedNotes } = await supabase
      .from("notes")
      .select("*")
      .order("updated", { ascending: false });
    setNotes(updatedNotes);
    setNoteText("");
    setNoteTitle("");
    setNoteAttachment(null);
    setMode("notes");
    setSelectedNoteIndex(updatedNotes.length - 1);
  };

  const handleUpdateNote = async () => {
    const target = notes[selectedNoteIndex];
    const { data, iv } = await encrypt(noteText, masterKey);
    let attachmentUrl = target.attachment;
    if (noteAttachment) {
      const fileExt = noteAttachment.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `attachments/${fileName}`;
      const { error } = await supabase.storage
        .from("attachments")
        .upload(filePath, noteAttachment);
      if (error) return;

      attachmentUrl = filePath;
    }
    const { error } = await supabase
      .from("notes")
      .update({
        title: noteTitle,
        content: data,
        iv,
        attachment: attachmentUrl,
        updated: new Date(),
      })
      .eq("id", target.id);
    if (error) return;
    const { data: updatedNotes } = await supabase
      .from("notes")
      .select("*")
      .order("updated", { ascending: false });
    setNotes(updatedNotes);
    setMode("notes");
  };

  const handleDelete = async () => {
    if (activePanel === "notes" && selectedNoteIndex !== null) {
      const target = notes[selectedNoteIndex];
      await supabase.from("notes").delete().eq("id", target.id);
      const { data: updatedNotes } = await supabase.from("notes").select("*");
      setNotes(updatedNotes);
      setSelectedNoteIndex(null);
    } else if (selectedIndex !== null) {
      const target = vault[selectedIndex];
      await supabase.from("vault").delete().eq("id", target.id);
      const { data: updatedVault } = await supabase.from("vault").select("*");
      setVault(updatedVault);
      setSelectedIndex(null);
      setPreviewImage(null);
    }
  };

  const handleEditVault = async () => {
    const decryptedPassword = await decrypt(
      selectedEntry.password,
      masterKey,
      selectedEntry.iv
    );
    setForm({
      site: selectedEntry.site,
      email: selectedEntry.email,
      password: decryptedPassword,
      url: selectedEntry.url,
    });
    setMode("edit");
  };

  const handleEditNote = async () => {
    const decryptedNote = await decrypt(
      selectedNote.content,
      masterKey,
      selectedNote.iv
    );
    setNoteTitle(selectedNote.title);
    setNoteText(decryptedNote);
    setNoteAttachment(null);
    if (selectedNote.attachment) {
      const { data, error } = await supabase.storage
        .from("attachments")
        .createSignedUrl(selectedNote.attachment, 3600);

      if (!error && data?.signedUrl) {
        const updatedNotes = [...notes];
        updatedNotes[selectedNoteIndex].signedAttachment = data.signedUrl;
        setNotes(updatedNotes);
      }
    }
    setMode("edit-note");
  };

  const handleCancelVaultEdit = () => {
    setForm({ site: "", email: "", password: "", url: "" });
    setMode("view");
    setSelectedIndex(null);
  };

  const handleCancelNoteEdit = () => {
    setNoteTitle("");
    setNoteText("");
    setNoteAttachment(null);
    setMode("notes");
    setSelectedNoteIndex(null);
  };

  if (user === undefined) return null;
  if (!user) return <Login />;
  return (
    <div className="h-[100vh] bg-white text-black font-sans">
      <Header
        searchText={searchText}
        handleSearch={handleSearch}
        activePanel={activePanel}
        setMode={setMode}
        profile={profile}
        user={user}
        onEditUsername={handleEditUsername}
        onEditAvatar={handleEditAvatar}
        onSignOut={() => supabase.auth.signOut()}
      />
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          vault={vault}
          notes={notes}
          filteredVault={filteredVault}
          filteredNotes={filteredNotes}
          searchText={searchText}
          setSelectedIndex={setSelectedIndex}
          setSelectedNoteIndex={setSelectedNoteIndex}
          setMode={setMode}
          selectedIndex={selectedIndex}
          selectedNoteIndex={selectedNoteIndex}
        />
        <div className="w-[60vw] p-6 overflow-y-auto no-scrollbar">
          {(mode === "add" || mode === "edit") && (
            <VaultForm
              form={form}
              setForm={setForm}
              mode={mode}
              handleSave={handleSave}
              handleUpdate={handleUpdate}
              handleCancel={handleCancelVaultEdit}
            />
          )}
          {(mode === "add-note" || mode === "edit-note") && (
            <NoteForm
              mode={mode}
              noteTitle={noteTitle}
              setNoteTitle={setNoteTitle}
              noteText={noteText}
              setNoteText={setNoteText}
              noteAttachment={noteAttachment}
              setNoteAttachment={setNoteAttachment}
              notes={notes}
              selectedNoteIndex={selectedNoteIndex}
              handleSaveNote={handleSaveNote}
              handleUpdateNote={handleUpdateNote}
              handleCancelNoteEdit={handleCancelNoteEdit}
              setNotes={setNotes}
            />
          )}
          {mode === "notes" && selectedNote && (
            <NoteViewer
              selectedNote={selectedNote}
              selectedNoteIndex={selectedNoteIndex}
              masterKey={masterKey}
              handleEditNote={handleEditNote}
              handleDelete={handleDelete}
              previewImage={previewImageUrl}
              setPreviewImage={setPreviewImage}
              showMoreInfo={showMoreInfo}
              setShowMoreInfo={setShowMoreInfo}
            />
          )}
          {mode === "view" && selectedEntry && (
            <VaultViewer
              selectedEntry={selectedEntry}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              masterKey={masterKey}
              handleEditVault={handleEditVault}
              handleDelete={handleDelete}
              showMoreInfo={showMoreInfo}
              setShowMoreInfo={setShowMoreInfo}
            />
          )}
        </div>
      </div>
      <PreviewImage
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
      />
    </div>
  );
}
