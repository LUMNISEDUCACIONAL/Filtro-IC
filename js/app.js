const BG_IMAGES = [
  'https://img.freepik.com/fotos-gratis/arranha-ceus-ao-por-do-sol_1112-1870.jpg?uid=R220657750&ga=GA1.1.594609506.1760931648&semt=ais_hybrid&w=740&q=80',
  'https://img.freepik.com/fotos-gratis/fundo-de-rua-moderna-de-toquio_23-2149394958.jpg?uid=R220657750&ga=GA1.1.594609506.1760931648&semt=ais_hybrid&w=740&q=80'
];

const WEB3FORMS_ACCESS_KEY = '48c7b0de-05bc-4228-98f1-1d2ebc6e2b44';
const FORMSUBMIT_EMAIL = 'assessortecnico@lumnis.com.br';
const WHATSAPP_NUMBER = '5511961803550';

function $(q){ return document.querySelector(q); }
function el(html){ const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }

const QUESTIONS = {
  q1_finalidade: {
    question: 'Qual a principal finalidade do capital que sua empresa busca neste momento?',
    options: [
      { value:'A', label:'Expansão, novos mercados ou lançamento de produtos/serviços' },
      { value:'B', label:'Aquisição estratégica de empresas ou ativos' },
      { value:'C', label:'Reestruturação/otimização da estrutura de capital' },
      { value:'D', label:'Capital de giro/curto prazo' },
      { value:'E', label:'Outra finalidade estratégica (especifique brevemente)' },
    ]
  },
  q2_funcao: {
    question: 'Qual sua função ou nível de envolvimento na decisão estratégica?',
    options: [
      { value:'A', label:'CEO / Presidente / Sócio-Diretor / Proprietário' },
      { value:'B', label:'CFO / Head de M&A / Diretor de Estratégia' },
      { value:'C', label:'Diretor de Área / Gerente Sênior (influência direta)' },
      { value:'D', label:'Analista / Consultor / Gerente de Projeto' },
      { value:'E', label:'Outro (especifique brevemente)' },
    ]
  },
  q3_faturamento: {
    question: 'Qual foi o faturamento aproximado da sua empresa nos últimos 12 meses?',
    options: [
      { value:'A', label:'Acima de R$ 24 milhões' },
      { value:'B', label:'Abaixo de R$ 24 milhões' },
    ]
  },
  q4_aporte: {
    question: 'Qual seria a ordem de grandeza do aporte de capital necessário?',
    options: [
      { value:'A', label:'Entre US$ 3 milhões e US$ 5 milhões' },
      { value:'B', label:'Entre US$ 10 milhões e US$ 50 milhões' },
      { value:'C', label:'Entre US$ 100 milhões e US$ 300 milhões' },
    ]
  },
  q5_tempo: {
    question: 'Em que horizonte de tempo sua empresa planeja efetivar esta captação?',
    options: [
      { value:'A', label:'Nos próximos 3 meses (Urgência Estratégica)' },
      { value:'B', label:'Entre 3 e 6 meses' },
      { value:'C', label:'Entre 6 e 12 meses' },
      { value:'D', label:'Acima de 12 meses' },
    ]
  },
  q6_estagio: {
    question: 'Qual o estágio atual de desenvolvimento do projeto/necessidade?',
    options: [
      { value:'A', label:'Estudo e planejamento inicial' },
      { value:'B', label:'Plano de negócios consolidado; busca ativa de parceiros' },
      { value:'C', label:'Negociação avançada; buscando alternativas/complementos' },
      { value:'D', label:'Necessidade urgente; prazos definidos' },
    ]
  }
};

const state = { step:1, form: {
  nome:'', email:'', telefone:'', empresa:'', cnpj:'', local:'', consentimento_lgpd:false,
  q1_finalidade:null, q1_outro:'',
  q2_funcao:null, q2_outro:'',
  q3_faturamento:null,
  q4_aporte:null,
  q5_tempo:null,
  q6_estagio:null,
  utm_source:'', utm_medium:'', utm_campaign:''
}, errors:{}, result:null };

function labelFor(questionKey, value){
  const q = QUESTIONS[questionKey];
  if(!q) return value||'';
  const opt = (q.options||[]).find(o=>o.value===value);
  return opt ? opt.label : (value||'');
}

function showError(msg){
  const box = document.getElementById('errorBox');
  box.textContent = msg;
  box.classList.remove('hidden');
}

function setBackground(){
  const idx = (state.step - 1) % BG_IMAGES.length;
  const img = $('#bgImage');
  img.style.opacity = 0.15;
  img.style.transform = 'scale(1.02)';
  requestAnimationFrame(()=>{
    img.style.backgroundImage = `url('${BG_IMAGES[idx]}')`;
    img.style.opacity = 0.28;
    img.style.transform = 'scale(1)';
  });
}
document.addEventListener('mousemove', (e)=>{
  const img = $('#bgImage'); if(!img) return;
  const cx = (e.clientX / innerWidth - .5) * 2;
  const cy = (e.clientY / innerHeight - .5) * 2;
  img.style.transform = `translate(${cx*6}px, ${cy*4}px) scale(1.02)`;
});

function getTotalSteps(){ return 7; }

function updProgress(){
  $('#etapaAtual').textContent = state.step;
  $('#etapasTotal').textContent = getTotalSteps();
  const pct = Math.round((state.step / getTotalSteps())*100);
  $('#pct').textContent = pct;
  $('#barra').style.width = pct + '%';
}

function optionButton({value,label,desc,model}){
  const selected = state.form[model] === value;
  const node = el(`
    <button data-model="${model}" data-value="${value}" class="w-full text-left group relative p-4 rounded-2xl border-2 ${selected ? 'border-b44red bg-gradient-to-b from-red-50 to-red-100' : 'border-gray-200 bg-white'} transition">
      <div class="relative flex items-start justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-1">
            <span class="text-xs font-bold px-3 py-1 rounded-full ${selected ? 'bg-b44red text-white':'bg-gray-100 text-gray-600 group-hover:bg-b44 group-hover:text-white'}">${value}</span>
            <span class="font-bold text-lg ${selected ? 'text-b44red':'text-gray-900'}">${label}</span>
          </div>
          ${desc ? `<div class="text-sm text-gray-600 mt-1">${desc}</div>` : ''}
        </div>
        <span class="text-gray-400">›</span>
      </div>
    </button>
  `);
  node.addEventListener('mousedown', ()=> node.classList.add('option-press'));
  node.addEventListener('mouseup', ()=> node.classList.remove('option-press'));
  node.addEventListener('mouseleave', ()=> node.classList.remove('option-press'));
  return node;
}

function inputField({label,type='text',id,placeholder,required=false,error=null}){
  return el(`
    <div class="animate-fade-in">
      <label class="text-xs font-bold tracking-wide text-gray-800">${label}${required? ' *':''}</label>
      <input id="${id}" type="${type}" placeholder="${placeholder||''}" class="mt-2 w-full px-3 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-b44" />
      ${error ? `<div class="text-sm text-red-600 mt-1">${error}</div>`:''}
    </div>
  `);
}

function textareaField({label,id,placeholder}){
  return el(`
    <div class="animate-fade-in">
      <label class="text-xs font-bold tracking-wide text-gray-800">${label}</label>
      <textarea id="${id}" rows="3" placeholder="${placeholder||''}" class="mt-2 w-full px-3 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-b44"></textarea>
    </div>
  `);
}

function validateEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function validatePhone(v){ const d = String(v||'').replace(/\D/g,''); return d.length>=10 && d.length<=11; }
function validateCNPJ(v){ const d = String(v||'').replace(/\D/g,''); return d.length===14; }

function classifyLead(){
  const f = state.form;
  if (f.q3_faturamento === 'B') {
    return { classificacao:'nutricao', prioridade:'nenhuma', gate:'faturamento' };
  }
  const isStrategic = ['A','B','C'].includes(f.q1_finalidade);
  const aporteHigh = ['B','C'].includes(f.q4_aporte); // >= US$10M
  const tempoShort = ['A','B'].includes(f.q5_tempo);
  const estagioMature = ['B','C','D'].includes(f.q6_estagio);
  const funcaoCLevel = ['A','B'].includes(f.q2_funcao);
  if (isStrategic && aporteHigh && tempoShort && estagioMature && funcaoCLevel) {
    return { classificacao:'ceo_ready', prioridade:'alta' };
  }
  const aporteLow = ['A'].includes(f.q4_aporte); // 3-5M
  const funcaoDecision = ['A','B','C'].includes(f.q2_funcao);
  if (isStrategic && (aporteLow || estagioMature) && funcaoDecision) {
    return { classificacao:'especialista', prioridade:'media' };
  }
  if (f.q2_funcao === 'D' || f.q5_tempo === 'D' || f.q6_estagio === 'A') {
    return { classificacao:'nutricao', prioridade:'baixa' };
  }
  return { classificacao:'desalinhado', prioridade:'nenhuma' };
}

async function sendWithWeb3Forms(lead){
  const res = await fetch('https://api.web3forms.com/submit', {
    method:'POST',
    headers:{'Content-Type':'application/json','Accept':'application/json'},
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: 'Novo Lead IC',
      from_name: lead.nome || 'Lead',
      from_email: lead.email || 'no-reply@web3forms.com',
      nome: lead.nome || '',
      telefone: lead.telefone || '',
      email: lead.email || '',
      empresa: lead.empresa || '',
      cnpj: lead.cnpj || '',
      nivel: lead.nivel_legivel || '',
      finalidade: labelFor('q1_finalidade', lead.q1_finalidade) + (lead.q1_outro? ' — ' + lead.q1_outro:''),
      funcao: labelFor('q2_funcao', lead.q2_funcao) + (lead.q2_outro? ' — ' + lead.q2_outro:''),
      faturamento: labelFor('q3_faturamento', lead.q3_faturamento),
      aporte: labelFor('q4_aporte', lead.q4_aporte),
      horizonte: labelFor('q5_tempo', lead.q5_tempo),
      estagio: labelFor('q6_estagio', lead.q6_estagio),
      criado_em: lead.created_at || '',
      botcheck: ''
    })
  });
  let data = null; try { data = await res.json(); } catch(e){}
  if(res.ok && data && (data.success===true || data.success===True)) return { ok:true };
  const err = (data && (data.message||data.error)) || ('status '+res.status);
  return { ok:false, error: err };
}

async function sendWithFormSubmit(lead){
  const formData = new FormData();
  formData.append('nome', lead.nome||'');
  formData.append('telefone', lead.telefone||'');
  formData.append('email', lead.email||'');
  formData.append('empresa', lead.empresa||'');
  formData.append('cnpj', lead.cnpj||'');
  formData.append('nivel', lead.nivel_legivel||'');
  formData.append('finalidade', labelFor('q1_finalidade', lead.q1_finalidade) + (lead.q1_outro? ' — ' + lead.q1_outro:''));
  formData.append('funcao', labelFor('q2_funcao', lead.q2_funcao) + (lead.q2_outro? ' — ' + lead.q2_outro:''));
  formData.append('faturamento', labelFor('q3_faturamento', lead.q3_faturamento)||'');
  formData.append('aporte', labelFor('q4_aporte', lead.q4_aporte)||'');
  formData.append('horizonte', labelFor('q5_tempo', lead.q5_tempo)||'');
  formData.append('estagio', labelFor('q6_estagio', lead.q6_estagio)||'');
  formData.append('criado_em', lead.created_at||'');
  formData.append('_subject', 'Novo Lead IC');
  formData.append('_template', 'table');
  formData.append('_captcha', 'false');
  formData.append('_origin', location.href);
  formData.append('_honey', '');
  const url = `https://formsubmit.co/ajax/${encodeURIComponent(FORMSUBMIT_EMAIL)}`;
  const res = await fetch(url, { method:'POST', body: formData, headers: { 'Accept': 'application/json' } });
  let data = null; try { data = await res.json(); } catch(e){}
  if(res.ok && data && (data.success===true)) return { ok:true };
  const err = (data && (data.message||data.error)) || ('status '+res.status);
  return { ok:false, error: err };
}

async function sendEmailServer(lead){
  const r = await sendWithWeb3Forms(lead);
  if(r.ok) return r;
  const fr = await sendWithFormSubmit(lead);
  if(fr.ok) return fr;
  throw new Error(fr.error || 'Falha no envio');
}

function render(){
  setBackground();
  updProgress();

  const c = $('#content');
  c.classList.remove('animate-fade-in');
  c.classList.add('animate-fade-out');
  setTimeout(()=>{
    c.innerHTML = '';
    c.classList.remove('animate-fade-out');
    c.classList.add('animate-fade-in');

    $('#btnBack').classList.toggle('hidden', state.step===1);
    $('#btnNext').textContent = state.step < getTotalSteps() ? 'Próximo' : (state.result ? 'Concluir' : 'Enviar');

    if(state.result){
      c.appendChild(resultScreen(state.result.type, state.form.nome));
      $('#btnBack').classList.add('hidden');
      $('#btnNext').classList.add('hidden');
      return;
    }

    if(state.step===1){
      const wrap = el(`<div class="p-6 md:p-8">
        <h2 class="text-3xl md:text-4xl font-bold text-b44 mb-8">Seus dados de contato</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
        <div class="mt-4">
          <label class="inline-flex items-start gap-2 text-sm">
            <input id="f_lgpd" type="checkbox" class="mt-1">
            <span>Autorizo o uso dos meus dados conforme a LGPD.</span>
          </label>
          <div id="err_lgpd" class="text-sm text-red-600 mt-1"></div>
        </div>
      </div>`);
      const grid = wrap.querySelector('.grid');
      const f_nome = inputField({label:'Nome completo', id:'f_nome', placeholder:'João Silva', required:true, error: state.errors.nome});
      const f_email = inputField({label:'E-mail corporativo', type:'email', id:'f_email', placeholder:'joao@empresa.com.br', required:true, error: state.errors.email});
      const f_tel = inputField({label:'Telefone / WhatsApp', id:'f_tel', placeholder:'(11) 99999-9999', required:true, error: state.errors.telefone});
      const f_emp = inputField({label:'Empresa', id:'f_emp', placeholder:'Nome da empresa', required:true, error: state.errors.empresa});
      const f_cnpj = inputField({label:'CNPJ', id:'f_cnpj', placeholder:'00.000.000/0000-00', required:true, error: state.errors.cnpj});
      const f_loc = inputField({label:'Localização (opcional)', id:'f_loc', placeholder:'Cidade/Estado'});
      [f_nome,f_email,f_tel,f_emp,f_cnpj,f_loc].forEach(x=>grid.appendChild(x));
      c.appendChild(wrap);
      $('#f_nome').value = state.form.nome; $('#f_email').value=state.form.email;
      $('#f_tel').value=state.form.telefone; $('#f_emp').value=state.form.empresa;
      $('#f_cnpj').value=state.form.cnpj; $('#f_loc').value=state.form.local;
      $('#f_lgpd').checked = state.form.consentimento_lgpd;

      ['f_nome','f_email','f_tel','f_emp','f_cnpj','f_loc'].forEach(id=>{
        $('#'+id).addEventListener('input', ()=>{
          state.form.nome = $('#f_nome').value.trim();
          state.form.email = $('#f_email').value.trim();
          state.form.telefone = $('#f_tel').value.trim();
          state.form.empresa = $('#f_emp').value.trim();
          state.form.cnpj = $('#f_cnpj').value.trim();
          state.form.local = $('#f_loc').value.trim();
        });
      });
      $('#f_lgpd').addEventListener('change', ()=> state.form.consentimento_lgpd = $('#f_lgpd').checked);
    }

    if(state.step===2){
      const w = el(`<div class="p-6 md:p-8">
        <h2 class="text-3xl md:text-4xl font-bold text-b44 mb-8">${QUESTIONS.q1_finalidade.question}</h2>
        <div class="grid gap-3"></div>
        <div id="outroBox1" class="mt-3 ${state.form.q1_finalidade==='E'?'':'hidden'}"></div>
      </div>`);
      QUESTIONS.q1_finalidade.options.forEach(o=>{
        const b = optionButton({...o, model:'q1_finalidade'});
        b.addEventListener('click', ()=>{
          state.form.q1_finalidade=o.value;
          const box = w.querySelector('#outroBox1');
          if(o.value==='E'){
            box.classList.remove('hidden');
            box.innerHTML = '';
            box.appendChild(textareaField({label:'Descreva brevemente', id:'f_q1_outro', placeholder:'Resumo da finalidade estratégica'}));
            setTimeout(()=>{
              const t = document.getElementById('f_q1_outro');
              t.value = state.form.q1_outro || '';
              t.addEventListener('input', ()=> state.form.q1_outro = t.value.trim());
            },10);
          }else{
            box.classList.add('hidden');
            state.form.q1_outro='';
          }
          render();
        });
        w.querySelector('.grid').appendChild(b);
      });
      if(state.form.q1_finalidade==='E'){
        const box = w.querySelector('#outroBox1');
        box.appendChild(textareaField({label:'Descreva brevemente', id:'f_q1_outro', placeholder:'Resumo da finalidade estratégica'}));
        setTimeout(()=>{
          const t = document.getElementById('f_q1_outro');
          t.value = state.form.q1_outro || '';
          t.addEventListener('input', ()=> state.form.q1_outro = t.value.trim());
        },10);
      }
      c.appendChild(w);
    }

    if(state.step===3){
      const w = el(`<div class="p-6 md:p-8">
        <h2 class="text-3xl md:text-4xl font-bold text-b44 mb-8">${QUESTIONS.q2_funcao.question}</h2>
        <div class="grid gap-3"></div>
        <div id="outroBox2" class="mt-3 ${state.form.q2_funcao==='E'?'':'hidden'}"></div>
      </div>`);
      QUESTIONS.q2_funcao.options.forEach(o=>{
        const b = optionButton({...o, model:'q2_funcao'});
        b.addEventListener('click', ()=>{
          state.form.q2_funcao=o.value;
          const box = w.querySelector('#outroBox2');
          if(o.value==='E'){
            box.classList.remove('hidden');
            box.innerHTML = '';
            box.appendChild(textareaField({label:'Especifique brevemente', id:'f_q2_outro', placeholder:'Sua função/nível de decisão'}));
            setTimeout(()=>{
              const t = document.getElementById('f_q2_outro');
              t.value = state.form.q2_outro || '';
              t.addEventListener('input', ()=> state.form.q2_outro = t.value.trim());
            },10);
          }else{
            box.classList.add('hidden');
            state.form.q2_outro='';
          }
          render();
        });
        w.querySelector('.grid').appendChild(b);
      });
      if(state.form.q2_funcao==='E'){
        const box = w.querySelector('#outroBox2');
        box.appendChild(textareaField({label:'Especifique brevemente', id:'f_q2_outro', placeholder:'Sua função/nível de decisão'}));
        setTimeout(()=>{
          const t = document.getElementById('f_q2_outro');
          t.value = state.form.q2_outro || '';
          t.addEventListener('input', ()=> state.form.q2_outro = t.value.trim());
        },10);
      }
      c.appendChild(w);
    }

    if(state.step===4){
      const w = el(`<div class="p-6 md:p-8">
        <h2 class="text-3xl md:text-4xl font-bold text-b44 mb-8">${QUESTIONS.q3_faturamento.question}</h2>
        <div class="grid gap-3"></div>
      </div>`);
      QUESTIONS.q3_faturamento.options.forEach(o=>{
        const b = optionButton({...o, model:'q3_faturamento'});
        b.addEventListener('click', ()=>{ state.form.q3_faturamento=o.value; render(); });
        w.querySelector('.grid').appendChild(b);
      });
      c.appendChild(w);
    }

    if(state.step===5){
      const w = el(`<div class="p-6 md:p-8">
        <h2 class="text-3xl md:text-4xl font-bold text-b44 mb-8">${QUESTIONS.q4_aporte.question}</h2>
        <div class="grid gap-3"></div>
      </div>`);
      QUESTIONS.q4_aporte.options.forEach(o=>{
        const b = optionButton({...o, model:'q4_aporte'});
        b.addEventListener('click', ()=>{ state.form.q4_aporte=o.value; render(); });
        w.querySelector('.grid').appendChild(b);
      });
      c.appendChild(w);
    }

    if(state.step===6){
      const w = el(`<div class="p-6 md:p-8">
        <h2 class="text-3xl md:text-4xl font-bold text-b44 mb-8">${QUESTIONS.q5_tempo.question}</h2>
        <div class="grid gap-3"></div>
      </div>`);
      QUESTIONS.q5_tempo.options.forEach(o=>{
        const b = optionButton({...o, model:'q5_tempo'});
        b.addEventListener('click', ()=>{ state.form.q5_tempo=o.value; render(); });
        w.querySelector('.grid').appendChild(b);
      });
      c.appendChild(w);
    }

    if(state.step===7){
      const w = el(`<div class="p-6 md:p-8">
        <h2 class="text-3xl md:text-4xl font-bold text-b44 mb-8">${QUESTIONS.q6_estagio.question}</h2>
        <div class="grid gap-3"></div>
      </div>`);
      QUESTIONS.q6_estagio.options.forEach(o=>{
        const b = optionButton({...o, model:'q6_estagio'});
        b.addEventListener('click', ()=>{ state.form.q6_estagio=o.value; render(); });
        w.querySelector('.grid').appendChild(b);
      });
      c.appendChild(w);
    }
  }, 120);
}

function levelLabel(code){
  const map = { ceo_ready:'CEO Ready', especialista:'Especialista', nutricao:'Nutrição', desalinhado:'Desalinhado' };
  return map[code] || code || '';
}

async function next(){
  if(state.step===1){
    const e = {};
    if(!state.form.nome.trim()) e.nome='Nome obrigatório';
    if(!state.form.email.trim() || !validateEmail(state.form.email)) e.email='E-mail inválido';
    if(!state.form.telefone.trim()) e.telefone='Telefone obrigatório';
    else if(!validatePhone(state.form.telefone)) e.telefone='Telefone inválido';
    if(!state.form.empresa.trim()) e.empresa='Empresa obrigatória';
    if(!state.form.cnpj.trim() || !validateCNPJ(state.form.cnpj)) e.cnpj='CNPJ obrigatório (14 dígitos)';
    if(!state.form.consentimento_lgpd) e.lgpd='Necessário aceitar os termos';
    state.errors = e;
    if(Object.keys(e).length){ render(); return; }
  }

  if(state.step < 7){ state.step++; render(); return; }

  const { classificacao, prioridade, gate } = classifyLead();
  const payload = { ...state.form, classificacao, prioridade, created_at: new Date().toISOString() };
  payload.nivel_legivel = levelLabel(classificacao);
  if(gate === 'faturamento'){ payload.resultado_motivo = 'Faturamento abaixo de R$ 24MM'; }

  try{
    const resp = await sendEmailServer(payload);
    console.log('Envio OK', resp);
  }catch(err){
    console.error('Falha no envio', err);
    showError('Não foi possível enviar o e-mail agora: ' + (err?.message || 'erro desconhecido'));
  }

  let type='desalinhado';
  if(classificacao==='ceo_ready') type='ceo_ready';
  else if(classificacao==='especialista') type='especialista';
  else if(classificacao==='nutricao') type='nutricao';
  state.result = { type };
  render();
}

function back(){ if(state.step>1){ state.step--; render(); } }

function init(){
  const p = new URLSearchParams(location.search);
  state.form.utm_source = p.get('utm_source') || '';
  state.form.utm_medium = p.get('utm_medium') || '';
  state.form.utm_campaign = p.get('utm_campaign') || '';

  document.getElementById('btnNext').addEventListener('click', next);
  document.getElementById('btnBack').addEventListener('click', back);
  document.getElementById('year').textContent = new Date().getFullYear();
  render();
}

document.addEventListener('DOMContentLoaded', init);

function resultScreen(type, nome){
  const first = (nome||'').split(' ')[0];
  const titles = {
    ceo_ready: 'Parabéns — Perfil CEO-Ready',
    especialista: 'Obrigado — Encaminhado ao Especialista',
    nutricao: 'Recebido — Entrará em Nutrição',
    desalinhado: 'Obrigado — Registro Efetuado'
  };
  const body = {
    ceo_ready: `Parabéns, <strong>${first}</strong>! Seu perfil se alinha às oportunidades estratégicas.`,
    especialista: `Obrigado, <strong>${first}</strong>! Um especialista entrará em contato.`,
    nutricao: `Agradecemos, <strong>${first}</strong>! Suas informações foram registradas.`,
    desalinhado: `Obrigado, <strong>${first}</strong>. Seus dados foram registrados.`
  };
  confetti();
  return el(`
    <div class="text-center result-pulse">
      <div class="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">${type}</div>
      <h2 class="text-2xl md:text-3xl font-black text-b44 mt-3">${titles[type]}</h2>
      <p class="text-gray-700 mt-3">${body[type]}</p>
      <div class="mt-6">
        <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá, tenho interesse em conhecer a operação')}" target="_blank" rel="noopener" class="inline-block bg-[#25D366] text-white font-bold px-5 py-3 rounded-lg shadow">
          Abrir WhatsApp
        </a>
      </div>
    </div>
  `);
}

function confetti(){
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  const W = canvas.width = innerWidth;
  const H = canvas.height = innerHeight;
  const N = 120;
  const parts = Array.from({length:N}, ()=> ({
    x: Math.random()*W, y: -10, r: 2+Math.random()*3, vy: 2+Math.random()*3, vx:-2+Math.random()*4, a: Math.random()*Math.PI
  }));
  let frame = 0, maxFrames = 160;
  function tick(){
    ctx.clearRect(0,0,W,H);
    parts.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.a += .03;
      ctx.globalAlpha = .9;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
    });
    frame++;
    if(frame<maxFrames) requestAnimationFrame(tick);
    else ctx.clearRect(0,0,W,H);
  }
  tick();
}
