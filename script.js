// Simple localStorage-backed student manager and printable report generator

const STORAGE_KEY = 'case_conf_students_v1';

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

function loadStudents() {
  const raw = localStorage.getItem(STORAGE_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse stored students:', e);
    return [];
  }
}

function saveStudents(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function renderList(filter='') {
  const ul = document.getElementById('studentsList');
  ul.innerHTML = '';
  const students = loadStudents();
  const f = filter.trim().toLowerCase();
  const filtered = students.filter(s => !f || (s.name && s.name.toLowerCase().includes(f)) || (s.center && s.center.toLowerCase().includes(f)));
  if (!filtered.length) {
    ul.innerHTML = '<li class="text-sm text-gray-500">No students yet — add one using the form.</li>';
    return;
  }
  filtered.forEach(s => {
    const li = document.createElement('li');
    li.className = 'p-2 rounded-md flex items-center justify-between';
    li.innerHTML = `
      <div class="flex-1">
        <div class="font-medium">${escapeHtml(s.name || '(no name)')}</div>
        <div class="text-xs text-gray-600">${escapeHtml(s.center || '')} ${s.dob ? '• ' + s.dob : ''}</div>
      </div>
      <div class="flex gap-2 items-center ml-3">
        <button data-id="${s.id}" class="reportBtn px-2 py-1 rounded-md border text-sm" title="Open printable report">🖨️</button>
        <button data-id="${s.id}" class="editBtn px-2 py-1 rounded-md border text-sm" title="Edit">✏️</button>
        <button data-id="${s.id}" class="delBtn px-2 py-1 rounded-md border text-sm text-red-600" title="Delete">🗑️</button>
      </div>
    `;
    ul.appendChild(li);
  });

  // attach handlers
  ul.querySelectorAll('.editBtn').forEach(b => b.onclick = e => editStudent(e.target.dataset.id));
  ul.querySelectorAll('.delBtn').forEach(b => b.onclick = e => deleteStudent(e.target.dataset.id));
  ul.querySelectorAll('.reportBtn').forEach(b => b.onclick = e => generateReport(e.target.dataset.id));
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function clearForm() {
  ['studentId','name','dob','center','teacher','goals','progress'].forEach(id => document.getElementById(id).value = '');
}

function fillForm(s) {
  document.getElementById('studentId').value = s.id || '';
  document.getElementById('name').value = s.name || '';
  document.getElementById('dob').value = s.dob || '';
  document.getElementById('center').value = s.center || '';
  document.getElementById('teacher').value = s.teacher || '';
  document.getElementById('goals').value = s.goals || '';
  document.getElementById('progress').value = s.progress || '';
}

function addOrUpdateStudent(ev) {
  ev.preventDefault();
  const id = document.getElementById('studentId').value || uid();
  const student = {
    id,
    name: document.getElementById('name').value.trim(),
    dob: document.getElementById('dob').value,
    center: document.getElementById('center').value.trim(),
    teacher: document.getElementById('teacher').value.trim(),
    goals: document.getElementById('goals').value.trim(),
    progress: document.getElementById('progress').value.trim(),
    updated: new Date().toISOString()
  };
  const list = loadStudents();
  const idx = list.findIndex(s => s.id === id);
  if (idx >= 0) list[idx] = student; else list.push(student);
  saveStudents(list);
  renderList(document.getElementById('search').value);
  clearForm();
}

function editStudent(id) {
  const list = loadStudents();
  const s = list.find(x => x.id === id);
  if (!s) return alert('Student not found');
  fillForm(s);
  window.scrollTo({top:0,behavior:'smooth'});
}

function deleteStudent(id) {
  if (!confirm('Delete this student? This cannot be undone.')) return;
  const list = loadStudents().filter(s => s.id !== id);
  saveStudents(list);
  renderList(document.getElementById('search').value);
}

function generateReport(id) {
  const list = loadStudents();
  const s = list.find(x => x.id === id);
  if (!s) return alert('Student not found');
  const html = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Case Conference - ${escapeHtml(s.name)}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; color: #111; }
      h1 { font-size: 20px; margin-bottom: 6px; }
      .meta { color: #333; margin-bottom: 12px; }
      .section { margin-top: 12px; }
      .label { font-weight: 600; margin-bottom: 6px; }
      .box { border: 1px solid #ccc; padding: 10px; border-radius: 6px; background: #fff; }
      .small { font-size: 12px; color: #555; margin-top: 8px; }
      @media print { button { display: none; } }
    </style>
  </head>
  <body>
    <button onclick="window.print()" style="padding:8px 12px;margin-bottom:12px">Print report</button>
    <h1>Case Conference Form</h1>
    <div class="meta">
      <div><strong>Name:</strong> ${escapeHtml(s.name)}</div>
      <div><strong>DOB:</strong> ${escapeHtml(s.dob || '')}</div>
      <div><strong>Center:</strong> ${escapeHtml(s.center || '')}</div>
      <div><strong>Teacher:</strong> ${escapeHtml(s.teacher || '')}</div>
      <div class="small">Generated: ${new Date().toLocaleString()}</div>
    </div>

    <div class="section">
      <div class="label">Goals / Areas of focus</div>
      <div class="box">${escapeHtml(s.goals).replace(/\n/g,'<br>') || '<em>None provided</em>'}</div>
    </div>

    <div class="section">
      <div class="label">Progress notes</div>
      <div class="box">${escapeHtml(s.progress).replace(/\n/g,'<br>') || '<em>No notes</em>'}</div>
    </div>

    <div class="section small">This is a prototype report generated from locally stored data.</div>
  </body>
  </html>
  `;
  const w = window.open('', '_blank', 'noopener');
  w.document.write(html);
  w.document.close();
}

// Export data as JSON file
function exportData() {
  const data = loadStudents();
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'students_backup.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Import JSON (simple)
function importData() {
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = 'application/json';
  inp.onchange = () => {
    const f = inp.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed)) throw new Error('Expected an array of students');
        saveStudents(parsed);
        renderList();
        alert('Imported ' + parsed.length + ' students.');
      } catch (e) {
        alert('Failed to import: ' + e.message);
      }
    };
    reader.readAsText(f);
  };
  inp.click();
}

document.addEventListener('DOMContentLoaded', () => {
  renderList();
  document.getElementById('studentForm').addEventListener('submit', addOrUpdateStudent);
  document.getElementById('clearBtn').addEventListener('click', clearForm);
  document.getElementById('exportBtn').addEventListener('click', exportData);
  document.getElementById('importBtn').addEventListener('click', importData);
  document.getElementById('search').addEventListener('input', (e) => renderList(e.target.value));
});
