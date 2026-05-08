const authTokenKey = "authToken";
const currentPage = document.body.dataset.page || "login";
const mockWeeklyData = [
  { day: "Seg", sessions: 4 },
  { day: "Ter", sessions: 6 },
  { day: "Qua", sessions: 5 },
  { day: "Qui", sessions: 8 },
  { day: "Sex", sessions: 7 },
  { day: "Sáb", sessions: 3 },
  { day: "Dom", sessions: 2 },
];

const mockMovementData = [
  { time: "0s", value: 20 },
  { time: "5s", value: 45 },
  { time: "10s", value: 60 },
  { time: "15s", value: 75 },
  { time: "20s", value: 85 },
  { time: "25s", value: 90 },
];

const latestActivities = [];

const mockSessions = [];

const analyticsData = [
  { label: "Pacientes Ativos", value: 24 },
  { label: "Sessões Hoje", value: 8 },
  { label: "Tempo Médio", value: "45min" },
  { label: "Progresso Médio", value: "73%" },
];

const progressSummary = [
  { label: "Excelente", value: 4 },
  { label: "Bom", value: 10 },
  { label: "Regular", value: 6 },
];

const menuButtons = document.querySelectorAll(".menu-button");
const loginForm = document.getElementById("loginForm");
const logoutButton = document.getElementById("logoutButton");
const startStopButton = document.getElementById("startStopButton");
const clearButton = document.getElementById("clearButton");
const liveStatus = document.getElementById("liveStatus");
const selectedPatientLabel = document.getElementById("selectedPatientLabel");
const patientSelect = document.getElementById("patientSelect");
const historyDate = document.getElementById("historyDate");
const historyPatient = document.getElementById("historyPatient");
const clearFilters = document.getElementById("clearFilters");
const historyTable = document.getElementById("historyTable");
const historyEmpty = document.getElementById("historyEmpty");
const overviewCards = document.getElementById("overviewCards");
const sessionsChart = document.getElementById("sessionsChart");
const movementChart = document.getElementById("movementChart");
const recentActivity = document.getElementById("recentActivity");
const liveStats = document.getElementById("liveStats");
const liveValues = document.getElementById("liveValues");
const analyticsCards = document.getElementById("analyticsCards");
const analyticsBars = document.getElementById("analyticsBars");

let liveInterval = null;
let isRecording = false;
let liveData = [];
let selectedFinger = null;
let patients = [];

function loadPatients() {
  const saved = localStorage.getItem("patients");
  patients = saved ? JSON.parse(saved) : [];
  return patients;
}

function savePatients() {
  localStorage.setItem("patients", JSON.stringify(patients));
}

function addPatient(name) {
  if (name && !patients.includes(name)) {
    patients.push(name);
    savePatients();
    return true;
  }
  return false;
}

function removePatient(name) {
  patients = patients.filter(p => p !== name);
  savePatients();
  return true;
}

function setActiveMenu() {
  menuButtons.forEach((button) => {
    const page = button.dataset.page;
    button.classList.toggle("active", page === currentPage);
  });
}

function renderOverview() {
  if (!overviewCards || !sessionsChart || !movementChart || !recentActivity) return;

  overviewCards.innerHTML = "";
  const stats = [
    { label: "Pacientes Ativos", value: "24", change: "+12%" },
    { label: "Sessões Hoje", value: "8", change: "+5" },
    { label: "Tempo Médio", value: "45min", change: "-3min" },
    { label: "Progresso Médio", value: "73%", change: "+8%" },
  ];

  stats.forEach((stat) => {
    const card = document.createElement("div");
    card.className = "card overview-card";
    card.innerHTML = `
      <div>
        <p>${stat.label}</p>
        <p class="stat-value">${stat.value}</p>
      </div>
      <span>${stat.change}</span>
    `;
    overviewCards.appendChild(card);
  });

  sessionsChart.innerHTML = "";
  mockWeeklyData.forEach((item) => {
    const bar = document.createElement("div");
    bar.className = "bar-item";
    bar.innerHTML = `
      <span>${item.day}</span>
      <div class="bar-track">
        <div class="bar-fill" style="width: ${item.sessions * 10}%"></div>
      </div>
      <span>${item.sessions}</span>
    `;
    sessionsChart.appendChild(bar);
  });

  movementChart.innerHTML = "";
  mockMovementData.forEach((item) => {
    const bar = document.createElement("div");
    bar.className = "bar-item";
    bar.innerHTML = `
      <span>${item.time}</span>
      <div class="bar-track">
        <div class="bar-fill" style="width: ${item.value}%"></div>
      </div>
      <span>${item.value}°</span>
    `;
    movementChart.appendChild(bar);
  });

  recentActivity.innerHTML = "";
  latestActivities.forEach((activity) => {
    const item = document.createElement("div");
    item.className = "bar-item";
    item.innerHTML = `
      <div>
        <strong>${activity.patient}</strong>
        <p>${activity.exercise}</p>
      </div>
      <div style="text-align:right;">
        <p>${activity.time}</p>
        <span class="status-badge">${activity.status}</span>
      </div>
    `;
    recentActivity.appendChild(item);
  });
}

function renderLive() {
  if (!patientSelect || !selectedPatientLabel) return;
  patientSelect.innerHTML = "";
  patients.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    patientSelect.appendChild(option);
  });
  
  if (patients.length > 0) {
    selectedPatientLabel.textContent = `Paciente: ${patients[0]}`;
    selectedFinger = null;
  } else {
    selectedPatientLabel.textContent = "Nenhum paciente cadastrado";
  }
  
  renderLiveStats();
  renderLiveValues();
}

function renderLiveStats() {
  if (!liveStats) return;
  liveStats.innerHTML = "";
  const latest = liveData[liveData.length - 1] || { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 };
  
  const fingers = [
    { key: "thumb", name: "Polegar", value: latest.thumb },
    { key: "index", name: "Indicador", value: latest.index },
    { key: "middle", name: "Médio", value: latest.middle },
    { key: "ring", name: "Anelar", value: latest.ring },
    { key: "pinky", name: "Mínimo", value: latest.pinky },
  ];

  const toDisplay = selectedFinger ? fingers.filter(f => f.key === selectedFinger) : fingers;
  
  toDisplay.forEach((item) => {
    const card = document.createElement("div");
    card.className = "value-card";
    card.style.cursor = "pointer";
    card.innerHTML = `
      <h4>${item.name}</h4>
      <p>${item.value.toFixed(1)}°</p>
    `;
    card.addEventListener("click", () => {
      selectedFinger = selectedFinger === item.key ? null : item.key;
      renderLiveStats();
    });
    liveStats.appendChild(card);
  });
}

function renderLiveValues() {
  if (!liveValues) return;
  liveValues.innerHTML = "";
  const latest = liveData[liveData.length - 1] || { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 };
  const fingers = [
    { key: "thumb", name: "Polegar", value: latest.thumb },
    { key: "index", name: "Indicador", value: latest.index },
    { key: "middle", name: "Médio", value: latest.middle },
    { key: "ring", name: "Anelar", value: latest.ring },
    { key: "pinky", name: "Mínimo", value: latest.pinky },
  ];

  const toDisplay = selectedFinger ? fingers.filter(f => f.key === selectedFinger) : fingers;

  toDisplay.forEach((finger) => {
    const card = document.createElement("div");
    card.className = "value-card";
    card.style.cursor = "pointer";
    card.innerHTML = `
      <h4>${finger.name}</h4>
      <p>${finger.value.toFixed(1)}°</p>
    `;
    card.addEventListener("click", () => {
      selectedFinger = selectedFinger === finger.key ? null : finger.key;
      renderLiveValues();
    });
    liveValues.appendChild(card);
  });
}

function renderHistory() {
  if (!historyPatient) return;
  historyPatient.innerHTML = "";
  const uniquePatients = [...new Set(mockSessions.map((session) => session.patient))];
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Todos os pacientes";
  historyPatient.appendChild(defaultOption);

  uniquePatients.forEach((patient) => {
    const option = document.createElement("option");
    option.value = patient;
    option.textContent = patient;
    historyPatient.appendChild(option);
  });
  updateHistoryTable();
}

function updateHistoryTable() {
  if (!historyTable || !historyEmpty || !historyDate || !historyPatient) return;
  const filterDate = historyDate.value;
  const filterPatient = historyPatient.value;
  const filtered = mockSessions.filter((session) => {
    return (
      (!filterDate || session.date === filterDate) &&
      (!filterPatient || session.patient === filterPatient)
    );
  });

  historyTable.innerHTML = "";
  if (filtered.length === 0) {
    historyEmpty.style.display = "block";
    return;
  }

  historyEmpty.style.display = "none";
  filtered.forEach((session) => {
    const row = document.createElement("tr");
    const statusColor = session.status === "Excelente" ? "#d1fae5" : session.status === "Bom" ? "#dbeafe" : "#fef3c7";
    const textColor = session.status === "Excelente" ? "#065f46" : session.status === "Bom" ? "#1d4ed8" : "#92400e";
    row.innerHTML = `
      <td>${session.patient}</td>
      <td>${session.date} · ${session.time}</td>
      <td>${session.exercise}</td>
      <td>${session.duration}</td>
      <td>
        <div class="bar-track" style="height: 12px; background: #e5e7eb; border-radius: 999px;">
          <div class="bar-fill" style="width: ${session.progress}%; height: 100%;"></div>
        </div>
        <span>${session.progress}%</span>
      </td>
      <td><span class="status-badge" style="background:${statusColor}; color:${textColor};">${session.status}</span></td>
    `;
    historyTable.appendChild(row);
  });
}

function renderAnalytics() {
  if (!analyticsCards || !analyticsBars) return;
  analyticsCards.innerHTML = "";
  analyticsData.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card overview-card";
    card.innerHTML = `
      <div>
        <p>${item.label}</p>
        <p class="stat-value">${item.value}</p>
      </div>
    `;
    analyticsCards.appendChild(card);
  });

  analyticsBars.innerHTML = "";
  progressSummary.forEach((item) => {
    const row = document.createElement("div");
    row.className = "progress-item";
    const percent = Math.round((item.value / 20) * 100);
    row.innerHTML = `
      <div style="display:flex; justify-content:space-between; gap:12px;">
        <span>${item.label}</span>
        <strong>${item.value}</strong>
      </div>
      <div class="progress-track">
        <div class="progress-bar" style="width: ${percent}%"></div>
      </div>
    `;
    analyticsBars.appendChild(row);
  });
}

function toggleLiveRecording() {
  if (!liveStatus || !startStopButton) return;
  isRecording = !isRecording;
  if (isRecording) {
    liveStatus.textContent = "Gravando";
    liveStatus.classList.remove("paused");
    liveStatus.classList.add("recording");
    startStopButton.textContent = "Parar";
    if (liveInterval) clearInterval(liveInterval);
    liveData = [];
    liveInterval = setInterval(() => {
      const point = {
        thumb: Math.random() * 90,
        index: Math.random() * 90,
        middle: Math.random() * 90,
        ring: Math.random() * 90,
        pinky: Math.random() * 90,
      };
      liveData.push(point);
      if (liveData.length > 20) liveData.shift();
      renderLiveStats();
      renderLiveValues();
    }, 600);
  } else {
    liveStatus.textContent = "Pausado";
    liveStatus.classList.remove("recording");
    liveStatus.classList.add("paused");
    startStopButton.textContent = "Iniciar";
    if (liveInterval) clearInterval(liveInterval);
  }
}

function clearLiveData() {
  if (isRecording) return;
  liveData = [];
  renderLiveStats();
  renderLiveValues();
}

function renderPatientsList() {
  const patientsList = document.getElementById("patientsList");
  if (!patientsList) return;
  
  patientsList.innerHTML = "";
  
  if (patients.length === 0) {
    patientsList.innerHTML = '<p style="color: #9ca3af; font-size: 0.9rem;">Nenhum paciente cadastrado</p>';
    return;
  }
  
  patients.forEach((patient) => {
    const item = document.createElement("div");
    item.style.display = "grid";
    item.style.gridTemplateColumns = "1fr auto";
    item.style.gap = "8px";
    item.style.alignItems = "center";
    item.style.padding = "10px";
    item.style.background = "#f3f4f6";
    item.style.borderRadius = "8px";
    
    const name = document.createElement("span");
    name.textContent = patient;
    name.style.fontWeight = "500";
    
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remover";
    removeBtn.className = "secondary-button";
    removeBtn.style.padding = "6px 12px";
    removeBtn.style.fontSize = "0.85rem";
    removeBtn.addEventListener("click", () => {
      if (confirm(`Remover paciente "${patient}"?`)) {
        removePatient(patient);
        renderPatientsList();
        renderLive();
      }
    });
    
    item.appendChild(name);
    item.appendChild(removeBtn);
    patientsList.appendChild(item);
  });
}

function setupPatientManagement() {
  const newPatientInput = document.getElementById("newPatientInput");
  const addPatientButton = document.getElementById("addPatientButton");
  
  if (!newPatientInput || !addPatientButton) return;
  
  addPatientButton.addEventListener("click", () => {
    const name = newPatientInput.value.trim();
    if (name) {
      if (addPatient(name)) {
        newPatientInput.value = "";
        renderPatientsList();
        renderLive();
      } else {
        alert("Paciente já existe!");
      }
    }
  });
  
  newPatientInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addPatientButton.click();
    }
  });
  
  renderPatientsList();
}

function updateSelectedPatient() {
  if (!selectedPatientLabel || !patientSelect) return;
  const selected = patientSelect.value;
  if (selected) {
    selectedPatientLabel.textContent = `Paciente: ${selected}`;
  }
}

function checkAuth() {
  const isAuthenticated = !!localStorage.getItem(authTokenKey);
  if (currentPage === "login") {
    if (isAuthenticated) {
      window.location.href = "overview.html";
    }
  } else if (!isAuthenticated) {
    window.location.href = "index.html";
  }
}

function initializePage() {
  loadPatients();
  setActiveMenu();
  if (currentPage === "overview") renderOverview();
  if (currentPage === "live") {
    renderLive();
    setupPatientManagement();
  }
  if (currentPage === "history") renderHistory();
  if (currentPage === "analytics") renderAnalytics();
}

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (!email || !password) return;
    localStorage.setItem(authTokenKey, "mock-token-123");
    window.location.href = "overview.html";
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem(authTokenKey);
    liveData = [];
    if (liveInterval) clearInterval(liveInterval);
    window.location.href = "index.html";
  });
}

if (startStopButton) startStopButton.addEventListener("click", toggleLiveRecording);
if (clearButton) clearButton.addEventListener("click", clearLiveData);
if (patientSelect) patientSelect.addEventListener("change", updateSelectedPatient);
if (historyDate) historyDate.addEventListener("change", updateHistoryTable);
if (historyPatient) historyPatient.addEventListener("change", updateHistoryTable);
if (clearFilters) clearFilters.addEventListener("click", () => {
  if (!historyDate || !historyPatient) return;
  historyDate.value = "";
  historyPatient.value = "";
  updateHistoryTable();
});

checkAuth();
initializePage();
