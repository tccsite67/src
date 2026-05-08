// SCRIPT DE ANÁLISE IA PARA ANALYTICS.HTML
import { analyzeMovement, generateProgressReport, recommendExercises } from "./openai.js";

const analyzeBtn = document.getElementById("analyzeBtn");
const analysisTypeSelect = document.getElementById("analysisType");
const patientNameInput = document.getElementById("patientName");
const aiResult = document.getElementById("aiResult");
const aiContent = document.getElementById("aiContent");
const closeResultBtn = document.getElementById("closeResultBtn");

// DADOS DE EXEMPLO (em produção viriam do banco de dados)
const mockMovementData = [
  { time: "0s", flexion: 20, extension: 15, rotation: 10 },
  { time: "5s", flexion: 45, extension: 40, rotation: 25 },
  { time: "10s", flexion: 60, extension: 55, rotation: 45 },
  { time: "15s", flexion: 75, extension: 70, rotation: 60 },
  { time: "20s", flexion: 85, extension: 80, rotation: 75 },
];

const mockSessions = [
  { date: "01/05/2026", duration: 30, score: 65, notes: "Primeiro dia" },
  { date: "02/05/2026", duration: 35, score: 72, notes: "Progresso bom" },
  { date: "03/05/2026", duration: 40, score: 78, notes: "Melhora consistente" },
  { date: "04/05/2026", duration: 45, score: 82, notes: "Excelente desempenho" },
  { date: "05/05/2026", duration: 50, score: 87, notes: "Continuando melhora" },
];

// BOTÃO DE ANÁLISE
analyzeBtn.addEventListener("click", async () => {
  const analysisType = analysisTypeSelect.value;
  const patientName = patientNameInput.value.trim() || "Paciente";

  if (!patientName) {
    alert("Insira o nome do paciente");
    return;
  }

  analyzeBtn.disabled = true;
  analyzeBtn.textContent = "⏳ Analisando com IA...";

  try {
    let result;

    switch (analysisType) {
      case "movement":
        result = await analyzeMovement(mockMovementData, patientName);
        break;
      case "progress":
        result = await generateProgressReport(mockSessions, patientName);
        break;
      case "exercises":
        result = await recommendExercises("Lesão no ombro", "intermediário");
        break;
      default:
        result = "Tipo de análise inválido";
    }

    // MOSTRA RESULTADO
    aiContent.textContent = result;
    aiResult.style.display = "block";

    // SCROLL PARA O RESULTADO
    aiResult.scrollIntoView({ behavior: "smooth", block: "start" });

  } catch (error) {
    alert("Erro na análise: " + error.message);
    console.error(error);
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "Gerar Análise";
  }
});

// FECHAR RESULTADO
closeResultBtn.addEventListener("click", () => {
  aiResult.style.display = "none";
});
