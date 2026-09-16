/**
 * GymMaster - Main Application Logic
 * Supports Gym Machines management, split days, photo capture & optimization,
 * workout logging, trend visualization with Chart.js, and local IndexedDB backup/restore.
 */

// Global State
const state = {
    activeTab: 'view-machines',
    activeDayId: 'all',
    searchQuery: '',
    currentMachineIdForTrend: null,
    splitDays: [],
    machines: [],
    chartInstance: null
};

// Available Icons for Workout Day Splits
const SPLIT_ICONS = [
    { icon: 'fa-dumbbell', label: 'משקולת' },
    { icon: 'fa-arrows-up-down', label: 'משיכה/גב' },
    { icon: 'fa-person-running', label: 'רגליים/ריצה' },
    { icon: 'fa-hand-back-fist', label: 'זרועות/אגרוף' },
    { icon: 'fa-fire', label: 'כוח/אנרגיה' },
    { icon: 'fa-heart-pulse', label: 'אירובי/דופק' },
    { icon: 'fa-stopwatch', label: 'אינטרוולים' },
    { icon: 'fa-bolt', label: 'כוח מתפרץ' },
    { icon: 'fa-shield-halved', label: 'בטן/ליבה' },
    { icon: 'fa-award', label: 'שיא PR' },
    { icon: 'fa-bullseye', label: 'מטרה' },
    { icon: 'fa-weight-hanging', label: 'משקל כבד' }
];

// Available Theme Colors for Workout Day Splits
const SPLIT_COLORS = [
    '#10b981', // Emerald
    '#06b6d4', // Cyan
    '#38bdf8', // Light Blue
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#f59e0b', // Amber
    '#f43f5e', // Rose
    '#14b8a6', // Teal
    '#6366f1', // Indigo
    '#84cc16'  // Lime
];

// Popular Pre-built Workout Split Templates
const PRESET_TEMPLATES = [
    {
        id: 'ppl',
        title: 'Push / Pull / Legs (PPL)',
        description: 'הפיצול הפופולרי ביותר – חלוקה לדחיפה, משיכה ורגליים (3-6 אימונים בשבוע)',
        days: [
            { name: 'Push (חזה, כתפיים, יד אחורית)', icon: 'fa-dumbbell', color: '#06b6d4', schedule: 'יום א\' ו-ד\'' },
            { name: 'Pull (גב ויד קדמית)', icon: 'fa-arrows-up-down', color: '#10b981', schedule: 'יום ב\' ו-ה\'' },
            { name: 'Legs & Core (רגליים ובטן)', icon: 'fa-person-running', color: '#f59e0b', schedule: 'יום ג\' ו-ו\'' }
        ]
    },
    {
        id: 'upper_lower',
        title: 'עליון / תחתון (Upper / Lower)',
        description: 'חלוקה ל-4 אימונים שבועיים: פלג גוף עליון ותחתון לסירוגין',
        days: [
            { name: 'Upper Body (פלג גוף עליון)', icon: 'fa-dumbbell', color: '#38bdf8', schedule: 'אימון עליון א\' / ג\'' },
            { name: 'Lower Body (פלג גוף תחתון)', icon: 'fa-person-running', color: '#ec4899', schedule: 'אימון תחתון ב\' / ד\'' }
        ]
    },
    {
        id: 'classic_3',
        title: 'קלאסי 3 ימים (Arnold / Split)',
        description: 'חלוקת שרירים קלאסית ומאוזנת לשלושה ימי אימון ממוקדים',
        days: [
            { name: 'חזה וכתפיים', icon: 'fa-dumbbell', color: '#06b6d4', schedule: 'יום ראשון' },
            { name: 'גב ויד קדמית', icon: 'fa-arrows-up-down', color: '#10b981', schedule: 'יום שלישי' },
            { name: 'רגליים ויד אחורית', icon: 'fa-person-running', color: '#f59e0b', schedule: 'יום חמישי' }
        ]
    },
    {
        id: 'weekdays_5',
        title: 'ימי השבוע (ראשון עד חמישי)',
        description: 'שמות ימים ישירים ומסודרים לפי סדר ימי השבוע',
        days: [
            { name: 'יום ראשון', icon: 'fa-dumbbell', color: '#38bdf8', schedule: 'אימון פתיחת שבוע' },
            { name: 'יום שני', icon: 'fa-arrows-up-down', color: '#10b981', schedule: 'אימון שני' },
            { name: 'יום שלישי', icon: 'fa-person-running', color: '#f59e0b', schedule: 'אימון אמצע שבוע' },
            { name: 'יום רביעי', icon: 'fa-hand-back-fist', color: '#ec4899', schedule: 'אימון רביעי' },
            { name: 'יום חמישי', icon: 'fa-fire', color: '#8b5cf6', schedule: 'אימון סגירת שבוע' }
        ]
    },
    {
        id: 'fbw',
        title: 'אימון כללי (Full Body Workout)',
        description: '2-3 אימונים בשבוע המשלבים את כל קבוצות השרירים',
        days: [
            { name: 'אימון A - כללי (חזה, גב, רגליים)', icon: 'fa-fire', color: '#10b981', schedule: 'יום ראשון' },
            { name: 'אימון B - כללי (כתפיים, ידיים, בטן)', icon: 'fa-bolt', color: '#06b6d4', schedule: 'יום רביעי' }
        ]
    }
];

// ==========================================
// 1. CUSTOM POPUP SYSTEM
// User Rule: "never use basic alert , always create a nice popup"
// ==========================================
const Popup = {
    toast(message, type = 'info', duration = 3200) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toastEl = document.createElement('div');
        toastEl.className = `toast ${type}`;

        let iconClass = 'fa-info-circle';
        if (type === 'success') iconClass = 'fa-check-circle';
        if (type === 'error') iconClass = 'fa-circle-exclamation';
        if (type === 'warning') iconClass = 'fa-triangle-exclamation';

        toastEl.innerHTML = `
            <i class="fa-solid ${iconClass} toast-icon"></i>
            <div style="flex: 1;">${message}</div>
        `;

        container.appendChild(toastEl);

        setTimeout(() => {
            toastEl.classList.add('toast-exit');
            setTimeout(() => toastEl.remove(), 260);
        }, duration);
    },

    alert(title, message, iconType = 'info') {
        return new Promise((resolve) => {
            const overlay = document.getElementById('custom-popup');
            const iconWrap = document.getElementById('popup-icon');
            const titleEl = document.getElementById('popup-title');
            const msgEl = document.getElementById('popup-message');
            const actionsEl = document.getElementById('popup-actions');

            iconWrap.className = `popup-icon-wrap ${iconType}`;
            let iconMarkup = '<i class="fa-solid fa-circle-info"></i>';
            if (iconType === 'success') iconMarkup = '<i class="fa-solid fa-circle-check"></i>';
            if (iconType === 'danger' || iconType === 'error') iconMarkup = '<i class="fa-solid fa-triangle-exclamation"></i>';
            if (iconType === 'warning') iconMarkup = '<i class="fa-solid fa-circle-exclamation"></i>';
            iconWrap.innerHTML = iconMarkup;

            titleEl.textContent = title;
            msgEl.textContent = message;

            actionsEl.innerHTML = `
                <button class="btn btn-primary btn-lg" id="popup-confirm-btn" style="width: 100%;">
                    <span>הבנתי, תודה</span>
                </button>
            `;

            overlay.classList.add('show');

            const confirmBtn = document.getElementById('popup-confirm-btn');
            const cleanup = () => {
                overlay.classList.remove('show');
                confirmBtn.removeEventListener('click', onClick);
                resolve();
            };
            const onClick = () => cleanup();
            confirmBtn.addEventListener('click', onClick);
        });
    },

    confirm(title, message, { confirmText = 'אישור', cancelText = 'ביטול', danger = false, iconType = 'warning' } = {}) {
        return new Promise((resolve) => {
            const overlay = document.getElementById('custom-popup');
            const iconWrap = document.getElementById('popup-icon');
            const titleEl = document.getElementById('popup-title');
            const msgEl = document.getElementById('popup-message');
            const actionsEl = document.getElementById('popup-actions');

            iconWrap.className = `popup-icon-wrap ${danger ? 'danger' : iconType}`;
            let iconMarkup = '<i class="fa-solid fa-circle-question"></i>';
            if (danger) iconMarkup = '<i class="fa-solid fa-triangle-exclamation"></i>';
            iconWrap.innerHTML = iconMarkup;

            titleEl.textContent = title;
            msgEl.textContent = message;

            actionsEl.innerHTML = `
                <button class="btn btn-secondary" id="popup-cancel-btn">${cancelText}</button>
                <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" id="popup-confirm-btn">${confirmText}</button>
            `;

            overlay.classList.add('show');

            const confirmBtn = document.getElementById('popup-confirm-btn');
            const cancelBtn = document.getElementById('popup-cancel-btn');

            const close = (result) => {
                overlay.classList.remove('show');
                resolve(result);
            };

            confirmBtn.onclick = () => close(true);
            cancelBtn.onclick = () => close(false);
        });
    },

    imagePreview(src, title) {
        const modal = document.getElementById('lightbox-modal');
        const img = document.getElementById('lightbox-img');
        const caption = document.getElementById('lightbox-caption');

        img.src = src;
        caption.textContent = title || 'תמונת מכשיר';
        modal.classList.add('show');
    }
};

// Safe fallback for window.alert
window.alert = (msg) => {
    Popup.alert('הודעה', msg);
};

// ==========================================
// 2. IMAGE OPTIMIZATION (Mobile Camera & Gallery)
// Resizes large phone photos down to ~900px max to save space in IndexedDB
// ==========================================
function compressImage(file, maxDimension = 900, quality = 0.82) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = Math.round((height * maxDimension) / width);
                        width = maxDimension;
                    } else {
                        width = Math.round((width * maxDimension) / height);
                        height = maxDimension;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

// Sample placeholder images for seed machines
function createMachineIconSvg(color1 = '#10b981', color2 = '#06b6d4', iconType = 'dumbbell') {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
        <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0f172a" />
                <stop offset="100%" stop-color="#1e293b" />
            </linearGradient>
            <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${color1}" />
                <stop offset="100%" stop-color="${color2}" />
            </linearGradient>
        </defs>
        <rect width="600" height="400" fill="url(#bgGrad)" />
        <circle cx="300" cy="200" r="100" fill="none" stroke="url(#accentGrad)" stroke-width="6" opacity="0.4" />
        <circle cx="300" cy="200" r="120" fill="none" stroke="url(#accentGrad)" stroke-width="2" stroke-dasharray="10 10" opacity="0.3" />
        <g fill="url(#accentGrad)" transform="translate(240, 140) scale(2.5)">
            <path d="M12 2a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4v4h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4v2a2 2 0 1 1-4 0v-2H8a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h4v-4H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4V4a2 2 0 0 1 2-2z"/>
        </g>
        <text x="300" y="325" fill="#94a3b8" font-size="22" font-family="Rubik, sans-serif" text-anchor="middle" font-weight="600">Gym Equipment</text>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// ==========================================
// 3. APPLICATION INITIALIZATION & SEEDING
// ==========================================
async function initApp() {
    try {
        await gymDB.init();

        await refreshAllData();
        setupEventListeners();
        setupNavigation();
        setupStepperControls();
        setupLightbox();

        Popup.toast('GymMaster נטען בהצלחה! ברוך הבא לאימון.', 'success');
    } catch (err) {
        console.error('Initialization error:', err);
        Popup.alert('שגיאה באתחול', 'אירעה שגיאה בטעינת מאגר הנתונים המקומי: ' + err.message, 'danger');
    }
}

// Initial demo data for rich first-run experience
async function seedDemoData() {
    const days = await gymDB.getAllSplitDays();
    const chestDay = days.find(d => d.id === 'chest_shoulders') || days[0];
    const backDay = days.find(d => d.id === 'back_biceps') || days[1];
    const legsDay = days.find(d => d.id === 'legs_abs') || days[2];
    const armsDay = days.find(d => d.id === 'arms_core') || days[3];

    const demoMachines = [
        {
            name: 'לחיצת חזה במכונה (Chest Press)',
            days: [chestDay.id],
            defaultWeight: 50,
            defaultSets: 3,
            defaultReps: 10,
            seatSetting: 'מושב בגובה 4, ידיות בקו פטמות',
            notes: 'להצמיד שכמות אחורה, מרפקים ב-45 מעלות, לשלוט בירידה',
            photoBase64: createMachineIconSvg('#10b981', '#06b6d4'),
            createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
        },
        {
            name: 'לחיצת כתפיים בישיבה (Shoulder Press)',
            days: [chestDay.id],
            defaultWeight: 35,
            defaultSets: 3,
            defaultReps: 10,
            seatSetting: 'משענת ב-80 מעלות, גובה 3',
            notes: 'דחיפה מעלה בלי לנעול מרפקים, בטן מוחזקת',
            photoBase64: createMachineIconSvg('#38bdf8', '#06b6d4'),
            createdAt: new Date(Date.now() - 28 * 86400000).toISOString()
        },
        {
            name: 'פרפר במכונה (Pec Deck Flyes)',
            days: [chestDay.id],
            defaultWeight: 45,
            defaultSets: 3,
            defaultReps: 12,
            seatSetting: 'מושב גובה 5, מרפקים מעט כפופים',
            notes: 'כיווץ מודגש לשנייה במרכז, פתיחה איטית ומבוקרת',
            photoBase64: createMachineIconSvg('#06b6d4', '#10b981'),
            createdAt: new Date(Date.now() - 26 * 86400000).toISOString()
        },
        {
            name: 'פולי עליון באחיזה רחבה (Lat Pulldown)',
            days: [backDay ? backDay.id : chestDay.id],
            defaultWeight: 55,
            defaultSets: 4,
            defaultReps: 12,
            seatSetting: 'כריות ירך צמודות, מוט רחב',
            notes: 'משיכה לכיוון החזה העליון, כיווץ שכמות בסוף המשיכה',
            photoBase64: createMachineIconSvg('#06b6d4', '#3b82f6'),
            createdAt: new Date(Date.now() - 25 * 86400000).toISOString()
        },
        {
            name: 'לחיצת רגליים 45 מעלות (Leg Press)',
            days: [legsDay ? legsDay.id : chestDay.id],
            defaultWeight: 140,
            defaultSets: 4,
            defaultReps: 10,
            seatSetting: 'משענת במצב אמצעי, פין בטיחות חור 3',
            notes: 'כפות רגליים ברוחב כתפיים, לא לנעול ברכיים בסיום דחיפה',
            photoBase64: createMachineIconSvg('#f59e0b', '#ef4444'),
            createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
        },
        {
            name: 'כפיפת מרפקים בפריצ\'ר (Preacher Curl)',
            days: [armsDay ? armsDay.id : chestDay.id, chestDay.id],
            defaultWeight: 30,
            defaultSets: 3,
            defaultReps: 12,
            seatSetting: 'מושב גובה 3, בית שחי צמוד לכרית',
            notes: 'בידוד מלא של יד קדמית, לא להתרומם מהכרית',
            photoBase64: createMachineIconSvg('#ec4899', '#8b5cf6'),
            createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
        }
    ];

    for (const m of demoMachines) {
        const saved = await gymDB.saveMachine(m);

        // Add history logs to demo machines to showcase Trend right away
        const now = Date.now();
        const baseW = m.defaultWeight - 10;
        await gymDB.addLog({
            machineId: saved.id,
            date: new Date(now - 21 * 86400000).toISOString(),
            weight: baseW,
            sets: 3,
            reps: 10,
            notes: 'אימון ראשון למכשיר'
        });
        await gymDB.addLog({
            machineId: saved.id,
            date: new Date(now - 14 * 86400000).toISOString(),
            weight: baseW + 2.5,
            sets: 3,
            reps: 10,
            notes: 'הרגיש טוב, עלייה קלה'
        });
        await gymDB.addLog({
            machineId: saved.id,
            date: new Date(now - 7 * 86400000).toISOString(),
            weight: baseW + 5,
            sets: 3,
            reps: 10,
            notes: 'התקדמות יציבה'
        });
        await gymDB.addLog({
            machineId: saved.id,
            date: new Date(now - 1 * 86400000).toISOString(),
            weight: m.defaultWeight,
            sets: m.defaultSets,
            reps: m.defaultReps,
            notes: 'שיא אישי חדש!'
        });
    }
}

// ==========================================
// 4. DATA REFRESHING & RENDERING
// ==========================================
async function refreshAllData() {
    state.splitDays = await gymDB.getAllSplitDays();
    state.machines = await gymDB.getAllMachines();

    renderDaysPills();
    renderMachinesGrid();
    populateTrendMachineDropdown();
    renderSplitDaysManageLists();
}

// Render horizontal day filter pills
function renderDaysPills() {
    const container = document.getElementById('days-pills-container');
    if (!container) return;

    let html = `
        <button class="day-pill ${state.activeDayId === 'all' ? 'active' : ''}" data-day-id="all">
            <i class="fa-solid fa-list-check"></i>
            <span>הכל</span>
            <span class="badge">${state.machines.length}</span>
        </button>
    `;

    for (const day of state.splitDays) {
        const count = state.machines.filter(m => m.days && m.days.includes(day.id)).length;
        const isActive = state.activeDayId === day.id;
        const color = day.color || '#10b981';
        html += `
            <button class="day-pill ${isActive ? 'active' : ''}" data-day-id="${day.id}" style="${isActive ? `border-color: ${color}; box-shadow: 0 4px 14px ${color}35;` : ''}">
                <i class="fa-solid ${day.icon || 'fa-dumbbell'}" style="color: ${color};"></i>
                <span>${escapeHtml(day.name)}</span>
                <span class="badge" style="${isActive ? `background: ${color}; color: #000;` : ''}">${count}</span>
            </button>
        `;
    }

    // Quick Add Day button at end of scroll
    html += `
        <button class="day-pill" id="btn-quick-add-day-pill" style="border-style: dashed; border-color: rgba(255, 255, 255, 0.25); color: var(--accent-lime);" title="הוסף יום אימון חדש">
            <i class="fa-solid fa-plus"></i>
            <span>יום חדש</span>
        </button>
    `;

    container.innerHTML = html;

    // Attach pill click events
    container.querySelectorAll('.day-pill[data-day-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            state.activeDayId = btn.dataset.dayId;
            updateActiveDayLabel();
            renderDaysPills();
            renderMachinesGrid();
        });
    });

    document.getElementById('btn-quick-add-day-pill')?.addEventListener('click', () => {
        openEditSplitDayModal();
    });

    updateActiveDayLabel();
}

function updateActiveDayLabel() {
    const label = document.getElementById('active-day-label');
    if (!label) return;

    if (state.activeDayId === 'all') {
        label.textContent = 'כל המכשירים';
    } else {
        const current = state.splitDays.find(d => d.id === state.activeDayId);
        label.textContent = current ? current.name : 'סינון';
    }
}

// Render Grid of Machine Cubes (Compact cubes - at least 6 visible above the fold)
function renderMachinesGrid() {
    const grid = document.getElementById('machines-grid');
    const emptyState = document.getElementById('machines-empty-state');
    if (!grid) return;

    // Filter by active day & search query
    let filtered = state.machines;

    if (state.activeDayId !== 'all') {
        filtered = filtered.filter(m => m.days && m.days.includes(state.activeDayId));
    }

    if (state.searchQuery.trim()) {
        const q = state.searchQuery.toLowerCase();
        filtered = filtered.filter(m =>
            m.name.toLowerCase().includes(q) ||
            (m.notes && m.notes.toLowerCase().includes(q)) ||
            (m.seatSetting && m.seatSetting.toLowerCase().includes(q))
        );
    }

    if (filtered.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    grid.innerHTML = filtered.map(machine => {
        // Find split day color and primary day info
        let primaryColor = '#10b981';
        let dayName = '';
        if (machine.days && machine.days.length > 0) {
            const dayObj = state.splitDays.find(d => d.id === machine.days[0]);
            if (dayObj) {
                if (dayObj.color) primaryColor = dayObj.color;
                dayName = dayObj.name;
            }
        }

        const mediaContent = machine.photoBase64
            ? `<img src="${machine.photoBase64}" alt="${escapeHtml(machine.name)}" class="cube-thumb">`
            : `<div class="cube-placeholder"><i class="fa-solid fa-dumbbell" style="color: ${primaryColor}88;"></i></div>`;

        let lastBadge = '';
        if (machine.lastWeight) {
            lastBadge = `<div class="cube-last-badge"><i class="fa-solid fa-check"></i> ${machine.lastWeight}ק"ג</div>`;
        }

        return `
            <div class="machine-cube" onclick="openMachineDetailsModal('${machine.id}')" data-machine-id="${machine.id}">
                <div class="cube-media">
                    <div class="cube-day-strip" style="background: ${primaryColor};"></div>
                    ${mediaContent}
                    ${lastBadge}
                    <div class="cube-tap-hint" title="לחץ לפתיחת פרטים"><i class="fa-solid fa-expand"></i></div>
                </div>

                <div class="cube-body">
                    <div class="cube-title" title="${escapeHtml(machine.name)}">${escapeHtml(machine.name)}</div>
                    <div class="cube-specs-row">
                        <span class="cube-weight-badge">${machine.defaultWeight || 0} ק"ג</span>
                        <span class="cube-reps-badge">${machine.defaultSets || 3}×${machine.defaultReps || 10}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Open Machine Details Modal (The rich popup for the machine)
window.openMachineDetailsModal = (machineId) => {
    const machine = state.machines.find(m => m.id === machineId);
    if (!machine) return;

    const modal = document.getElementById('modal-machine-details');
    if (!modal) return;

    // Title
    document.getElementById('details-machine-name').innerHTML = `
        <i class="fa-solid fa-dumbbell" style="color: var(--accent-lime);"></i>
        <span>${escapeHtml(machine.name)}</span>
    `;

    // Photo Box
    const photoBox = document.getElementById('details-photo-box');
    const imgEl = document.getElementById('details-img');
    const zoomBtn = document.getElementById('details-zoom-btn');
    if (machine.photoBase64) {
        photoBox.style.display = 'block';
        imgEl.src = machine.photoBase64;
        zoomBtn.style.display = 'flex';
        zoomBtn.onclick = () => Popup.imagePreview(machine.photoBase64, machine.name);
    } else {
        photoBox.style.display = 'none';
    }

    // Split Days Chips
    const daysChipsContainer = document.getElementById('details-days-chips');
    daysChipsContainer.innerHTML = (machine.days || []).map(dayId => {
        const dayObj = state.splitDays.find(d => d.id === dayId);
        if (!dayObj) return '';
        const color = dayObj.color || '#06b6d4';
        return `<span class="day-chip" style="border-color: ${color}; color: #fff;">
            <i class="fa-solid ${dayObj.icon || 'fa-dumbbell'}" style="color: ${color};"></i> ${escapeHtml(dayObj.name)}
        </span>`;
    }).join('');

    // Planned Targets
    document.getElementById('details-weight-val').innerHTML = `${machine.defaultWeight || 0} <span class="spec-unit">ק"ג</span>`;
    document.getElementById('details-reps-val').textContent = `${machine.defaultSets || 3} סטים × ${machine.defaultReps || 10} חזרות`;

    // Last Log Info
    const lastLogBox = document.getElementById('details-last-log-box');
    const lastLogText = document.getElementById('details-last-log-text');
    const lastLogDate = document.getElementById('details-last-log-date');
    if (machine.lastWeight) {
        lastLogBox.style.display = 'flex';
        lastLogText.textContent = `${machine.lastWeight} ק"ג × ${machine.lastReps || machine.defaultReps} חזרות (${machine.lastSets || machine.defaultSets || 3} סטים)`;
        lastLogDate.textContent = machine.lastDate ? new Date(machine.lastDate).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
    } else {
        lastLogBox.style.display = 'none';
    }

    // Seat Setting
    const seatBox = document.getElementById('details-seat-box');
    const seatVal = document.getElementById('details-seat-val');
    if (machine.seatSetting && machine.seatSetting.trim()) {
        seatBox.style.display = 'flex';
        seatVal.textContent = machine.seatSetting.trim();
    } else {
        seatBox.style.display = 'none';
    }

    // Notes
    const notesBox = document.getElementById('details-notes-box');
    const notesVal = document.getElementById('details-notes-val');
    if (machine.notes && machine.notes.trim()) {
        notesBox.style.display = 'flex';
        notesVal.textContent = machine.notes.trim();
    } else {
        notesBox.style.display = 'none';
    }

    // Action Buttons inside Modal
    document.getElementById('btn-details-log-workout').onclick = () => {
        closeModal('modal-machine-details');
        openLogWorkoutModal(machine.id);
    };

    document.getElementById('btn-details-trend').onclick = () => {
        closeModal('modal-machine-details');
        openTrendForMachine(machine.id);
    };

    document.getElementById('btn-details-edit').onclick = () => {
        closeModal('modal-machine-details');
        openEditMachineModal(machine.id);
    };

    document.getElementById('btn-details-delete').onclick = () => {
        closeModal('modal-machine-details');
        confirmDeleteMachine(machine.id);
    };

    modal.classList.add('active');
};

// ==========================================
// 5. MACHINE MODAL (Add / Edit)
// ==========================================
function openAddMachineModal() {
    const modal = document.getElementById('modal-machine');
    document.getElementById('modal-machine-title').innerHTML = '<i class="fa-solid fa-plus-circle"></i> <span>הוספת מכשיר חדש</span>';
    document.getElementById('form-machine').reset();
    document.getElementById('machine-id').value = '';

    // Reset photo
    document.getElementById('photo-preview-wrap').style.display = 'none';
    document.getElementById('photo-prompt').style.display = 'flex';
    document.getElementById('photo-preview-img').src = '';
    document.getElementById('machine-photo-base64').value = '';

    // Defaults
    document.getElementById('machine-weight').value = '40';
    document.getElementById('machine-reps').value = '10';
    document.getElementById('machine-sets').value = '3';

    // Days selector tags
    renderFormDaysSelector(state.activeDayId !== 'all' ? [state.activeDayId] : []);

    modal.classList.add('active');
}

window.openEditMachineModal = (machineId) => {
    const machine = state.machines.find(m => m.id === machineId);
    if (!machine) return;

    const modal = document.getElementById('modal-machine');
    document.getElementById('modal-machine-title').innerHTML = '<i class="fa-solid fa-pencil"></i> <span>עריכת מכשיר</span>';

    document.getElementById('machine-id').value = machine.id;
    document.getElementById('machine-name').value = machine.name || '';
    document.getElementById('machine-weight').value = machine.defaultWeight || 40;
    document.getElementById('machine-reps').value = machine.defaultReps || 10;
    document.getElementById('machine-sets').value = machine.defaultSets || 3;
    document.getElementById('machine-seat').value = machine.seatSetting || '';
    document.getElementById('machine-notes').value = machine.notes || '';

    // Photo preview
    if (machine.photoBase64) {
        document.getElementById('photo-preview-wrap').style.display = 'block';
        document.getElementById('photo-prompt').style.display = 'none';
        document.getElementById('photo-preview-img').src = machine.photoBase64;
        document.getElementById('machine-photo-base64').value = machine.photoBase64;
    } else {
        document.getElementById('photo-preview-wrap').style.display = 'none';
        document.getElementById('photo-prompt').style.display = 'flex';
        document.getElementById('photo-preview-img').src = '';
        document.getElementById('machine-photo-base64').value = '';
    }

    renderFormDaysSelector(machine.days || []);
    modal.classList.add('active');
};

function renderFormDaysSelector(selectedDayIds = []) {
    const container = document.getElementById('form-days-selector');
    if (!container) return;

    if (state.splitDays.length === 0) {
        container.innerHTML = `
            <div style="font-size: 0.88rem; color: var(--text-muted); display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 6px 0;">
                <span>אין עדיין ימי אימון מוגדרים.</span>
                <button type="button" class="btn btn-secondary btn-sm" onclick="openEditSplitDayModal()">
                    <i class="fa-solid fa-plus"></i> הוסף יום אימון
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = state.splitDays.map(day => {
        const isSelected = selectedDayIds.includes(day.id);
        const color = day.color || '#10b981';
        return `
            <div class="day-select-tag ${isSelected ? 'selected' : ''}" data-day-id="${day.id}" style="${isSelected ? `border-color: ${color}; background: ${color}22; color: #fff;` : ''}">
                <i class="fa-solid ${isSelected ? 'fa-check' : (day.icon || 'fa-plus')}" style="color: ${color}"></i>
                <span>${escapeHtml(day.name)}</span>
            </div>
        `;
    }).join('');

    container.querySelectorAll('.day-select-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('selected');
            const dayId = tag.dataset.dayId;
            const dayObj = state.splitDays.find(d => d.id === dayId);
            const color = dayObj?.color || '#10b981';
            const icon = tag.querySelector('i');
            if (tag.classList.contains('selected')) {
                icon.className = 'fa-solid fa-check';
                tag.style.borderColor = color;
                tag.style.background = `${color}22`;
                tag.style.color = '#fff';
            } else {
                icon.className = `fa-solid ${dayObj?.icon || 'fa-plus'}`;
                tag.style.borderColor = '';
                tag.style.background = '';
                tag.style.color = '';
            }
        });
    });
}

function getSelectedDaysFromForm() {
    const selected = [];
    document.querySelectorAll('#form-days-selector .day-select-tag.selected').forEach(tag => {
        selected.push(tag.dataset.dayId);
    });
    return selected;
}

async function handleSaveMachineForm(e) {
    e.preventDefault();

    const name = document.getElementById('machine-name').value.trim();
    if (!name) {
        Popup.toast('אנא הזן שם למכשיר', 'warning');
        return;
    }

    const id = document.getElementById('machine-id').value;
    const selectedDays = getSelectedDaysFromForm();

    if (selectedDays.length === 0) {
        const ok = await Popup.confirm(
            'לא נבחרו ימי אימון',
            'לא בחרת יום אימון עבור מכשיר זה. המכשיר יופיע רק בלשונית "הכל". האם להמשיך?',
            { confirmText: 'כן, שמור בכל זאת', cancelText: 'חזור ובחר יום' }
        );
        if (!ok) return;
    }

    const machineData = {
        name,
        days: selectedDays,
        defaultWeight: parseFloat(document.getElementById('machine-weight').value) || 0,
        defaultReps: parseInt(document.getElementById('machine-reps').value) || 10,
        defaultSets: parseInt(document.getElementById('machine-sets').value) || 3,
        seatSetting: document.getElementById('machine-seat').value.trim(),
        notes: document.getElementById('machine-notes').value.trim(),
        photoBase64: document.getElementById('machine-photo-base64').value || null
    };

    if (id) {
        machineData.id = id;
    }

    try {
        await gymDB.saveMachine(machineData);
        closeModal('modal-machine');
        await refreshAllData();
        Popup.toast(`המכשיר "${name}" נשמר בהצלחה!`, 'success');
    } catch (err) {
        console.error('Error saving machine:', err);
        Popup.alert('שגיאה בשמירה', 'לא ניתן לשמור את המכשיר: ' + err.message, 'danger');
    }
}

window.confirmDeleteMachine = async (machineId) => {
    const machine = state.machines.find(m => m.id === machineId);
    if (!machine) return;

    const confirmed = await Popup.confirm(
        'מחיקת מכשיר',
        `האם אתה בטוח שברצונך למחוק את "${machine.name}"? כל היסטוריית האימונים והגרפים של מכשיר זה יימחקו לצמיתות.`,
        { danger: true, confirmText: 'כן, מחק מכשיר', cancelText: 'ביטול' }
    );

    if (confirmed) {
        try {
            await gymDB.deleteMachine(machineId);
            await refreshAllData();
            Popup.toast(`המכשיר "${machine.name}" נמחק`, 'info');
        } catch (err) {
            console.error('Error deleting machine:', err);
            Popup.alert('שגיאה במחיקה', err.message, 'danger');
        }
    }
};

// ==========================================
// 6. LOG WORKOUT MODAL
// ==========================================
window.openLogWorkoutModal = (machineId) => {
    const machine = state.machines.find(m => m.id === machineId);
    if (!machine) return;

    const modal = document.getElementById('modal-log-workout');
    document.getElementById('log-machine-id').value = machine.id;
    document.getElementById('log-modal-machine-name').textContent = `רישום אימון: ${machine.name}`;

    // Default to today's date (local YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('log-date').value = today;

    // Use machine's default or last weight & reps
    document.getElementById('log-weight').value = machine.lastWeight || machine.defaultWeight || 40;
    document.getElementById('log-reps').value = machine.lastReps || machine.defaultReps || 10;
    document.getElementById('log-sets').value = machine.lastSets || machine.defaultSets || 3;
    document.getElementById('log-notes').value = '';
    document.getElementById('log-update-target').checked = true;

    modal.classList.add('active');
};

async function handleSaveLogForm(e) {
    e.preventDefault();

    const machineId = document.getElementById('log-machine-id').value;
    const machine = state.machines.find(m => m.id === machineId);
    if (!machine) return;

    const dateVal = document.getElementById('log-date').value;
    const weight = parseFloat(document.getElementById('log-weight').value) || 0;
    const reps = parseInt(document.getElementById('log-reps').value) || 10;
    const sets = parseInt(document.getElementById('log-sets').value) || 3;
    const notes = document.getElementById('log-notes').value.trim();
    const updateTarget = document.getElementById('log-update-target').checked;

    const logEntry = {
        machineId,
        date: new Date(dateVal).toISOString(),
        weight,
        reps,
        sets,
        notes
    };

    try {
        await gymDB.addLog(logEntry);

        if (updateTarget) {
            machine.defaultWeight = weight;
            machine.defaultReps = reps;
            machine.defaultSets = sets;
            await gymDB.saveMachine(machine);
        }

        closeModal('modal-log-workout');
        await refreshAllData();

        Popup.toast(`כל הכבוד! נרשמו ${weight} ק"ג × ${reps} חזרות ל-${machine.name}`, 'success');

        // If trend tab is active or selected for this machine, refresh it
        if (state.currentMachineIdForTrend === machineId) {
            renderTrendView(machineId);
        }
    } catch (err) {
        console.error('Error logging workout:', err);
        Popup.alert('שגיאה ברישום אימון', err.message, 'danger');
    }
}

// ==========================================
// 7. TRENDS & PROGRESS ANALYTICS (Chart.js)
// ==========================================
function populateTrendMachineDropdown() {
    const select = document.getElementById('trend-machine-select');
    if (!select) return;

    if (state.machines.length === 0) {
        select.innerHTML = '<option value="">אין עדיין מכשירים במערכת</option>';
        return;
    }

    select.innerHTML = state.machines.map(m => `
        <option value="${m.id}" ${m.id === state.currentMachineIdForTrend ? 'selected' : ''}>${escapeHtml(m.name)}</option>
    `).join('');

    if (!state.currentMachineIdForTrend && state.machines.length > 0) {
        state.currentMachineIdForTrend = state.machines[0].id;
    }

    select.onchange = () => {
        state.currentMachineIdForTrend = select.value;
        renderTrendView(state.currentMachineIdForTrend);
    };
}

window.openTrendForMachine = (machineId) => {
    state.currentMachineIdForTrend = machineId;
    switchTab('view-trends');
    const select = document.getElementById('trend-machine-select');
    if (select) select.value = machineId;
    renderTrendView(machineId);
};

async function renderTrendView(machineId) {
    if (!machineId) {
        if (state.machines.length > 0) {
            machineId = state.machines[0].id;
            state.currentMachineIdForTrend = machineId;
        } else {
            return;
        }
    }

    const machine = state.machines.find(m => m.id === machineId);
    if (!machine) return;

    document.getElementById('chart-machine-title').textContent = `מגמת משקלי עבודה: ${machine.name}`;

    const logs = await gymDB.getLogsForMachine(machineId);
    document.getElementById('chart-total-logs-badge').textContent = `${logs.length} אימונים רשומים`;

    // Calculate Stats
    const startWeightEl = document.getElementById('stat-start-weight');
    const prWeightEl = document.getElementById('stat-pr-weight');
    const progressEl = document.getElementById('stat-total-progress');

    if (logs.length === 0) {
        startWeightEl.textContent = `${machine.defaultWeight || 0} ק"ג`;
        prWeightEl.textContent = '-';
        progressEl.textContent = 'טרם נרשמו ביצועים';
    } else {
        const firstW = logs[0].weight;
        const weights = logs.map(l => l.weight);
        const maxW = Math.max(...weights);
        const currentW = logs[logs.length - 1].weight;
        const diff = (currentW - firstW);
        const diffSign = diff > 0 ? `+${diff}` : `${diff}`;

        startWeightEl.textContent = `${firstW} ק"ג`;
        prWeightEl.textContent = `${maxW} ק"ג`;
        progressEl.textContent = `${diffSign} ק"ג (${diff >= 0 ? '+' : ''}${firstW > 0 ? ((diff / firstW) * 100).toFixed(0) : 0}%)`;
    }

    // Render Chart.js
    renderProgressionChart(machine.name, logs);

    // Render Recent logs list
    renderTrendLogsList(logs);
}

function renderProgressionChart(machineName, logs) {
    const canvas = document.getElementById('progressionChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (state.chartInstance) {
        state.chartInstance.destroy();
    }

    if (logs.length === 0) {
        // Draw empty indicator on chart
        state.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['אין נתונים עדיין'],
                datasets: [{
                    label: 'משקל (ק"ג)',
                    data: [0],
                    borderColor: '#64748b',
                    borderDash: [5, 5],
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
        return;
    }

    const labels = logs.map(l => {
        const d = new Date(l.date);
        return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });
    });

    const dataPoints = logs.map(l => l.weight);

    // Gradient background for line chart
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    state.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'משקל עבודה (ק"ג)',
                data: dataPoints,
                borderColor: '#10b981',
                borderWidth: 3,
                backgroundColor: gradient,
                fill: true,
                tension: 0.35,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    rtl: true,
                    backgroundColor: '#182234',
                    titleColor: '#fff',
                    bodyColor: '#10b981',
                    borderColor: '#27354d',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex;
                            const log = logs[index];
                            return [
                                `משקל: ${context.parsed.y} ק"ג`,
                                `סטים וחזרות: ${log.sets} × ${log.reps}`,
                                log.notes ? `הערה: ${log.notes}` : ''
                            ].filter(Boolean);
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.06)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: { family: 'Rubik' }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.06)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: { family: 'Rubik' },
                        callback: (val) => `${val} ק"ג`
                    }
                }
            }
        }
    });
}

function renderTrendLogsList(logs) {
    const container = document.getElementById('trend-logs-list');
    if (!container) return;

    if (logs.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">אין עדיין אימונים שנרשמו למכשיר זה. לחץ על "רשום ביצוע" בכרטיס המכשיר.</p>';
        return;
    }

    // Sort descending for timeline list
    const sorted = [...logs].reverse();

    container.innerHTML = sorted.map(log => {
        const d = new Date(log.date);
        const formattedDate = d.toLocaleDateString('he-IL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="history-item">
                <div>
                    <div class="history-metrics">
                        <span class="history-weight">${log.weight} ק"ג</span>
                        <span class="history-reps">${log.sets} סטים × ${log.reps} חזרות</span>
                    </div>
                    <div class="history-date">${formattedDate} ${log.notes ? `• <em>${escapeHtml(log.notes)}</em>` : ''}</div>
                </div>
                <button class="history-del-btn" onclick="confirmDeleteLog('${log.id}')" title="מחק רישום זה">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
    }).join('');
}

window.confirmDeleteLog = async (logId) => {
    const ok = await Popup.confirm(
        'מחיקת רישום אימון',
        'האם ברצונך למחוק רשומת אימון זו מההיסטוריה?',
        { danger: true, confirmText: 'מחק', cancelText: 'ביטול' }
    );
    if (ok) {
        await gymDB.deleteLog(logId);
        Popup.toast('רשומת האימון נמחקה', 'info');
        renderTrendView(state.currentMachineIdForTrend);
        refreshAllData();
    }
};

// ==========================================
// 8. SPLIT DAYS SETTINGS & MANAGEMENT
// ==========================================
function renderSplitDaysManageLists() {
    const listSettings = document.getElementById('split-days-manage-list');
    const listModal = document.getElementById('split-days-full-manage-list');

    const html = state.splitDays.length === 0
        ? `<div class="empty-state" style="padding: 24px 10px; margin: 10px 0;">
             <p style="color: var(--text-secondary); margin-bottom: 12px;">אין עדיין ימי אימון מוגדרים.</p>
             <button class="btn btn-primary btn-sm" onclick="openEditSplitDayModal()">
                 <i class="fa-solid fa-plus"></i> צור יום אימון ראשון
             </button>
           </div>`
        : state.splitDays.map((day, index) => {
            const count = state.machines.filter(m => m.days && m.days.includes(day.id)).length;
            const color = day.color || '#10b981';
            const icon = day.icon || 'fa-dumbbell';
            const isFirst = index === 0;
            const isLast = index === state.splitDays.length - 1;

            return `
                <div class="split-day-card-item" style="--day-color: ${color};">
                    <div class="split-day-card-left">
                        <div class="reorder-btns">
                            <button type="button" class="btn-reorder" onclick="moveSplitDay('${day.id}', -1)" ${isFirst ? 'disabled' : ''} title="העבר למעלה">
                                <i class="fa-solid fa-chevron-up"></i>
                            </button>
                            <button type="button" class="btn-reorder" onclick="moveSplitDay('${day.id}', 1)" ${isLast ? 'disabled' : ''} title="העבר למטה">
                                <i class="fa-solid fa-chevron-down"></i>
                            </button>
                        </div>
                        <div class="split-day-icon-wrap" style="color: ${color}; border-color: ${color}40;">
                            <i class="fa-solid ${icon}"></i>
                        </div>
                        <div class="split-day-meta">
                            <span class="split-day-title">${escapeHtml(day.name)}</span>
                            ${day.schedule ? `<span class="split-day-schedule">${escapeHtml(day.schedule)}</span>` : ''}
                        </div>
                    </div>
                    <div class="split-day-actions">
                        <span class="split-day-badge-count">${count} מכשירים</span>
                        <button class="btn btn-secondary btn-icon-only btn-sm" onclick="openEditSplitDayModal('${day.id}')" title="ערוך יום אימון">
                            <i class="fa-solid fa-pencil"></i>
                        </button>
                        <button class="btn btn-secondary btn-icon-only btn-sm" onclick="confirmDeleteSplitDay('${day.id}')" title="מחק יום אימון" style="color: var(--accent-rose);">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

    if (listSettings) listSettings.innerHTML = html;
    if (listModal) listModal.innerHTML = html;
}

// Reorder day up or down
window.moveSplitDay = async (dayId, direction) => {
    const currentIndex = state.splitDays.findIndex(d => d.id === dayId);
    if (currentIndex === -1) return;

    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= state.splitDays.length) return;

    // Swap in array
    const temp = state.splitDays[currentIndex];
    state.splitDays[currentIndex] = state.splitDays[targetIndex];
    state.splitDays[targetIndex] = temp;

    // Update order keys
    for (let i = 0; i < state.splitDays.length; i++) {
        state.splitDays[i].order = i + 1;
        await gymDB.saveSplitDay(state.splitDays[i]);
    }

    await refreshAllData();
};

window.openManageSplitDaysModal = () => {
    renderSplitDaysManageLists();
    const modal = document.getElementById('modal-manage-split-days');
    if (modal) modal.classList.add('active');
};

// Open Add or Edit Day Modal
window.openEditSplitDayModal = (dayId = null) => {
    const modal = document.getElementById('modal-edit-split-day');
    const titleEl = document.getElementById('modal-edit-split-day-title');
    const idInput = document.getElementById('edit-day-id');
    const nameInput = document.getElementById('edit-day-name');
    const scheduleInput = document.getElementById('edit-day-schedule');
    const iconInput = document.getElementById('edit-day-icon');
    const colorInput = document.getElementById('edit-day-color');

    let currentDay = null;
    if (dayId) {
        currentDay = state.splitDays.find(d => d.id === dayId);
    }

    if (currentDay) {
        titleEl.innerHTML = '<i class="fa-solid fa-pencil"></i> <span>עריכת יום אימון</span>';
        idInput.value = currentDay.id;
        nameInput.value = currentDay.name || '';
        scheduleInput.value = currentDay.schedule || '';
        iconInput.value = currentDay.icon || 'fa-dumbbell';
        colorInput.value = currentDay.color || '#10b981';
    } else {
        titleEl.innerHTML = '<i class="fa-solid fa-plus-circle"></i> <span>הוספת יום אימון חדש</span>';
        idInput.value = '';
        nameInput.value = '';
        scheduleInput.value = '';
        iconInput.value = 'fa-dumbbell';
        colorInput.value = '#10b981';
    }

    renderIconPicker(iconInput.value);
    renderColorPicker(colorInput.value);

    modal.classList.add('active');
};

function renderIconPicker(selectedIcon) {
    const container = document.getElementById('split-day-icon-picker');
    if (!container) return;

    container.innerHTML = SPLIT_ICONS.map(item => `
        <button type="button" class="icon-choice-btn ${item.icon === selectedIcon ? 'selected' : ''}" data-icon="${item.icon}" title="${item.label}">
            <i class="fa-solid ${item.icon}"></i>
        </button>
    `).join('');

    container.querySelectorAll('.icon-choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.icon-choice-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            document.getElementById('edit-day-icon').value = btn.dataset.icon;
        });
    });
}

function renderColorPicker(selectedColor) {
    const container = document.getElementById('split-day-color-picker');
    if (!container) return;

    container.innerHTML = SPLIT_COLORS.map(color => `
        <button type="button" class="color-choice-btn ${color === selectedColor ? 'selected' : ''}" data-color="${color}" style="background-color: ${color};">
            ${color === selectedColor ? '<i class="fa-solid fa-check"></i>' : ''}
        </button>
    `).join('');

    container.querySelectorAll('.color-choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.color-choice-btn').forEach(b => {
                b.classList.remove('selected');
                b.innerHTML = '';
            });
            btn.classList.add('selected');
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            document.getElementById('edit-day-color').value = btn.dataset.color;
        });
    });
}

async function handleSaveSplitDayForm(e) {
    e.preventDefault();
    const id = document.getElementById('edit-day-id').value;
    const name = document.getElementById('edit-day-name').value.trim();
    const schedule = document.getElementById('edit-day-schedule').value.trim();
    const icon = document.getElementById('edit-day-icon').value || 'fa-dumbbell';
    const color = document.getElementById('edit-day-color').value || '#10b981';

    if (!name) {
        Popup.toast('אנא הזן שם ליום האימון', 'warning');
        return;
    }

    if (id) {
        // Edit existing
        const existing = state.splitDays.find(d => d.id === id);
        if (existing) {
            existing.name = name;
            existing.schedule = schedule;
            existing.icon = icon;
            existing.color = color;
            await gymDB.saveSplitDay(existing);
        }
    } else {
        // Create new
        const newDay = {
            id: 'day_' + Date.now(),
            name,
            schedule,
            icon,
            color,
            order: state.splitDays.length + 1
        };
        await gymDB.saveSplitDay(newDay);
    }

    closeModal('modal-edit-split-day');
    await refreshAllData();
    Popup.toast(`יום אימון "${name}" נשמר בהצלחה!`, 'success');
}

window.confirmDeleteSplitDay = async (dayId) => {
    const day = state.splitDays.find(d => d.id === dayId);
    if (!day) return;

    const affected = state.machines.filter(m => m.days && m.days.includes(dayId));
    let warnMsg = `האם למחוק את יום האימון "${day.name}"?`;
    if (affected.length > 0) {
        warnMsg += `\nשים לב: ישנם ${affected.length} מכשירים המשוייכים ליום זה. הם יישארו במערכת ללא שיוך ליום זה.`;
    }

    const ok = await Popup.confirm('מחיקת יום אימון', warnMsg, { danger: true, confirmText: 'מחק יום', cancelText: 'ביטול' });
    if (ok) {
        await gymDB.deleteSplitDay(dayId);
        // Also remove from machines
        for (const m of affected) {
            m.days = m.days.filter(d => d !== dayId);
            await gymDB.saveMachine(m);
        }
        if (state.activeDayId === dayId) {
            state.activeDayId = 'all';
        }
        await refreshAllData();
        Popup.toast(`יום האימון "${day.name}" נמחק`, 'info');
    }
};

// Open Templates Modal
window.openSplitTemplatesModal = () => {
    renderTemplatesCards();
    const modal = document.getElementById('modal-split-templates');
    if (modal) modal.classList.add('active');
};

function renderTemplatesCards() {
    const container = document.getElementById('templates-cards-container');
    if (!container) return;

    container.innerHTML = PRESET_TEMPLATES.map(tpl => `
        <div class="template-card" onclick="applyPresetTemplate('${tpl.id}')">
            <div class="template-card-header">
                <span class="template-title">${tpl.title}</span>
                <span class="btn btn-cyan btn-sm"><i class="fa-solid fa-plus"></i> החל תבנית</span>
            </div>
            <p class="template-desc">${tpl.description}</p>
            <div class="template-days-pills">
                ${tpl.days.map(d => `
                    <span class="template-day-tag" style="border-color: ${d.color}60;">
                        <i class="fa-solid ${d.icon}" style="color: ${d.color};"></i>
                        <span>${d.name}</span>
                    </span>
                `).join('')}
            </div>
        </div>
    `).join('');
}

window.applyPresetTemplate = async (templateId) => {
    const tpl = PRESET_TEMPLATES.find(t => t.id === templateId);
    if (!tpl) return;

    let replaceExisting = false;
    if (state.splitDays.length > 0) {
        const choice = await Popup.confirm(
            `החלת תבנית: ${tpl.title}`,
            `האם ברצונך להחליף את כל ${state.splitDays.length} הימים הקיימים בימי התבנית, או להוסיף את ימי התבנית לימים הקיימים?`,
            { confirmText: 'החלף הכל בימי התבנית', cancelText: 'הוסף לימים הקיימים' }
        );
        replaceExisting = choice;
    }

    if (replaceExisting) {
        for (const day of state.splitDays) {
            await gymDB.deleteSplitDay(day.id);
        }
    }

    let startOrder = replaceExisting ? 1 : state.splitDays.length + 1;
    for (const d of tpl.days) {
        await gymDB.saveSplitDay({
            id: 'day_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            name: d.name,
            schedule: d.schedule || '',
            icon: d.icon || 'fa-dumbbell',
            color: d.color || '#10b981',
            order: startOrder++
        });
    }

    closeModal('modal-split-templates');
    await refreshAllData();
    Popup.toast(`תבנית "${tpl.title}" הוחלה בהצלחה!`, 'success');
};

// ==========================================
// 9. EXPORT & IMPORT (BACKUP & RESTORE)
// ==========================================
async function handleExportBackup() {
    try {
        const payload = await gymDB.exportData();
        const jsonStr = JSON.stringify(payload, null, 2);

        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        const dateStr = new Date().toISOString().split('T')[0];
        a.href = url;
        a.download = `gym-backup-${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        Popup.toast('קובץ הגיבוי הורד בהצלחה! כל המכשירים, התמונות וההיסטוריה שמורים.', 'success', 4000);
    } catch (err) {
        console.error('Export error:', err);
        Popup.alert('שגיאה בייצוא', 'אירעה שגיאה בעת הפקת קובץ הגיבוי: ' + err.message, 'danger');
    }
}

async function handleFileImport(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const parsed = JSON.parse(evt.target.result);

                if (!parsed || !parsed.data) {
                    throw new Error('מבנה קובץ ה-JSON אינו תקין עבור GymMaster.');
                }

                const confirmed = await Popup.confirm(
                    'שחזור מגיבוי',
                    `נמצאו בקובץ:\n• ${parsed.data.machines?.length || 0} מכשירים\n• ${parsed.data.logs?.length || 0} אימונים בהיסטוריה\n• ${parsed.data.splitDays?.length || 0} ימי אימון.\n\nהאם להחליף את כל הנתונים הקיימים בנתוני הגיבוי?`,
                    { confirmText: 'שחזר נתונים', cancelText: 'ביטול', danger: false }
                );

                if (confirmed) {
                    const result = await gymDB.importData(parsed, true);
                    await refreshAllData();
                    Popup.alert(
                        'השחזור הושלם בהצלחה!',
                        `שוחזרו בהצלחה ${result.machinesCount} מכשירים ו-${result.logsCount} רשומות אימון.`,
                        'success'
                    );
                }
            } catch (innerErr) {
                console.error('Import parse error:', innerErr);
                Popup.alert('קובץ שגוי', 'לא ניתן לקרוא את קובץ הגיבוי: ' + innerErr.message, 'danger');
            }
        };
        reader.readAsText(file);
    } catch (err) {
        console.error('Import file error:', err);
        Popup.alert('שגיאה', err.message, 'danger');
    } finally {
        e.target.value = ''; // Reset file input
    }
}

async function handleClearAllData() {
    const confirmed = await Popup.confirm(
        'איפוס ומחיקת כל הנתונים',
        'אזהרה: פעולה זו תמחק את כל המכשירים, התמונות והיסטוריית האימונים לצמיתות! מומלץ לוודא שביצעת ייצוא גיבוי קודם. האם להמשיך?',
        { danger: true, confirmText: 'כן, מחק הכל', cancelText: 'ביטול' }
    );

    if (confirmed) {
        await gymDB.clearAllData();
        await refreshAllData();
        Popup.toast('כל הנתונים אופסו בהצלחה', 'info');
    }
}

// ==========================================
// 10. NAVIGATION & EVENT LISTENERS
// ==========================================
function setupNavigation() {
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.dataset.target;
            switchTab(targetId);
        });
    });
}

function switchTab(targetTabId) {
    state.activeTab = targetTabId;

    document.querySelectorAll('.tab-view').forEach(view => {
        view.classList.remove('active');
    });
    const targetView = document.getElementById(targetTabId);
    if (targetView) targetView.classList.add('active');

    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        if (item.dataset.target === targetTabId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (targetTabId === 'view-trends') {
        renderTrendView(state.currentMachineIdForTrend);
    }
}

function setupStepperControls() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-step-target]');
        if (!btn) return;

        const targetId = btn.dataset.stepTarget;
        const step = parseFloat(btn.dataset.step) || 1;
        const input = document.getElementById(targetId);
        if (!input) return;

        let currentVal = parseFloat(input.value) || 0;
        let newVal = currentVal + step;

        const min = input.getAttribute('min') !== null ? parseFloat(input.getAttribute('min')) : 0;
        if (newVal < min) newVal = min;

        // Round to 1 decimal place if step is decimal
        if (step % 1 !== 0) {
            newVal = Math.round(newVal * 10) / 10;
        }

        input.value = newVal;
    });
}

function setupLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const closeBtn = document.getElementById('lightbox-close-btn');

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

function setupEventListeners() {
    // Add machine buttons
    document.getElementById('btn-header-add-machine')?.addEventListener('click', openAddMachineModal);
    document.getElementById('fab-add-machine')?.addEventListener('click', openAddMachineModal);
    document.getElementById('btn-empty-add-machine')?.addEventListener('click', openAddMachineModal);

    // Forms
    document.getElementById('form-machine')?.addEventListener('submit', handleSaveMachineForm);
    document.getElementById('form-log-workout')?.addEventListener('submit', handleSaveLogForm);
    document.getElementById('form-edit-split-day')?.addEventListener('submit', handleSaveSplitDayForm);

    // Search bar
    const searchInput = document.getElementById('machine-search-input');
    searchInput?.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderMachinesGrid();
    });

    // Close modal triggers
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.dataset.closeModal;
            closeModal(modalId);
        });
    });

    // Camera and Photo actions
    const cameraInput = document.getElementById('camera-file-input');
    const galleryInput = document.getElementById('gallery-file-input');

    document.getElementById('btn-trigger-camera')?.addEventListener('click', (e) => {
        e.stopPropagation();
        cameraInput?.click();
    });

    document.getElementById('btn-trigger-gallery')?.addEventListener('click', (e) => {
        e.stopPropagation();
        galleryInput?.click();
    });

    const onFileSelected = async (file) => {
        if (!file) return;
        try {
            Popup.toast('מעבד ודוחס תמונה...', 'info', 1500);
            const compressedBase64 = await compressImage(file, 900, 0.82);

            document.getElementById('photo-preview-wrap').style.display = 'block';
            document.getElementById('photo-prompt').style.display = 'none';
            document.getElementById('photo-preview-img').src = compressedBase64;
            document.getElementById('machine-photo-base64').value = compressedBase64;

            Popup.toast('התמונה נוספה בהצלחה!', 'success');
        } catch (err) {
            console.error('Image compression error:', err);
            Popup.alert('שגיאה בתמונה', 'לא ניתן לטעון את התמונה: ' + err.message, 'danger');
        }
    };

    cameraInput?.addEventListener('change', (e) => onFileSelected(e.target.files[0]));
    galleryInput?.addEventListener('change', (e) => onFileSelected(e.target.files[0]));

    document.getElementById('btn-remove-photo')?.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('photo-preview-wrap').style.display = 'none';
        document.getElementById('photo-prompt').style.display = 'flex';
        document.getElementById('photo-preview-img').src = '';
        document.getElementById('machine-photo-base64').value = '';
    });

    // Split Days actions
    document.getElementById('btn-open-days-manager')?.addEventListener('click', openManageSplitDaysModal);
    document.getElementById('btn-modal-add-day')?.addEventListener('click', () => openEditSplitDayModal());
    document.getElementById('btn-add-split-day')?.addEventListener('click', () => openEditSplitDayModal());
    document.getElementById('btn-modal-open-templates')?.addEventListener('click', openSplitTemplatesModal);
    document.getElementById('btn-open-templates-from-settings')?.addEventListener('click', openSplitTemplatesModal);

    // Settings & Backup actions
    document.getElementById('btn-export-backup')?.addEventListener('click', handleExportBackup);
    document.getElementById('btn-trigger-import')?.addEventListener('click', () => {
        document.getElementById('import-file-input')?.click();
    });
    document.getElementById('import-file-input')?.addEventListener('change', handleFileImport);
    document.getElementById('btn-clear-all-data')?.addEventListener('click', handleClearAllData);
    document.getElementById('btn-load-demo-data')?.addEventListener('click', async () => {
        const ok = await Popup.confirm(
            'טעינת נתוני דוגמה',
            'האם ברצונך לטעון נתוני דוגמה של מכשירים ואימונים?',
            { confirmText: 'טען נתוני דוגמה', cancelText: 'ביטול' }
        );
        if (ok) {
            await seedDemoData();
            await refreshAllData();
            Popup.toast('נתוני דוגמה נטענו בהצלחה', 'success');
        }
    });
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

// Security helper
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
