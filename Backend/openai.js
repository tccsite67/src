// INTEGRAÇÃO COM OPENAI API
// A chave é obtida do localStorage

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

function getAPIKey() {
  const key = localStorage.getItem("openaiApiKey");
  if (!key) {
    throw new Error("Chave OpenAI não configurada. Vá para test-openai.html e configure.");
  }
  return key;
}

/**
 * Faz requisição para OpenAI GPT
 * @param {string} prompt - Pergunta/comando para a IA
 * @param {number} maxTokens - Limite de tokens (padrão 500)
 * @returns {Promise<string>} Resposta da IA
 */
export async function callOpenAI(prompt, maxTokens = 500) {
  try {
    const OPENAI_API_KEY = getAPIKey();

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Modelo rápido e barato
        messages: [
          {
            role: "system",
            content: "Você é um assistente especializado em fisioterapia e análise de movimento. Forneça análises claras, objetivas e baseadas em evidências. Sempre dê recomendações práticas."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Erro na API OpenAI");
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("Erro OpenAI:", error);
    throw error;
  }
}

/**
 * Analisa dados de movimento de um paciente
 * @param {array} movementData - Dados de movimento
 * @param {string} patientName - Nome do paciente
 * @returns {Promise<string>} Análise da IA
 */
export async function analyzeMovement(movementData, patientName = "Paciente") {
  
  const dataString = JSON.stringify(movementData, null, 2);
  
  const prompt = `
    Analise os seguintes dados de movimento do paciente "${patientName}":
    
    ${dataString}
    
    Forneça uma análise que inclua:
    1. Padrões identificados
    2. Possíveis problemas ou limitações
    3. Recomendações de exercícios
    4. Prognóstico de melhora
    
    Seja conciso e específico.
  `;

  return await callOpenAI(prompt, 800);
}

/**
 * Gera relatório de progresso
 * @param {array} sessions - Array com dados das sessões
 * @param {string} patientName - Nome do paciente
 * @returns {Promise<string>} Relatório de progresso
 */
export async function generateProgressReport(sessions, patientName = "Paciente") {
  
  const dataString = JSON.stringify(sessions, null, 2);
  
  const prompt = `
    Gere um relatório de progresso para o paciente "${patientName}" baseado nas seguintes sessões:
    
    ${dataString}
    
    Inclua:
    1. Evolução geral (positiva/negativa/estável)
    2. Melhoras observadas
    3. Áreas que precisam de mais atenção
    4. Próximos passos recomendados
    
    Formato: Profissional e objetivo.
  `;

  return await callOpenAI(prompt, 1000);
}

/**
 * Recomenda exercícios baseado em análise
 * @param {string} injury - Tipo de lesão/problema
 * @param {string} level - Nível (iniciante/intermediário/avançado)
 * @returns {Promise<string>} Recomendações de exercícios
 */
export async function recommendExercises(injury, level = "intermediário") {
  
  const prompt = `
    Recomende 5 exercícios de fisioterapia para:
    - Problema: ${injury}
    - Nível: ${level}
    
    Para cada exercício, inclua:
    1. Nome
    2. Descrição (5 passos)
    3. Repetições recomendadas
    4. Frequência
    5. Precauções
    
    Use formato de lista numerada.
  `;

  return await callOpenAI(prompt, 1200);
}

/**
 * Salva a chave API OpenAI no localStorage
 * @param {string} apiKey - Chave da API
 */
export function setOpenAIKey(apiKey) {
  localStorage.setItem("openaiApiKey", apiKey);
  console.log("Chave OpenAI salva com segurança");
}

/**
 * Obtém a chave API do localStorage
 * @returns {string|null} Chave da API ou null
 */
export function getOpenAIKey() {
  return localStorage.getItem("openaiApiKey");
}

/**
 * Verifica se a chave API está configurada
 * @returns {boolean}
 */
export function isOpenAIConfigured() {
  return getOpenAIKey() !== null;
}
