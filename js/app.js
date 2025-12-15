// ================= CONFIG =================
const BG_IMAGES = [
  'https://img.freepik.com/fotos-gratis/arranha-ceus-ao-por-do-sol_1112-1870.jpg?w=1920&q=80',
  'https://img.freepik.com/fotos-gratis/fundo-de-rua-moderna-de-toquio_23-2149394958.jpg?w=1920&q=80'
];

const FORMSUBMIT_EMAIL = 'assessortecnico@lumnis.com.br';
const WHATSAPP_NUMBER = '5511961803550';

// ================= HELPERS =================
function $(q){ return document.querySelector(q); }
function el(html){ const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }

// ================= PERGUNTAS (PDF ACI) =================
const QUESTIONS = {
  q1_finalidade: {
    question: 'Qual a principal finalidade do capital que sua empresa busca neste momento?',
    options: [
      { value:'A', label:'Expansão, novos mercados ou novos produtos' },
      { value:'B', label:'Aquisição estratégica de empresas ou ativos' },
      { value:'C', label:'Reestruturação / otimização financeira' },
      { value:'D', label:'Capital de giro / curto prazo' },
      { value:'E', label:'Outra finalidade estratégica' }
    ]
  },
  q2_funcao: {
    question: 'Qual sua função ou nível de decisão?',
    options: [
      { value:'A', label:'CEO / Sócio / Proprietário' },
      { value:'B', label:'CFO / Diretor Financeiro / Estratégia' },
      { value:'C', label:'Diretor / Gerente Sênior' },
      { value:'D', label:'Analista / Consultor' }
    ]
  },
  q3_faturamento: {
    question: 'Qual o faturamento aproximado nos últimos 12 meses?',
    options: [
      { value:'A', label:'Acima de R$ 24 milhões' },
      { value:'B', label:'Abaixo de R$ 24 milhões' }
    ]
  },
  q4_aporte: {
    question: 'Qual o valor estimado do aporte?',
    options: [
      { value:'A', label:'US$ 3 a 5 milhões' },
      { value:'B', label:'US$ 10 a 50 milhões' },
      { value:'C', label:'US$ 100 milhões ou mais' }
    ]
  },
  q5_tempo: {
    question: 'Em quanto tempo pretende captar?',
    options: [
      { value:'A', label:'Até 3 meses' },
      { value:'B', label:'3 a 6 meses' },
      { value:'C', label:'6 a 12 meses' },
      { value:'D', label:'Acima de 12 meses' }
    ]
  },
  q6_estagio: {
    question: 'Em que estágio está o projeto?',
    options: [
      { value:'A', label:'Planejamento inicial' },
      { value:'B', label:'Plano estruturado' },
      { value:'C', label:'Negociação avançada' },
      { value:'D', label:'Urgente / prazos definidos' }
    ]
  }
};

// ================= STATE =================
const state = {
  step: 1,
  form: {
    nome:'', email:'', telefone:'', consentimento_lgpd:false,
    q1_finalidade:null,
    q2_funcao:null,
    q3_faturamento:null,
    q4_aporte:null,
    q5_tempo:null,
    q6_estagio:null
  },
  errors:{},
  result:null
};

// ================= BACKGROUND =================
function setBackground(){
  const img = $('#bgImage');
  const idx = (state.step - 1) % BG_IMAGES.length;
  img.style.backgroundImage = `url('${BG_IMAGES[idx]}')`;
}

// ================= PROGRESS =================
function getTotalSteps(){ return 7; }

function updProgress(){
  $('#etapaAtual').textContent = state.step;
  $('#etapasTotal').textContent = getTotalSteps();
  const pct = Math.round((state.step / getTotalSteps()) * 100);
  $('#pct').textContent = pct;
  $('#barra').style.width = pct + '%';
}

// ================= UI =================
function optionButton({value,label,model}){
  const selected = state.form[model] === value;
  const b = el(`
    <button class="w-full text-left p-4 rounded-2xl border-2 ${selected?'border-b44red bg-red-50':'border-gray-200 bg-white'}">
      <strong>${label}</strong>
    </button>
  `);
  b.onclick = ()=>{ state.form[model] = value; render(); };
  return b;
}

function inputField(label,id,type='text'){
  return el(`
    <div>
      <label class="text-sm font-bold">${label}</label>
      <input id="${id}" type="${type}" class="mt-2 w-full px-3 py-3 rounded-xl border-2 border-gray-200"/>
    </div>
  `);
}

// ================= CLASSIFICAÇÃO =================
function classifyLead(){
  if(state.form.q3_faturamento === 'B') return 'nutricao';
  if(['A','B'].includes(state.form.q2_funcao) && ['B','C'].includes(state.form.q4_aporte)) return 'ceo_ready';
  return 'especialista';
}

function levelLabel(code){
  return {
    ceo_ready:'CEO Ready',
    especialista:'Especialista',
    nutricao:'Nutrição'
  }[code] || 'Desalinhado';
}

// ================= EMAIL =================
async function sendEmail(lead){
  const fd = new FormData();
  Object.entries(lead).forEach(([k,v])=>fd.append(k,v||''));
  fd.append('_subject','Novo Lead – Avaliação Estratégica');
  fd.append('_template','table');
  fd.append('_captcha','false');

  await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`,{
    method:'POST',
    body: fd,
    headers:{'Accept':'application/json'}
  });
}

// ================= WHATSAPP =================
function redirectToWhatsApp(){
  const msg =
    'Olá, acabei de preencher o filtro de Avaliação Estratégica de Capital e gostaria de ter mais informações.';
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank');
}

// ================= RENDER =================
function render(){
  setBackground();
  updProgress();
  const c = $('#content');
  c.innerHTML = '';

  if(state.step===1){
    const box = el(`<div class="grid gap-4"></div>`);
    box.appendChild(inputField('Nome','f_nome'));
    box.appendChild(inputField('E-mail','f_email','email'));
    box.appendChild(inputField('Telefone','f_tel'));
    c.appendChild(box);

    $('#f_nome').oninput = e=>state.form.nome=e.target.value;
    $('#f_email').oninput = e=>state.form.email=e.target.value;
    $('#f_tel').oninput = e=>state.form.telefone=e.target.value;
  }

  const qKeys = Object.keys(QUESTIONS);
  if(state.step>=2 && state.step<=7){
    const q = QUESTIONS[qKeys[state.step-2]];
    const box = el(`<div><h2 class="text-2xl font-bold mb-4">${q.question}</h2></div>`);
    q.options.forEach(o=>box.appendChild(optionButton({...o,model:qKeys[state.step-2]})));
    c.appendChild(box);
  }
}

// ================= FLOW =================
async function next(){
  if(state.step < getTotalSteps()){
    state.step++;
    render();
    return;
  }

  const classificacao = classifyLead();
  const payload = {
    ...state.form,
    classificacao: levelLabel(classificacao),
    criado_em: new Date().toISOString()
  };

  await sendEmail(payload);
  redirectToWhatsApp();
}

function back(){
  if(state.step>1){ state.step--; render(); }
}

// ================= INIT =================
function init(){
  $('#btnNext').onclick = next;
  $('#btnBack').onclick = back;
  $('#year').textContent = new Date().getFullYear();
  render();
}

document.addEventListener('DOMContentLoaded', init);
