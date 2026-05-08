// EXEMPLO DE COMO USAR A IA NA ANÁLISE
// Adicione este código no seu arquivo de análises

import { analyzeMovement, generateProgressReport, recommendExercises, isOpenAIConfigured } from "./openai.js";

/**
 * EXEMPLO 1: Analisar dados de movimento
 */
async function analyzePatientMovement(patientName) {
  if (!isOpenAIConfigured()) {
    alert("Configure a chave OpenAI em Configurações");
    return;
  }

  // Dados de exemplo (seus dados reais viriam daqui)
  const movementData = [
    { time: "0s", flexion: 20, extension: 15, rotation: 10 },
    { time: "5s", flexion: 45, extension: 40, rotation: 25 },
    { time: "10s", flexion: 60, extension: 55, rotation: 45 },
    { time: "15s", flexion: 75, extension: 70, rotation: 60 },
  ];

  try {
    const analysis = await analyzeMovement(movementData, patientName);
    console.log("Análise:", analysis);
    return analysis;
  } catch (error) {
    console.error("Erro na análise:", error);
    alert("Erro ao analisar: " + error.message);
  }
}

/**
 * EXEMPLO 2: Gerar relatório de progresso
 */
async function getProgressReport(patientName) {
  if (!isOpenAIConfigured()) {
    alert("Configure a chave OpenAI em Configurações");
    return;
  }

  const sessions = [
    { date: "01/05", duration: 30, score: 65 },
    { date: "02/05", duration: 35, score: 72 },
    { date: "03/05", duration: 40, score: 78 },
    { date: "04/05", duration: 45, score: 82 },
  ];

  try {
    const report = await generateProgressReport(sessions, patientName);
    console.log("Relatório:", report);
    return report;
  } catch (error) {
    console.error("Erro no relatório:", error);
    alert("Erro ao gerar relatório: " + error.message);
  }
}

/**
 * EXEMPLO 3: Recomendar exercícios
 */
async function getExerciseRecommendations(injury, level) {
  if (!isOpenAIConfigured()) {
    alert("Configure a chave OpenAI em Configurações");
    return;
  }

  try {
    const exercises = await recommendExercises(injury, level);
    console.log("Exercícios:", exercises);
    return exercises;
  } catch (error) {
    console.error("Erro nas recomendações:", error);
    alert("Erro ao obter recomendações: " + error.message);
  }
}

// ============================================
// COMO USAR NO HTML:
// ============================================

// 1. Adicione um botão no seu analytics.html:
/*
<button id="analyzeBtn" class="primary-button">
  🤖 Analisar com IA
</button>

<div id="aiResult" style="margin-top: 20px; padding: 15px; border-radius: 8px; background: #f0f9ff; display: none;">
  <h3>Análise da IA:</h3>
  <p id="aiContent"></p>
</div>
*/

// 2. Adicione listeners:
/*
document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const button = document.getElementById("analyzeBtn");
  button.disabled = true;
  button.textContent = "Analisando...";

  const analysis = await analyzePatientMovement("João Silva");
  
  const resultDiv = document.getElementById("aiResult");
  const resultContent = document.getElementById("aiContent");
  
  if (analysis) {
    resultContent.textContent = analysis;
    resultDiv.style.display = "block";
  }

  button.disabled = false;
  button.textContent = "🤖 Analisar com IA";
});
*/

// Exportar funções para usar em outras páginas
export { analyzePatientMovement, getProgressReport, getExerciseRecommendations };
