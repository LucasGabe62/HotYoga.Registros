// ============================================================
// CONFIGURAÇÃO: substitua pela URL real do seu backend
// ============================================================
const BASE_URL = 'https://academia-backend-pvnm.onrender.com';

const TREINO_API    = `${BASE_URL}/api/treinos`;
const EXERCICIO_API = `${BASE_URL}/api/exercicios`;

// ============================================================
// NAVEGAÇÃO POR ABAS
// ============================================================
document.querySelectorAll('[data-tab]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active-panel'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active-panel');
  });
});

// ============================================================
// UTILITÁRIOS
// ============================================================
function formatDate(d) {
  return new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function showMessage(id, text, isErr = false) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = `form-message ${isErr ? 'err' : 'ok'}`;
  setTimeout(() => { el.textContent = ''; el.className = 'form-message'; }, 4000);
}

function updateStats(treinos, exercicios) {
  if (treinos   !== undefined) document.getElementById('stat-treinos').textContent = treinos;
  if (exercicios !== undefined) document.getElementById('stat-exercicios').textContent = exercicios;
}

// ============================================================
// TREINOS — CRUD
// ============================================================
const treinoForm        = document.getElementById('treino-form');
const treinoIdInput     = document.getElementById('treino-id');
const tituloInput       = document.getElementById('titulo');
const descricaoInput    = document.getElementById('descricao');
const realizadoEmInput  = document.getElementById('realizadoEm');
const treinoFormTitle   = document.getElementById('form-title');
const cancelTreinoEdit  = document.getElementById('cancel-treino-edit');
const treinosList       = document.getElementById('treinos-list');

function clearTreinoForm() {
  treinoForm.reset();
  treinoIdInput.value = '';
  treinoFormTitle.textContent = 'Nova Prática';
  cancelTreinoEdit.classList.add('hidden');
  realizadoEmInput.value = new Date().toISOString().slice(0, 16);
}

async function loadTreinos() {
  treinosList.innerHTML = `
    <div class="empty-state">
      <span class="empty-state-icon">◌</span>
      <p>Carregando...</p>
    </div>`;
  try {
    const res = await fetch(TREINO_API);
    const treinos = await res.json();
    updateStats(treinos.length, undefined);

    if (!treinos.length) {
      treinosList.innerHTML = `
        <div class="empty-state">
          <span class="empty-state-icon">🌿</span>
          <p>Nenhuma prática registrada ainda.</p>
        </div>`;
      return;
    }

    treinosList.innerHTML = treinos.map((t) => `
      <div class="entry-card">
        <div class="entry-top">
          <span class="entry-title">${t.titulo}</span>
          <div class="entry-actions">
            <button class="btn-action" onclick="editTreino('${t._id}')">editar</button>
            <button class="btn-action danger" onclick="deleteTreino('${t._id}')">excluir</button>
          </div>
        </div>
        <div class="entry-meta">${formatDate(t.realizadoEm)}</div>
        <div class="entry-desc">${t.descricao}</div>
      </div>
    `).join('');
  } catch {
    treinosList.innerHTML = '<p class="error-state">Erro ao conectar com o servidor.</p>';
  }
}

window.editTreino = async function (id) {
  const res = await fetch(`${TREINO_API}/${id}`);
  const t = await res.json();
  treinoIdInput.value = t._id;
  tituloInput.value = t.titulo;
  descricaoInput.value = t.descricao;
  realizadoEmInput.value = new Date(t.realizadoEm).toISOString().slice(0, 16);
  treinoFormTitle.textContent = 'Editar Prática';
  cancelTreinoEdit.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.deleteTreino = async function (id) {
  if (!confirm('Deseja remover esta prática?')) return;
  const res = await fetch(`${TREINO_API}/${id}`, { method: 'DELETE' });
  showMessage('treino-message', res.ok ? 'Prática removida.' : 'Erro ao remover.', !res.ok);
  if (res.ok) loadTreinos();
};

treinoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = treinoIdInput.value;
  const data = { titulo: tituloInput.value, descricao: descricaoInput.value, realizadoEm: realizadoEmInput.value };
  const res = await fetch(id ? `${TREINO_API}/${id}` : TREINO_API, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  showMessage('treino-message', res.ok ? (id ? 'Prática atualizada.' : 'Prática registrada.') : 'Erro ao salvar.', !res.ok);
  if (res.ok) { clearTreinoForm(); loadTreinos(); }
});

cancelTreinoEdit.addEventListener('click', () => { clearTreinoForm(); showMessage('treino-message', 'Edição cancelada.'); });
document.getElementById('reload-treinos').addEventListener('click', loadTreinos);

// ============================================================
// EXERCÍCIOS — CRUD
// ============================================================
const exercicioForm       = document.getElementById('exercicio-form');
const exercicioIdInput    = document.getElementById('exercicio-id');
const exercicioNome       = document.getElementById('exercicio-nome');
const exercicioGrupo      = document.getElementById('exercicio-grupo');
const exercicioSeries     = document.getElementById('exercicio-series');
const exercicioRepeticoes = document.getElementById('exercicio-repeticoes');
const exercicioCarga      = document.getElementById('exercicio-carga');
const exercicioObservacao = document.getElementById('exercicio-observacao');
const exercicioFormTitle  = document.getElementById('exercicio-form-title');
const cancelExercicioEdit = document.getElementById('cancel-exercicio-edit');
const exerciciosList      = document.getElementById('exercicios-list');

function clearExercicioForm() {
  exercicioForm.reset();
  exercicioIdInput.value = '';
  exercicioFormTitle.textContent = 'Novo Movimento';
  cancelExercicioEdit.classList.add('hidden');
}

async function loadExercicios() {
  exerciciosList.innerHTML = `
    <div class="empty-state">
      <span class="empty-state-icon">◌</span>
      <p>Carregando...</p>
    </div>`;
  try {
    const res = await fetch(EXERCICIO_API);
    const exercicios = await res.json();
    updateStats(undefined, exercicios.length);

    if (!exercicios.length) {
      exerciciosList.innerHTML = `
        <div class="empty-state">
          <span class="empty-state-icon">🌱</span>
          <p>Nenhum movimento catalogado ainda.</p>
        </div>`;
      return;
    }

    exerciciosList.innerHTML = exercicios.map((ex) => `
      <div class="entry-card">
        <div class="entry-top">
          <span class="entry-title">${ex.nome}</span>
          <div class="entry-actions">
            <button class="btn-action" onclick="editExercicio('${ex._id}')">editar</button>
            <button class="btn-action danger" onclick="deleteExercicio('${ex._id}')">excluir</button>
          </div>
        </div>
        <div class="entry-badges">
          <span class="badge badge-group">${ex.grupoMuscular}</span>
          <span class="badge badge-stat">${ex.series} × ${ex.repeticoes}</span>
          ${ex.carga ? `<span class="badge badge-carga">${ex.carga} kg</span>` : ''}
        </div>
        ${ex.observacao ? `<div class="entry-desc" style="margin-top:10px">${ex.observacao}</div>` : ''}
      </div>
    `).join('');
  } catch {
    exerciciosList.innerHTML = '<p class="error-state">Erro ao conectar com o servidor.</p>';
  }
}

window.editExercicio = async function (id) {
  const res = await fetch(`${EXERCICIO_API}/${id}`);
  const ex = await res.json();
  exercicioIdInput.value = ex._id;
  exercicioNome.value = ex.nome;
  exercicioGrupo.value = ex.grupoMuscular;
  exercicioSeries.value = ex.series;
  exercicioRepeticoes.value = ex.repeticoes;
  exercicioCarga.value = ex.carga || '';
  exercicioObservacao.value = ex.observacao || '';
  exercicioFormTitle.textContent = 'Editar Movimento';
  cancelExercicioEdit.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.deleteExercicio = async function (id) {
  if (!confirm('Deseja remover este movimento?')) return;
  const res = await fetch(`${EXERCICIO_API}/${id}`, { method: 'DELETE' });
  showMessage('exercicio-message', res.ok ? 'Movimento removido.' : 'Erro ao remover.', !res.ok);
  if (res.ok) loadExercicios();
};

exercicioForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = exercicioIdInput.value;
  const data = {
    nome: exercicioNome.value,
    grupoMuscular: exercicioGrupo.value,
    series: parseInt(exercicioSeries.value),
    repeticoes: parseInt(exercicioRepeticoes.value),
    carga: parseFloat(exercicioCarga.value) || 0,
    observacao: exercicioObservacao.value
  };
  const res = await fetch(id ? `${EXERCICIO_API}/${id}` : EXERCICIO_API, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  showMessage('exercicio-message', res.ok ? (id ? 'Movimento atualizado.' : 'Movimento catalogado.') : 'Erro ao salvar.', !res.ok);
  if (res.ok) { clearExercicioForm(); loadExercicios(); }
});

cancelExercicioEdit.addEventListener('click', () => {
  clearExercicioForm();
  showMessage('exercicio-message', 'Edição cancelada.');
});
document.getElementById('reload-exercicios').addEventListener('click', loadExercicios);

// ============================================================
// INIT
// ============================================================
clearTreinoForm();
loadTreinos();
loadExercicios();
