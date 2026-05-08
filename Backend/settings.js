// BACKEND PARA PÁGINA DE SETTINGS
import { setOpenAIKey, callOpenAI } from "./openai.js";

const settingsForm = document.getElementById("settingsForm");
const apiKeyInput = document.getElementById("apiKey");
const testButton = document.getElementById("testButton");
const statusDiv = document.getElementById("status");

// Carregar chave salva (se existir)
document.addEventListener("DOMContentLoaded", () => {
  const savedKey = localStorage.getItem("openaiApiKey");
  if (savedKey) {
    // Mostrar apenas os últimos 10 caracteres por segurança
    apiKeyInput.value = "••••••••••" + savedKey.slice(-10);
  }
});

// Salvar chave
settingsForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const apiKey = apiKeyInput.value.trim();

  if (!apiKey || apiKey.includes("•")) {
    showStatus("Insira uma chave válida (não use a mascarada)", "error");
    return;
  }

  if (!apiKey.startsWith("sk-")) {
    showStatus("Chave inválida! Deve começar com 'sk-'", "error");
    return;
  }

  setOpenAIKey(apiKey);
  showStatus("✓ Chave salva com sucesso!", "success");

  // Limpar campo e mostrar mascarado
  setTimeout(() => {
    apiKeyInput.value = "••••••••••" + apiKey.slice(-10);
  }, 1000);
});

// Testar conexão
testButton.addEventListener("click", async () => {
  const apiKey = localStorage.getItem("openaiApiKey");

  if (!apiKey) {
    showStatus("Configure a chave API primeiro", "error");
    return;
  }

  testButton.disabled = true;
  testButton.textContent = "Testando...";

  try {
    // Teste simples
    const response = await callOpenAI(
      "Responda com uma única palavra: OK"
    );

    showStatus(
      `✓ Conexão bem-sucedida!\nResposta: ${response}`,
      "success"
    );
  } catch (error) {
    showStatus(
      `✗ Erro na conexão: ${error.message}`,
      "error"
    );
  } finally {
    testButton.disabled = false;
    testButton.textContent = "Testar Conexão";
  }
});

function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
}
