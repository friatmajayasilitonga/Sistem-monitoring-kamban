import React, { useState, useEffect } from "react";
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
  FaCalendarAlt,
  FaEdit, // Import Icon Edit
  FaTimes, // Import Icon Close
} from "react-icons/fa";

// --- KOMPONEN TAMPILAN PEGAWAI (DIPERBARUI) ---
const TeamMembersView = ({ members, onAddClick, onEditClick, userRole }) => (
  <div className="team-view">
    <h3>Data Karyawan</h3>
    <div className="member-list">
      {members.length === 0 ? (
        <p style={{ color: "#666", fontStyle: "italic" }}>
          Belum ada data karyawan.
        </p>
      ) : (
        members.map((member) => (
          <div
            key={member.id}
            className="member-item-large"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 0",
            }}
          >
            {/* 1. BAGIAN KIRI */}
            <div
              className="member-info"
              style={{ flex: 1, display: "flex", alignItems: "center" }}
            >
              <div className="member-avatar" style={{ marginRight: "15px" }}>
                <FaUserCircle size={40} color="#0070c5" />
              </div>
              <div>
                <div className="member-name">{member.name}</div>
                <div
                  className="member-email"
                  style={{ fontSize: "13px", color: "#666" }}
                >
                  {member.email}
                </div>
              </div>
            </div>

            {/* 2. BAGIAN TENGAH */}
            <div
              className="member-phone"
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: "16px",
                color: "#333",
              }}
            >
              {member.phone ? member.phone : "-"}
            </div>

            {/* 3. BAGIAN KANAN */}
            <div
              className="member-actions"
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                className="role-tag"
                style={{
                  background: member.role === "admin" ? "#0070c5" : "#28a745",
                  color: "white",
                  padding: "5px 15px",
                  borderRadius: "15px",
                  fontSize: "12px",
                  textTransform: "capitalize",
                }}
              >
                {member.role}
              </span>

              {/* TOMBOL EDIT (Hanya Admin) */}
              {userRole === "admin" && (
                <button
                  onClick={() => onEditClick(member)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#f39c12",
                  }}
                  title="Edit Data"
                >
                  <FaEdit size={18} />
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
    <div className="team-actions">
      <button className="btn-add-member" onClick={onAddClick}>
        <FaPlus /> Tambah Karyawan
      </button>
    </div>
  </div>
);

// --- DATA DUMMY DASHBOARD TETAP ---
const initialColumns = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "inreview", title: "In Review" },
  { id: "done", title: "Done" },
];

const initialTasks = []; // Kosongkan, kita ambil dari DB

export default function Dashboard() {
  // STATE UTAMA
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [columns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);

  // STATE MODAL TASK (ADD & DETAIL)
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal Add Task
  const [selectedTask, setSelectedTask] = useState(null); // Modal Detail Task
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // STATE MODAL PEGAWAI (ADD & EDIT)
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false); // Modal Add
  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false); // Modal Edit

  // Form State Task
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState("Sedang");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Form State Pegawai (Dipakai untuk Add & Edit)
  const [editMemberId, setEditMemberId] = useState(null); // ID pegawai yg diedit
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState("employee");

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    if (role === "admin") fetchMembers();
    fetchTasks();
    if (activeMenu === "pegawai" && role !== "admin")
      setActiveMenu("dashboard");
    if (activeMenu === "pegawai" && role === "admin") fetchMembers();
  }, [activeMenu]);

  // --- API CALLS ---
  const fetchTasks = async () => {
    // Ambil info siapa yang login dari Local Storage
    const currentRole = localStorage.getItem("role");
    const currentName = localStorage.getItem("name"); // Pastikan saat Login, nama juga disimpan!

    try {
      // Sekarang kita gunakan method POST untuk mengirim data diri
      const res = await fetch(
        "http://localhost/Kamban/kamban-web/src/pages/api/get_tasks.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: currentRole,
            name: currentName,
          }),
        }
      );
      const data = await res.json();
      setTasks(data); // Simpan ke state tasks
    } catch (error) {
      console.error("Gagal ambil tasks:", error);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch(
        "http://localhost/Kamban/kamban-web/src/pages/api/get_users.php"
      );
      const data = await res.json();
      setTeamMembers(data);
    } catch (err) {
      console.error("Gagal ambil data", err);
    }
  };

  // --- HANDLER TAMBAH TASK ---
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Isi judul tugas.");
    const newTaskData = {
      title,
      assignee,
      priority,
      description,
      startDate,
      endDate,
    };
    try {
      const res = await fetch(
        "http://localhost/Kamban/kamban-web/src/pages/api/add_task.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTaskData),
        }
      );
      const result = await res.json();
      if (result.status) {
        alert("Tugas berhasil dibuat!");
        closeModal();
        fetchTasks();
      } else {
        alert("Gagal: " + result.message);
      }
    } catch (err) {
      alert("Error koneksi server");
    }
  };

  // --- HANDLER TAMBAH PEGAWAI ---
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "http://localhost/Kamban/kamban-web/src/pages/api/add_user.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newName,
            email: newEmail,
            phone: newPhone,
            role: newRole,
          }),
        }
      );
      const result = await res.json();
      if (result.status) {
        alert("Pegawai berhasil ditambahkan!");
        setIsMemberModalOpen(false);
        fetchMembers();
        setNewName("");
        setNewEmail("");
        setNewPhone("");
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Gagal koneksi ke server");
    }
  };

  // --- HANDLER EDIT PEGAWAI ---
  const openEditMemberModal = (member) => {
    setEditMemberId(member.id);
    setNewName(member.name);
    setNewEmail(member.email);
    setNewPhone(member.phone || "");
    setNewRole(member.role);
    setIsEditMemberModalOpen(true);
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "http://localhost/Kamban/kamban-web/src/pages/api/update_user.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editMemberId,
            name: newName,
            email: newEmail,
            phone: newPhone,
            role: newRole,
          }),
        }
      );
      const result = await res.json();
      if (result.status) {
        alert("Data pegawai berhasil diperbarui!");
        setIsEditMemberModalOpen(false);
        fetchMembers(); // Refresh data
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Gagal update data");
    }
  };

  // --- HANDLER CLICK CARD (DETAIL) ---
  const handleCardClick = (task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  // --- DRAG AND DROP ---
  function handleDragStart(e, taskId) {
    e.dataTransfer.setData("taskId", taskId);
  }
  function handleDragOver(e) {
    e.preventDefault();
  }
  async function handleDrop(e, targetColumnId) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const draggedTask = tasks.find((t) => t.id == taskId);
    if (draggedTask && draggedTask.columnId !== targetColumnId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id == taskId ? { ...t, columnId: targetColumnId } : t
        )
      );
      try {
        await fetch(
          "http://localhost/Kamban/kamban-web/src/pages/api/update_task_status.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: taskId, status: targetColumnId }),
          }
        );
      } catch (err) {
        fetchTasks();
      }
    }
  }

  // --- HELPERS ---
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
  function closeModal() {
    setIsModalOpen(false);
    setTitle("");
    setDescription("");
    setAssignee("");
    setStartDate("");
    setEndDate("");
  }
  function openModal() {
    setIsModalOpen(true);
  }

  // --- RENDER UTAMA ---
  function renderMainContent() {
    if (activeMenu === "pegawai" && userRole === "admin") {
      return (
        <TeamMembersView
          members={teamMembers}
          userRole={userRole}
          onAddClick={() => {
            setNewName("");
            setNewEmail("");
            setNewPhone("");
            setIsMemberModalOpen(true);
          }}
          onEditClick={openEditMemberModal}
        />
      );
    }
    return (
      <div className="kanban-wrapper">
        <div className="kanban-board">
          {columns.map((col) => (
            <div
              className="kanban-column"
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="column-title">{col.title}</div>
              {tasks
                .filter((t) => t.columnId === col.id)
                .map((task) => (
                  <div
                    key={task.id}
                    className="kanban-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onClick={() => handleCardClick(task)}
                    style={{
                      borderLeft: `4px solid ${getPriorityColor(
                        task.priority
                      )}`,
                    }}
                  >
                    <div className="card-header">
                      <span
                        className="priority-dot"
                        style={{ background: getPriorityColor(task.priority) }}
                      ></span>
                      <span className="task-id">#{task.id}</span>
                    </div>
                    <div className="card-title">{task.content}</div>
                    <div className="card-footer">
                      <div className="avatar-circle">{task.avatar}</div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-root">
      {/* SIDEBAR & HEADER (SAMA) */}
      <aside className={`left-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
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
          {userRole === "admin" && (
            <button
              className={`menu-btn ${activeMenu === "pegawai" ? "active" : ""}`}
              onClick={() => setActiveMenu("pegawai")}
            >
              <FaUsers /> <span>Data Karyawan</span>
            </button>
          )}
        </nav>
        <div className="sidebar-bottom">
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            <FaSignOutAlt /> Log out
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="main-header">
          <div className="left-controls">
            <FaBars
              className="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <h2 className="header-title">Sistem Monitoring </h2>
          </div>
          <div className="right-controls">
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <input className="search-input" placeholder="Search" />
            </div>
            {activeMenu === "dashboard" && userRole === "admin" && (
              <button className="btn-new" onClick={openModal}>
                <FaPlus /> New Task
              </button>
            )}
            <div className="profile-mini">Hi, {userRole}</div>
          </div>
        </header>
        {isSidebarOpen && (
          <div
            className="content-mask"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        <div className="content-area">{renderMainContent()}</div>
      </div>

      {/* --- MODAL 1: ADD TASK --- */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "500px", padding: "25px", borderRadius: "10px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ margin: 0 }}>Buat Tugas Baru</h3>
              <button
                onClick={closeModal}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="task-form">
              {/* Gunakan inputan yang sama seperti kode Anda sebelumnya */}
              <label style={{ fontWeight: "bold" }}>Judul</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.inputGray}
                placeholder="Judul Tugas"
              />
              <label style={{ fontWeight: "bold", marginTop: "10px" }}>
                Penerima
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                style={styles.inputGray}
              >
                <option value="">Pilih Pegawai</option>
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
              <div className="priority-group" style={{ marginTop: "15px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    marginBottom: "5px",
                    display: "block",
                  }}
                >
                  Prioritas
                </label>
                <div
                  className="priority-options"
                  style={{ display: "flex", gap: "10px" }}
                >
                  {["Tinggi", "Sedang", "Rendah"].map((prio) => (
                    <div
                      key={prio}
                      onClick={() => setPriority(prio)}
                      style={{
                        padding: "8px 20px",
                        borderRadius: "20px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                        backgroundColor:
                          prio === "Tinggi"
                            ? "#FF2D2D" // Merah Terang
                            : prio === "Sedang"
                            ? "#FFEA00" // Kuning Terang
                            : "#00E676", // Hijau Terang
                        color: prio === priority ? "black" : "rgba(0,0,0,0.3)", // Opacity jika tidak dipilih
                        border:
                          prio === priority
                            ? "2px solid #333"
                            : "2px solid transparent", // Border penanda aktif
                        opacity: prio === priority ? 1 : 0.6, // Redupkan yang tidak dipilih
                      }}
                    >
                      {prio}
                    </div>
                  ))}
                </div>
              </div>
              <label style={{ fontWeight: "bold", marginTop: "10px" }}>
                Deskripsi
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={styles.inputGray}
              ></textarea>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>Start</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={styles.inputGray}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>End</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={styles.inputGray}
                  />
                </div>
              </div>
              <button
                className="btn-submit"
                type="submit"
                style={{ marginTop: "20px" }}
              >
                Simpan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: DETAIL TASK (POPUP BARU) --- */}
      {isDetailModalOpen && selectedTask && (
        <div
          className="modal-backdrop"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "500px", padding: "30px", borderRadius: "12px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "15px",
              }}
            >
              <div>
                <span
                  style={{
                    background: getPriorityColor(selectedTask.priority),
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "15px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {selectedTask.priority}
                </span>
                <h2 style={{ margin: "10px 0 5px 0", color: "#333" }}>
                  {selectedTask.content}
                </h2>
                <span style={{ color: "#888", fontSize: "13px" }}>
                  Task ID: #{selectedTask.id}
                </span>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                <FaTimes />
              </button>
            </div>

            <hr
              style={{
                border: "0",
                borderTop: "1px solid #eee",
                margin: "15px 0",
              }}
            />

            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ margin: "0 0 5px 0", color: "#555" }}>Deskripsi</h4>
              <p
                style={{
                  color: "#666",
                  lineHeight: "1.5",
                  background: "#f9f9f9",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                {selectedTask.meta.description || "Tidak ada deskripsi."}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 5px 0", color: "#555" }}>
                  Penerima Tugas
                </h4>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    className="avatar-circle"
                    style={{ width: "30px", height: "30px", fontSize: "12px" }}
                  >
                    {selectedTask.avatar}
                  </div>
                  <span>{selectedTask.meta.assignee}</span>
                </div>
              </div>
              <div>
                <h4 style={{ margin: "0 0 5px 0", color: "#555" }}>Status</h4>
                <span
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    color: "#0f52ba",
                  }}
                >
                  {selectedTask.columnId}
                </span>
              </div>
            </div>

            <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
              <div>
                <span
                  style={{ color: "#888", fontSize: "12px", display: "block" }}
                >
                  Start Date
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontWeight: "500",
                  }}
                >
                  <FaCalendarAlt color="#0f52ba" />{" "}
                  {selectedTask.meta.startDate || "-"}
                </div>
              </div>
              <div>
                <span
                  style={{ color: "#888", fontSize: "12px", display: "block" }}
                >
                  Due Date
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontWeight: "500",
                  }}
                >
                  <FaCalendarAlt color="#e74c3c" />{" "}
                  {selectedTask.meta.endDate || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: ADD MEMBER --- */}
      {isMemberModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsMemberModalOpen(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setIsMemberModalOpen(false)}
            >
              ✕
            </button>
            <h3>Tambah Pegawai Baru</h3>
            <form onSubmit={handleAddMember} className="task-form">
              {/* Input form sama seperti sebelumnya */}
              <label>Nama</label>
              <input
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={styles.inputGray}
              />
              <label style={{ marginTop: "10px" }}>Email</label>
              <input
                required
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                style={styles.inputGray}
              />
              <label style={{ marginTop: "10px" }}>Telepon</label>
              <input
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                style={styles.inputGray}
              />
              <label style={{ marginTop: "10px" }}>Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={styles.inputGray}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
              <button
                className="btn-submit"
                type="submit"
                style={{ marginTop: "20px" }}
              >
                Simpan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: EDIT MEMBER (FITUR BARU) --- */}
      {isEditMemberModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsEditMemberModalOpen(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setIsEditMemberModalOpen(false)}
            >
              ✕
            </button>
            <h3 style={{ color: "#f39c12" }}>Edit Data Pegawai</h3>
            <form onSubmit={handleUpdateMember} className="task-form">
              <label>Nama</label>
              <input
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={styles.inputGray}
              />

              <label style={{ marginTop: "10px" }}>Email</label>
              <input
                required
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                style={styles.inputGray}
              />

              <label style={{ marginTop: "10px" }}>Telepon</label>
              <input
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                style={styles.inputGray}
              />

              <label style={{ marginTop: "10px" }}>Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={styles.inputGray}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>

              <button
                className="btn-submit"
                type="submit"
                style={{ marginTop: "20px", background: "#f39c12" }}
              >
                Update Data
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  inputGray: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
    color: "#333",
    outline: "none",
  },
};
