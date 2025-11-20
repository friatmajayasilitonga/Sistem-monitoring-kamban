// Dashboard.jsx
import React, { useState } from "react";
import "./dashboard.css";
import {
  FaUserCircle,
  FaBars,
  FaSignOutAlt,
  FaPlus,
  FaSearch,
  FaFolderOpen,
  FaUsers,
  FaTachometerAlt,
} from "react-icons/fa";

const initialColumns = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "inreview", title: "In Review" },
  { id: "done", title: "Done" },
];

const initialTasks = [
  { id: 1, columnId: "todo", content: "Desain Database Schema", avatar: "JC" },
];

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard"); // dashboard | laporan | pegawai
  const [columns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // form state
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
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
    setDescription("");
    setStartDate("");
    setEndDate("");
  }

  function handleCreateTask(e) {
    e.preventDefault();
    if (!title.trim()) return alert("Isi judul tugas terlebih dahulu.");

    const newTask = {
      id: Date.now(),
      columnId: "todo",
      content: title,
      avatar: assignee ? assignee.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : "AN",
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

  function renderSidebarContent() {
    if (activeMenu === "dashboard") {
      return (
        <div className="sidebar-content">
          <h4>Menu Dashboard</h4>
          <p>Ringkasan proyek / filter cepat / shortcut.</p>
          {/* Kamu bisa ganti ini dengan stats nyata nantinya */}
          <ul className="mini-stats">
            <li>Tasks To Do: {tasks.filter(t => t.columnId === "todo").length}</li>
            <li>In Progress: {tasks.filter(t => t.columnId === "inprogress").length}</li>
            <li>Done: {tasks.filter(t => t.columnId === "done").length}</li>
          </ul>
        </div>
      );
    }
    if (activeMenu === "laporan") {
      return (
        <div className="sidebar-content">
          <h4>Laporan Progres</h4>
          <p>Daftar laporan mingguan / bulanan (placeholder).</p>
          <div className="placeholder-box">- Laporan 1</div>
          <div className="placeholder-box">- Laporan 2</div>
        </div>
      );
    }
    if (activeMenu === "pegawai") {
      return (
        <div className="sidebar-content">
          <h4>Data Pegawai</h4>
          <div className="employee-list">
            <div className="employee-item"><div className="small-avatar">JC</div> J. Christian</div>
            <div className="employee-item"><div className="small-avatar">AR</div> A. Rasyid</div>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="dashboard-root">
      {/* LEFT SIDEBAR */}
      <aside className="left-sidebar">
        <div className="brand">
          <div className="brand-logo">PT. PNM</div>
        </div>

        <nav className="menu">
          <button
            className={`menu-btn ${activeMenu === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveMenu("dashboard")}
          >
            <FaTachometerAlt /> <span>Dashboard</span>
          </button>

          <button
            className={`menu-btn ${activeMenu === "laporan" ? "active" : ""}`}
            onClick={() => setActiveMenu("laporan")}
          >
            <FaFolderOpen /> <span>Laporan Progres</span>
          </button>

          <button
            className={`menu-btn ${activeMenu === "pegawai" ? "active" : ""}`}
            onClick={() => setActiveMenu("pegawai")}
          >
            <FaUsers /> <span>Data Pegawai</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="logout-btn"><FaSignOutAlt /> Log out</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="main-area">
        <header className="main-header">
          <div className="left-controls">
            <FaBars className="icon" />
            <div className="profile-mini">
              <FaUserCircle className="profile-icon" />
              <span className="profile-name">Profil</span>
            </div>
          </div>

          <div className="right-controls">
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <input className="search-input" placeholder="Search" />
            </div>

            <button className="btn-new" onClick={openModal}>
              <FaPlus /> New Task
            </button>
          </div>
        </header>

        <div className="content-area">
          {/* show sidebar contextual content on the left of main area */}
          <div className="context-panel">{renderSidebarContent()}</div>

          {/* Kanban */}
          <div className="kanban-wrapper">
            <div className="kanban-board">
              {columns.map((col) => (
                <div className="kanban-column" key={col.id}>
                  <div className="column-title">{col.title}</div>
                  <div className="column-body">
                    {tasks
                      .filter((t) => t.columnId === col.id)
                      .map((t) => (
                        <div className="task-card" key={t.id} title={t.meta?.description || ""}>
                          <div className="card-avatar"><span>{t.avatar}</span></div>
                          <div className="card-content">
                            <div className="card-title">{t.content}</div>
                            {t.meta?.assignee && <div className="card-meta">{t.meta.assignee}</div>}
                          </div>
                        </div>
                      ))}

                    <div className="add-card-placeholder" onClick={openModal}>
                      <FaPlus />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            <h3>Buat Tugas Baru</h3>

            <form onSubmit={handleCreateTask} className="task-form">
              <label>Judul Tugas</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul Tugas" />

              <label>Penerima Tugas</label>
              <input value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="Anggota Team" />

              <label>Deskripsi</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi tugas" rows={3} />

              <div className="date-row">
                <div>
                  <label>Tanggal Mulai</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                  <label>Tanggal Selesai</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              <button className="btn-submit" type="submit">Buat Tugas</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
