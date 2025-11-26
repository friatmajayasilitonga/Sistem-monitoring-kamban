// Dashboard.jsx - VERSI TERBARU DENGAN FIX STICKY PLUS & PEGAWAI
import React, { useState } from "react";
import "./dashboard.css";
import { FaUserCircle, FaBars, FaSignOutAlt, FaPlus, FaSearch, FaFolderOpen, FaUsers, FaTachometerAlt, FaCalendarAlt } from "react-icons/fa";

// Data dummy untuk tampilan Anggota Tim (Pegawai)
const dummyTeamMembers = [
  { id: 1, name: "Budi Santoso", role: "Admin", email: "emailtams@o.com" },
  { id: 2, name: "Budi Musso", role: "Roler", email: "emailt@gmsa.com" },
  { id: 3, name: "Ria Mustika", role: "Role", email: "email@nas.com" },
  { id: 4, name: "Hari Susanto", role: "Retain", email: "email@gmiba.com" },
];

const initialColumns = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "inreview", title: "In Review" },
  { id: "done", title: "Done" },
];

const initialTasks = [
  { id: 1, columnId: "todo", content: "Desain Database Schema", avatar: "BS", priority: "Tinggi", meta: { assignee: "Budi Santoso", description: "Buat ERD dan skema DDL", startDate: "2025-11-20", endDate: "2025-11-25" } },
];

// --- Sub-Komponen Tampilan Pegawai ---
const TeamMembersView = () => (
  <div className="team-view">
    <h3>Anggota Tim (Team Members)</h3>
    <div className="member-list">
      {dummyTeamMembers.map((member) => (
        <div key={member.id} className="member-item-large">
          <div className="member-info">
            <div className="member-avatar">
              <FaUserCircle size={40} color="#0070c5" />
            </div>
            <div>
              <div className="member-name">
                {member.name} ({member.role})
              </div>
              <div className="member-email">{member.email}</div>
            </div>
          </div>
          <div className="member-actions">
            <span className="role-tag">{member.role}</span>
            <div className="member-role-input">
              <span className="member-display-name">{member.name}</span>
              <button className="remove-member">✕</button>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="team-actions">
      <button className="btn-cancel">Batal</button>
      <button className="btn-add-member">
        <FaPlus /> Tambah Anggota Tim
      </button>
    </div>
  </div>
);

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard"); // dashboard | laporan | pegawai
  const [columns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default Frame 4 (Open) for better navigation

  // form state
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState("Sedang");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    // reset form
    setTitle("");
    setAssignee("");
    setPriority("Sedang");
    setDescription("");
    setStartDate("");
    setEndDate("");
  }

  function handleCreateTask(e) {
    e.preventDefault();
    if (!title.trim()) return alert("Isi judul tugas terlebih dahulu.");
    if (!assignee.trim()) return alert("Isi penerima tugas terlebih dahulu.");

    const avatarLetters = assignee
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const newTask = {
      id: Date.now(),
      columnId: "todo",
      content: title,
      avatar: avatarLetters || "AN",
      priority: priority,
      meta: {
        assignee,
        description,
        startDate,
        endDate,
      },
    };
    setTasks((prev) => [newTask, ...prev]);
    closeModal();
  }

  // --- DRAG AND DROP HANDLERS ---
  function handleDragStart(e, taskId) {
    e.dataTransfer.setData("taskId", taskId);
  }

  function handleDragOver(e) {
    e.preventDefault();
    // Tambahkan visual feedback di sini jika perlu
  }

  function handleDrop(e, targetColumnId) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const draggedTask = tasks.find((t) => t.id == taskId);

    if (draggedTask && draggedTask.columnId !== targetColumnId) {
      setTasks((prevTasks) => prevTasks.map((t) => (t.id == taskId ? { ...t, columnId: targetColumnId } : t)));
    }
  }

  // --- END DRAG AND DROP HANDLERS ---

  const getPriorityColor = (prio) => {
    switch (prio) {
      case "Tinggi":
        return "#ff6b6b";
      case "Sedang":
        return "#feca57";
      case "Rendah":
        return "#1dd1a1";
      default:
        return "#ccc";
    }
  };

  function renderMainContent() {
    if (activeMenu === "pegawai") {
      return <TeamMembersView />; // Tampilan Data Pegawai
    }

    // Default: Kanban Dashboard
    return (
      <div className="kanban-wrapper">
        <div className="kanban-board">
          {columns.map((col) => (
            <div className="kanban-column" key={col.id} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, col.id)}>
              <div className="column-title">{col.title}</div>

              
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-root">
      {/* LEFT SIDEBAR (Frame 4) - Posisi Absolute agar tidak menggeser konten utama */}
      <aside className={`left-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="brand">
          <div className="brand-logo">PT. PNM</div>
        </div>
        <nav className="menu">
          <button className={`menu-btn ${activeMenu === "dashboard" ? "active" : ""}`} onClick={() => setActiveMenu("dashboard")}>
            <FaTachometerAlt /> <span>Dashboard</span>
          </button>
          <button className={`menu-btn ${activeMenu === "laporan" ? "active" : ""}`} onClick={() => setActiveMenu("laporan")}>
            <FaFolderOpen /> <span>Laporan Progres</span>
          </button>
          <button className={`menu-btn ${activeMenu === "pegawai" ? "active" : ""}`} onClick={() => setActiveMenu("pegawai")}>
            <FaUsers /> <span>Data Pegawai</span>
          </button>
        </nav>
        <div className="sidebar-bottom">
          <button className="logout-btn">
            <FaSignOutAlt /> Log out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="main-area">
        <header className="main-header">
          <div className="left-controls">
            {/* Toggle sidebar button (Frame 3 -> Frame 4) */}
            <FaBars className="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            <h2 className="header-title">Divisi ATI - Project Monitoring Dashboard</h2>
          </div>
          <div className="right-controls">
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <input className="search-input" placeholder="Search" />
            </div>
            <button className="btn-new" onClick={openModal}>
              <FaPlus /> New Task
            </button>
            <div className="profile-mini">
              {/* Profil Putih Polos */}
              <div className="avatar-placeholder"></div>
            </div>
          </div>
        </header>

        {/* Masking untuk menutup konten saat sidebar terbuka */}
        {isSidebarOpen && <div className="content-mask" onClick={() => setIsSidebarOpen(false)}></div>}

        <div className="content-area">
          {/* Context panel dihilangkan karena tidak ada di Frame 4 */}
          {renderMainContent()}
        </div>
      </div>

      {/* Modal (Frame 5) */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>
            <h3>Buat Tugas Baru</h3>
            <form onSubmit={handleCreateTask} className="task-form">
              <label>Judul Tugas</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tugas Baru" />
              <label>Penerima Tugas</label>
              <input value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="Syamus A." />
              <div className="priority-group">
                <label>Prioritas</label>
                <div className="priority-options">
                  {["Tinggi", "Sedang", "Rendah"].map((prio) => (
                    <label
                      key={prio}
                      className={`priority-tag ${prio === priority ? "active" : ""}`}
                      onClick={() => setPriority(prio)}
                      style={{ backgroundColor: prio === priority ? getPriorityColor(prio) : "#eee", color: prio === priority ? "#333" : "#333" }}
                    >
                      {prio}
                    </label>
                  ))}
                </div>
              </div>

              <label>Deskripsi Tugas</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Jelaskan detail end hasil yang diharapkan..." rows={3} />
              <div className="date-row">
                <div>
                  <label>Tanggal Mulai</label>
                  <div className="date-input-wrapper">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <FaCalendarAlt className="date-icon" />
                  </div>
                </div>
                <div>
                  <label>Batas Waktu (Due Date)</label>
                  <div className="date-input-wrapper">
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    <FaCalendarAlt className="date-icon" />
                  </div>
                </div>
              </div>
              <button className="btn-submit" type="submit">
                Buat Tugas
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
