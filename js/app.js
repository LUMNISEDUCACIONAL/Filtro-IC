// ================= CONFIG =================
const FORMSUBMIT_EMAIL = 'assessortecnico@lumnis.com.br';
const WHATSAPP_NUMBER = '5511961803550';

// ================= HELPERS =================
const $ = (q) => document.querySelector(q);
const el = (html) => {
  const d = document.createElement('div');
  d.innerHTML = html.trim();
  return d.firstElementChild;
};

// ================= PERGUNTAS (PDF ACI) =================
const QUESTIONS = {
  q1_mercado: {
    question: 'Em qual dos seguintes mercados você possui maior atuação e relacionamento?',
    options: [
      { value: 'A', label: 'Consultoria Estratégica, M&A ou Private Banking' },
      { value: 'B', label: 'Assessoria Financeira, Crédito Estruturado ou Multi-Family Office' },
      { value: 'C', label: 'Contabilidade Consultiva ou Advocacia Empresarial' },
      { value: 'D', label: 'Outro mercado não listado' }
    ]
  },
  q2_funcao: {
    question: 'Qual cargo ou função descreve melhor sua posição atual?',
    options: [
      { value: 'A', label: 'Sócio-Diretor, Head de Novos Negócios ou Gerente Corporate/Private' },
      { value: 'B', label: 'Consultor Sênior, Assessor de Investimentos ou CFO' },
      { value: 'C', label: 'Analista Sênior, Advogado ou Contador' },
      { value: 'D', label: 'Profissional autônomo em outra área' }
    ]
  },
  q3_acesso: {
    question: 'Com relação à sua carteira PJ, como é seu acesso a empresas com faturamento acima de R$ 24 milhões?',
    options: [
      { value: 'A', label: 'É meu foco principal (maioria acima de R$ 50MM)' },
      { value: 'B', label: 'Contato regular com empresas nesse perfil' },
      { value: 'C', label: 'Ocasionalmente' },
      { value: 'D', label: 'Não é meu foco' }
    ]
  },
  q4_decisores: {
    question: 'Como é seu nível de relacionamento com decisores (Sócios, CEO, CFO)?',
    options: [
      { value: 'A', label: 'Relacionamento direto e constante' },
      { value: 'B', label: 'Bom acesso, mas contato diário com gestores' },
      { value: 'C', label: 'Acesso limitado ou indireto' },
      { value: 'D', label: 'Não tenho relacionamento estabelecido' }
    ]
  }
};

// ================= STATE =================
const state = {
  step: 1,
  form: {
    nome: '',
    email: '',
    telefone: '',
    q1_mercado: null,
    q2_funcao: null,
    q3_acesso: null,
    q4_decisores: null
  }
};

const TOTAL_STEPS = 1 + Object.keys(QUESTIONS).length;

// ================= PONTUAÇÃO =================
const SCORE_MAP = { A: 4, B: 3, C: 2, D: 1 };

function calculateScore() {
  return Object.keys(QUESTIONS).reduce((sum, key) => {
    return sum + (SCORE_MAP[state.form[key]] || 0);
  }, 0);
}

function classify(score) {
  if (score >= 20) return 'Parceiro de Alto Potencial (X)';
  if (score >= 15) return 'Parceiro Promissor (Y)';
  if (score >= 10) return 'Parceiro a Desenvolver (Z)';
  return 'Perfil Desalinhado';
}

// ================= RENDER =================
function render() {
  $('#btnBack').classList.toggle('hidden', state.step === 1);
  $('#etapaAtual').textContent = state.step;
  $('#etapasTotal').textContent = TOTAL_STEPS;

  const c = $('#content');
  c.innerHTML = '';

  // ETAPA 1 – DADOS
  if (state.step === 1) {
    c.appendChild(el(`
      <div class="space-y-4">
        <input id="nome" class="w-full p-3 border rounded-xl" placeholder="Nome completo">
        <input id="email" class="w-full p-3 border rounded-xl" placeholder="E-mail">
        <input id="tel" class="w-full p-3 border rounded-xl" placeholder="Telefone / WhatsApp">
      </div>
    `));

    $('#nome').oninput = e => state.form.nome = e.target.value;
    $('#email').oninput = e => state.form.email = e.target.value;
    $('#tel').oninput = e => state.form.telefone = e.target.value;
    return;
  }

  // ETAPAS DE PERGUNTAS
  const keys = Object.keys(QUESTIONS);
  const key = keys[state.step - 2];
  const q = QUESTIONS[key];

  const box = el(`<div><h2 class="text-xl font-bold mb-4">${q.question}</h2></div>`);

  q.options.forEach(o => {
    const btn = el(`
      <button class="w-full text-left p-4 mb-2 border rounded-xl
        ${state.form[key] === o.value ? 'border-b44 bg-b44/10' : 'border-gray-300'}">
        ${o.value}) ${o.label}
      </button>
    `);

    btn.onclick = () => {
      state.form[key] = o.value;

      // AUTO-AVANÇO
      if (state.step < TOTAL_STEPS) {
        state.step++;
        render();
      } else {
        next();
      }
    };

    box.appendChild(btn);
  });

  c.appendChild(box);
}

// ================= FINAL =================
async function next() {
  const score = calculateScore();
  const classificacao = classify(score);

  const payload = {
    ...state.form,
    score,
    classificacao,
    criado_em: new Date().toISOString()
  };

  await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  });

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      'Olá! Preenchi o filtro de parceiros ACI e gostaria de conversar.'
    )}`,
    '_blank'
  );
}

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
  $('#btnNext').onclick = () => {
    if (state.step < TOTAL_STEPS) {
      state.step++;
      render();
    } else {
      next();
    }
  };

  $('#btnBack').onclick = () => {
    if (state.step > 1) {
      state.step--;
      render();
    }
  };

  render();
});
