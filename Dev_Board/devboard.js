/*Data*/
const tasks = [
  { company: 'Shop Ease',        title: 'Fix Mobile Button Issue',    deadline: '21 March 2025' },
  { company: 'Soft Pay',         title: 'Add Pay Success Modal',      deadline: '25 March 2025' },
  { company: 'Meta',             title: 'Add new reaction 👀',        deadline: '31 March 2025' },
  { company: 'Programming Hero', title: 'Fix Video Loading Issue',    deadline: '21 March 2025' },
  { company: 'Google LLC',       title: 'Integrate AI search',        deadline: '01 April 2025' },
  { company: 'Polygon Tech',     title: 'Review Ami Probashi Site',   deadline: '5 May 2025'   }
];
const blurb = 'A card component has a figure, a body part, and inside body there are title and actions parts';

const blogs = [
  { q: 'What are the different ways to select an element in the DOM?',
    a: 'We can select elements using getElementById, getElementsByClassName, getElementsByTagName, querySelector, and querySelectorAll.' },
  { q: 'What is the difference between innerHTML, innerText, and textContent?',
    a: 'innerHTML returns HTML content, innerText gets visible text, and textContent retrieves all text, including hidden elements.' },
  { q: 'What is event delegation in the DOM?',
    a: 'Event delegation is a technique where you add a single event listener to a parent element to handle events for all its current and future child elements, leveraging event bubbling.' },
  { q: 'What is event bubbling in the DOM?',
    a: 'Event bubbling is a mechanism in the DOM where an event triggered on a child element propagates upward through its parent elements in the hierarchy.' },
  { q: 'How do you create, add, and remove elements using JavaScript?',
    a: 'Create with document.createElement, add with appendChild or append, and remove with remove or removeChild.' }
];

let completed = 0;

const $ = (id) => document.getElementById(id);

function renderTasks(){
  $('taskGrid').innerHTML = tasks.map((t, i) => `
    <article class="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col">
      <span class="self-start text-[13px] text-slate-500 border border-slate-200 rounded-lg px-3 py-1">${t.company}</span>
      <h3 class="mt-3 font-bold text-[17px] leading-snug">${t.title}</h3>
      <p class="mt-3 text-[13px] leading-6 text-slate-400 bg-slate-50 rounded-lg p-3 flex-1">${blurb}</p>
      <div class="dashed my-4"></div>
      <div class="flex items-end justify-between gap-3">
        <div>
          <p class="text-[13px] text-slate-400">Deadline</p>
          <p class="text-[13px] text-slate-500">${t.deadline}</p>
        </div>
        <button data-task="${t.title}"
          class="completeBtn bg-brand text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#3d2cd6] active:scale-95 transition">
          Completed
        </button>
      </div>
    </article>
  `).join('');

  // Task Assigned = number of task cards currently on the board
  $('assignedCount').textContent = document.querySelectorAll('#taskGrid article').length;
}

/*Complete a task*/
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.completeBtn');
  if (!btn || btn.disabled) return;

  alert('Board updated successfully');           // popup → user presses OK

  btn.disabled = true;
  btn.className = 'completeBtn bg-slate-300 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-not-allowed';

  completed += 1;
  $('completedCount').textContent = completed;

  const left = Number($('assignedCount').textContent) - 1;
  $('assignedCount').textContent = left < 0 ? 0 : left;

  addLog(btn.dataset.task);
});

/*Activity log*/
function addLog(title){
  $('logEmpty')?.remove();
  const time = new Date().toLocaleTimeString('en-US', { hour12: true });
  const item = document.createElement('div');
  item.className = 'log-enter bg-slate-50 rounded-lg p-3 text-[13px] leading-6 text-slate-600';
  item.textContent = `You have completed the task ${title} at ${time}.`;
  $('logList').prepend(item);
}

$('clearBtn').addEventListener('click', () => {
  $('logList').innerHTML = '<p id="logEmpty" class="text-sm text-slate-400 text-center py-6">Finish a task to start your log.</p>';
});

/*date*/
function tick(){
  const now = new Date();
  const [day, month, date, year] = now.toDateString().split(' ');
  $('liveDate').textContent = `${day} ${month} ${date}, ${year}`;
  $('liveTime').textContent = now.toLocaleTimeString('en-US', { hour12: true });
}
tick();
setInterval(tick, 1000);

const palette = ['#940303', '#248806', '#ffe600', '#160d01', '#01cbfd', '#6d06f3', '#fc9105'];
let paletteIndex = 0;
$('themeBtn').addEventListener('click', () => {
  paletteIndex = (paletteIndex + 1) % palette.length;
  document.documentElement.style.setProperty('--page-bg', palette[paletteIndex]);
});

/*Blogs page */
$('blogList').innerHTML = blogs.map((b, i) => `
  <section class="bg-white rounded-xl shadow-sm">
    <h2 class="font-bold px-5 sm:px-6 py-4 leading-snug">Question-${i + 1}: ${b.q}</h2>
    <div class="dashed mx-5 sm:mx-6"></div>
    <p class="px-5 sm:px-6 py-4 text-slate-400 leading-7">${b.a}</p>
  </section>
`).join('');

$('discoverBtn').addEventListener('click', () => {
  $('deskView').classList.add('hidden');
  $('blogView').classList.remove('hidden');
  window.scrollTo(0, 0);
});
$('backBtn').addEventListener('click', () => {
  $('blogView').classList.add('hidden');
  $('deskView').classList.remove('hidden');
  window.scrollTo(0, 0);
});

renderTasks();
