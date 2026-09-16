/**
 * GymMaster - Main Application Logic
 * Supports Gym Machines management, split days, photo capture & optimization,
 * workout logging, trend visualization with Chart.js, multi-language internationalization (he, en, ar, ru),
 * and local IndexedDB backup/restore.
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
    { icon: 'fa-dumbbell' },
    { icon: 'fa-arrows-up-down' },
    { icon: 'fa-person-running' },
    { icon: 'fa-hand-back-fist' },
    { icon: 'fa-fire' },
    { icon: 'fa-heart-pulse' },
    { icon: 'fa-stopwatch' },
    { icon: 'fa-bolt' },
    { icon: 'fa-shield-halved' },
    { icon: 'fa-award' },
    { icon: 'fa-bullseye' },
    { icon: 'fa-weight-hanging' }
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
        if (type === 'success') iconClass = 'fa-circle-check';
        if (type === 'warning') iconClass = 'fa-triangle-exclamation';
        if (type === 'danger') iconClass = 'fa-circle-xmark';

        toastEl.innerHTML = `
            <div class="toast-icon"><i class="fa-solid ${iconClass}"></i></div>
            <div class="toast-msg">${escapeHtml(message)}</div>
        `;

        container.appendChild(toastEl);

        setTimeout(() => {
            toastEl.style.animation = 'fadeOut 0.25s forwards';
            setTimeout(() => toastEl.remove(), 260);
        }, duration);
    },

    alert(title, message, type = 'info') {
        return new Promise((resolve) => {
            const overlay = document.getElementById('custom-popup');
            const iconEl = document.getElementById('popup-icon');
            const titleEl = document.getElementById('popup-title');
            const msgEl = document.getElementById('popup-message');
            const actionsEl = document.getElementById('popup-actions');

            iconEl.className = `popup-icon-wrap ${type}`;
            let iconClass = 'fa-circle-info';
            if (type === 'success') iconClass = 'fa-circle-check';
            if (type === 'danger') iconClass = 'fa-triangle-exclamation';
            if (type === 'warning') iconClass = 'fa-triangle-exclamation';

            iconEl.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
            titleEl.textContent = title;
            msgEl.textContent = message;

            const understandText = typeof I18N !== 'undefined' ? I18N.t('popup_understand') : 'הבנתי, תודה';
            actionsEl.innerHTML = `
                <button class="btn btn-primary" id="popup-ok-btn">${understandText}</button>
            `;

            overlay.classList.add('show');

            const okBtn = document.getElementById('popup-ok-btn');
            const close = () => {
                overlay.classList.remove('show');
                resolve(true);
            };

            okBtn.onclick = close;
        });
    },

    confirm(title, message, options = {}) {
        return new Promise((resolve) => {
            const overlay = document.getElementById('custom-popup');
            const iconEl = document.getElementById('popup-icon');
            const titleEl = document.getElementById('popup-title');
            const msgEl = document.getElementById('popup-message');
            const actionsEl = document.getElementById('popup-actions');

            const danger = options.danger || false;
            const confirmText = options.confirmText || (typeof I18N !== 'undefined' ? I18N.t('btn_delete_confirm') : 'אישור');
            const cancelText = options.cancelText || (typeof I18N !== 'undefined' ? I18N.t('btn_cancel') : 'ביטול');

            iconEl.className = `popup-icon-wrap ${danger ? 'danger' : 'warning'}`;
            iconEl.innerHTML = `<i class="fa-solid ${danger ? 'fa-triangle-exclamation' : 'fa-circle-question'}"></i>`;
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
        caption.textContent = title || (typeof I18N !== 'undefined' ? I18N.t('details_modal_title') : 'תמונת מכשיר');
        modal.classList.add('show');
    }
};

// Safe fallback for window.alert
window.alert = (msg) => {
    Popup.alert('GymMaster', msg);
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
function createMachineIconSvg(color1 = '#10b981', color2 = '#06b6d4') {
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
        <circle cx="300" cy="180" r="105" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2" />
        <g fill="url(#accentGrad)" transform="translate(235, 115) scale(5.2)">
            <path d="M12 2a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4v4h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4v2a2 2 0 1 1-4 0v-2H8a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h4v-4H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4V4a2 2 0 0 1 2-2z"/>
        </g>
        <text x="300" y="325" fill="#94a3b8" font-size="22" font-family="Rubik, Cairo, sans-serif" text-anchor="middle" font-weight="600">Gym Equipment</text>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// ==========================================
// 3. APPLICATION INITIALIZATION & SEEDING
// ==========================================
async function initApp() {
    try {
        // 1. Initialize Internationalization (Hebrew, English, Arabic, Russian)
        I18N.init();

        // 2. Initialize IndexedDB
        await gymDB.init();

        // 3. Refresh and render all data
        await refreshAllData();

        // 4. Setup listeners and controls
        setupEventListeners();
        setupNavigation();
        setupStepperControls();
        setupLightbox();
        registerServiceWorker();

        Popup.toast(I18N.t('msg_app_loaded'), 'success');
    } catch (err) {
        console.error('Initialization error:', err);
        Popup.alert('Error', (typeof I18N !== 'undefined' ? I18N.t('msg_db_error') : 'Database Error: ') + ' ' + err.message, 'danger');
    }
}

// Language Switcher Handler
window.changeAppLanguage = async (langCode) => {
    if (I18N.currentLang === langCode) return;
    I18N.setLanguage(langCode);

    updateActiveDayLabel();
    renderDaysPills();
    renderMachinesGrid();
    populateTrendMachineDropdown();
    if (state.currentMachineIdForTrend) {
        await renderTrendView(state.currentMachineIdForTrend);
    }
    renderSplitDaysManageLists();

    Popup.toast(I18N.t('lang_switched'), 'success');
};

// Initial demo data for rich exploration experience
async function seedDemoData() {
    let days = await gymDB.getAllSplitDays();
    if (days.length === 0) {
        // Seed default days for current language
        const tpls = I18N.getTemplates();
        const primaryTpl = tpls[0];
        let order = 1;
        for (const d of primaryTpl.days) {
            await gymDB.saveSplitDay({
                id: 'day_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                name: d.name,
                schedule: d.schedule || '',
                icon: d.icon || 'fa-dumbbell',
                color: d.color || '#10b981',
                order: order++
            });
        }
        days = await gymDB.getAllSplitDays();
    }

    const demoSpecs = I18N.getDemoMachines();
    const colors = [
        ['#10b981', '#06b6d4'],
        ['#38bdf8', '#06b6d4'],
        ['#06b6d4', '#10b981'],
        ['#06b6d4', '#3b82f6'],
        ['#f59e0b', '#ef4444'],
        ['#f43f5e', '#ec4899']
    ];

    for (let i = 0; i < demoSpecs.length; i++) {
        const item = demoSpecs[i];
        const assignedDay = days[item.dayIdx % days.length];
        const colorPair = colors[i % colors.length];

        const saved = await gymDB.saveMachine({
            name: item.name,
            days: assignedDay ? [assignedDay.id] : [],
            defaultWeight: item.weight,
            defaultSets: item.sets,
            defaultReps: item.reps,
            seatSetting: item.seat,
            notes: item.notes,
            photoBase64: createMachineIconSvg(colorPair[0], colorPair[1]),
            createdAt: new Date(Date.now() - (30 - i * 3) * 86400000).toISOString()
        });

        // Add history logs to demo machines to showcase Trend right away
        const now = Date.now();
        const baseW = Math.max(5, item.weight - 10);
        const note1 = I18N.currentLang === 'en' ? 'First session' : (I18N.currentLang === 'ar' ? 'التمرين الأول' : (I18N.currentLang === 'ru' ? 'Первая тренировка' : 'אימון ראשון למכשיר'));
        const note2 = I18N.currentLang === 'en' ? 'Felt good, slight increase' : (I18N.currentLang === 'ar' ? 'أداء ممتاز، زيادة طفيفة' : (I18N.currentLang === 'ru' ? 'Хорошо пошло, небольшой вес +' : 'הרגיש טוב, עלייה קלה'));
        const note3 = I18N.currentLang === 'en' ? 'Steady progress' : (I18N.currentLang === 'ar' ? 'تقدم ثابت' : (I18N.currentLang === 'ru' ? 'Стабильный прогресс' : 'התקדמות יציבה'));
        const note4 = I18N.currentLang === 'en' ? 'New Personal Record!' : (I18N.currentLang === 'ar' ? 'رقم قياسي جديد!' : (I18N.currentLang === 'ru' ? 'Новый личный рекорд!' : 'שיא אישי חדש!'));

        await gymDB.addLog({
            machineId: saved.id,
            date: new Date(now - 21 * 86400000).toISOString(),
            weight: baseW,
            sets: item.sets,
            reps: item.reps,
            notes: note1
        });
        await gymDB.addLog({
            machineId: saved.id,
            date: new Date(now - 14 * 86400000).toISOString(),
            weight: baseW + 2.5,
            sets: item.sets,
            reps: item.reps,
            notes: note2
        });
        await gymDB.addLog({
            machineId: saved.id,
            date: new Date(now - 7 * 86400000).toISOString(),
            weight: baseW + 5,
            sets: item.sets,
            reps: item.reps,
            notes: note3
        });
        await gymDB.addLog({
            machineId: saved.id,
            date: new Date(now - 1 * 86400000).toISOString(),
            weight: item.weight,
            sets: item.sets,
            reps: item.reps,
            notes: note4
        });
    }
}

// ==========================================
// 4. DATA REFRESHING & RENDERING
// ==========================================
async function refreshAllData() {
    state.splitDays = await gymDB.getAllSplitDays();
    state.machines = await gymDB.getAllMachines();
    if (state.machines.some(m => m.order == null)) {
        await persistMachineListOrder(state.machines.map(m => m.id));
    }

    renderDaysPills();
    renderMachinesGrid();
    populateTrendMachineDropdown();
    renderSplitDaysManageLists();
}

// Render horizontal day filter pills
function renderDaysPills() {
    const container = document.getElementById('days-pills-container');
    if (!container) return;

    const allPillText = I18N.t('all_pill');
    const newDayText = I18N.t('new_day_pill');
    const newDayTitle = I18N.t('modal_add_day_title');

    let html = `
        <button class="day-pill ${state.activeDayId === 'all' ? 'active' : ''}" data-day-id="all">
            <i class="fa-solid fa-list-check"></i>
            <span>${allPillText}</span>
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
        <button class="day-pill" id="btn-quick-add-day-pill" style="border-style: dashed; border-color: rgba(255, 255, 255, 0.25); color: var(--accent-lime);" title="${newDayTitle}">
            <i class="fa-solid fa-plus"></i>
            <span>${newDayText}</span>
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
        label.textContent = I18N.t('all_machines_label');
    } else {
        const current = state.splitDays.find(d => d.id === state.activeDayId);
        label.textContent = current ? current.name : I18N.t('all_machines_label');
    }
}

// Render machine list rows (drag handle + tap to log + info)
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

    const unitKg = I18N.t('unit_kg');
    const detailsHint = I18N.t('btn_open_details');
    const dragHint = I18N.t('drag_to_reorder');

    grid.innerHTML = filtered.map(machine => {
        let primaryColor = '#10b981';
        if (machine.days && machine.days.length > 0) {
            const dayObj = state.splitDays.find(d => d.id === machine.days[0]);
            if (dayObj && dayObj.color) primaryColor = dayObj.color;
        }

        const thumb = machine.photoBase64
            ? `<img src="${machine.photoBase64}" alt="${escapeHtml(machine.name)}" class="row-thumb-img">`
            : `<div class="row-thumb-placeholder"><i class="fa-solid fa-dumbbell" style="color: ${primaryColor}99;"></i></div>`;

        const lastNote = machine.lastWeight
            ? `<span class="row-last">${machine.lastWeight} ${unitKg}</span>`
            : '';

        return `
            <div class="machine-row" data-machine-id="${machine.id}">
                <span class="row-day-strip" style="background: ${primaryColor};"></span>
                <button type="button" class="row-drag-handle" title="${dragHint}" aria-label="${dragHint}">
                    <i class="fa-solid fa-grip-lines"></i>
                </button>
                <div class="row-thumb">${thumb}</div>
                <button type="button" class="row-main" onclick="openLogWorkoutModal('${machine.id}')">
                    <span class="row-title" title="${escapeHtml(machine.name)}">${escapeHtml(machine.name)}</span>
                    <span class="row-meta">
                        <span class="row-weight">${machine.defaultWeight || 0} ${unitKg}</span>
                        <span class="row-reps">${machine.defaultSets || 3}×${machine.defaultReps || 10}</span>
                        ${lastNote}
                    </span>
                </button>
                <button type="button" class="row-details-btn" title="${detailsHint}" aria-label="${detailsHint}" onclick="openMachineDetailsModal('${machine.id}')">
                    <i class="fa-solid fa-circle-info"></i>
                </button>
            </div>
        `;
    }).join('');

    setupMachineRowDrag();
}

function compareMachineOrder(a, b) {
    const ao = a.order;
    const bo = b.order;
    if (ao != null && bo != null && ao !== bo) return ao - bo;
    if (ao != null && bo == null) return -1;
    if (ao == null && bo != null) return 1;
    return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
}

function setupMachineRowDrag() {
    const list = document.getElementById('machines-grid');
    if (!list) return;

    list.querySelectorAll('.row-drag-handle').forEach(handle => {
        handle.addEventListener('pointerdown', (e) => {
            if (e.button != null && e.button !== 0) return;
            const row = handle.closest('.machine-row');
            if (!row) return;
            e.preventDefault();
            e.stopPropagation();

            row.classList.add('dragging');
            row.style.pointerEvents = 'none';
            try { handle.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }

            const moveRowAt = (clientX, clientY) => {
                const rows = [...list.querySelectorAll('.machine-row')];
                const over = rows.find((candidate) => {
                    if (candidate === row) return false;
                    const box = candidate.getBoundingClientRect();
                    return clientY >= box.top && clientY <= box.bottom;
                });
                if (!over) return;
                const dragIdx = rows.indexOf(row);
                const overIdx = rows.indexOf(over);
                if (dragIdx < 0 || overIdx < 0) return;
                if (dragIdx < overIdx) over.after(row);
                else over.before(row);
            };

            const onMove = (ev) => {
                ev.preventDefault();
                moveRowAt(ev.clientX, ev.clientY);
            };

            let finished = false;
            const onUp = async () => {
                if (finished) return;
                finished = true;
                row.classList.remove('dragging');
                row.style.pointerEvents = '';
                document.removeEventListener('pointermove', onMove);
                document.removeEventListener('pointerup', onUp);
                document.removeEventListener('pointercancel', onUp);
                try { handle.releasePointerCapture(e.pointerId); } catch (_) { /* ignore */ }
                const ids = [...list.querySelectorAll('.machine-row')].map(r => r.dataset.machineId);
                await persistMachineListOrder(ids);
            };

            document.addEventListener('pointermove', onMove);
            document.addEventListener('pointerup', onUp);
            document.addEventListener('pointercancel', onUp);
        });
    });
}

async function persistMachineListOrder(visibleIds) {
    const uniqueVisible = [...new Set((visibleIds || []).filter(Boolean))];
    if (!uniqueVisible.length) return;

    const byId = new Map(state.machines.map(machine => [machine.id, machine]));
    const visibleSet = new Set(uniqueVisible);
    const allSorted = [...state.machines].sort(compareMachineOrder);

    const rebuilt = [];
    const used = new Set();
    let nextVisible = 0;
    for (const machine of allSorted) {
        let next = machine;
        if (visibleSet.has(machine.id)) {
            next = byId.get(uniqueVisible[nextVisible++]) || machine;
        }
        if (!next || used.has(next.id)) continue;
        used.add(next.id);
        rebuilt.push(next);
    }
    for (const machine of allSorted) {
        if (!used.has(machine.id)) {
            used.add(machine.id);
            rebuilt.push(machine);
        }
    }

    const updates = [];
    rebuilt.forEach((machine, index) => {
        const nextOrder = index + 1;
        if (machine.order !== nextOrder) {
            machine.order = nextOrder;
            updates.push(gymDB.saveMachine(machine));
        }
    });
    state.machines = rebuilt;
    if (updates.length) await Promise.all(updates);
}

// Open Machine Details Modal (The rich popup for the machine)
window.openMachineDetailsModal = (machineId) => {
    const machine = state.machines.find(m => m.id === machineId);
    if (!machine) return;

    const modal = document.getElementById('modal-machine-details');
    if (!modal) return;

    const unitKg = I18N.t('unit_kg');
    const setsWord = I18N.t('sets');
    const repsWord = I18N.t('reps');

    // Title
    document.getElementById('details-machine-name').innerHTML = `
        <i class="fa-solid fa-dumbbell" style="color: var(--accent-lime);"></i>
        <span>${escapeHtml(machine.name)}</span>
    `;

    // Photo Box (always visible so the + log button sits under it)
    const photoBox = document.getElementById('details-photo-box');
    const imgEl = document.getElementById('details-img');
    const placeholderEl = document.getElementById('details-img-placeholder');
    const zoomBtn = document.getElementById('details-zoom-btn');
    photoBox.style.display = 'block';
    if (machine.photoBase64) {
        imgEl.src = machine.photoBase64;
        imgEl.style.display = 'block';
        if (placeholderEl) placeholderEl.style.display = 'none';
        zoomBtn.style.display = 'flex';
        zoomBtn.onclick = () => Popup.imagePreview(machine.photoBase64, machine.name);
    } else {
        imgEl.removeAttribute('src');
        imgEl.style.display = 'none';
        if (placeholderEl) placeholderEl.style.display = 'flex';
        zoomBtn.style.display = 'none';
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
    document.getElementById('details-weight-val').innerHTML = `${machine.defaultWeight || 0} <span class="spec-unit">${unitKg}</span>`;
    document.getElementById('details-reps-val').textContent = `${machine.defaultSets || 3} ${setsWord} × ${machine.defaultReps || 10} ${repsWord}`;

    // Last Log Info
    const lastLogBox = document.getElementById('details-last-log-box');
    const lastLogText = document.getElementById('details-last-log-text');
    const lastLogDate = document.getElementById('details-last-log-date');
    if (machine.lastWeight) {
        lastLogBox.style.display = 'flex';
        lastLogText.textContent = `${machine.lastWeight} ${unitKg} × ${formatLogReps(machine)}`;
        lastLogDate.textContent = machine.lastDate ? I18N.formatDate(machine.lastDate) : '';
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
    const openLog = () => {
        closeModal('modal-machine-details');
        openLogWorkoutModal(machine.id);
    };
    document.getElementById('btn-details-add-log').onclick = openLog;
    document.getElementById('btn-details-log-workout').onclick = openLog;

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
    document.getElementById('modal-machine-title').innerHTML = `<i class="fa-solid fa-plus-circle"></i> <span>${I18N.t('modal_add_machine')}</span>`;
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
    document.getElementById('modal-machine-title').innerHTML = `<i class="fa-solid fa-pencil"></i> <span>${I18N.t('modal_edit_machine')}</span>`;

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
                <span>${I18N.t('no_split_days_yet')}</span>
                <button type="button" class="btn btn-secondary btn-sm" onclick="openEditSplitDayModal()">
                    <i class="fa-solid fa-plus"></i> ${I18N.t('create_first_day_btn')}
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
        Popup.toast(I18N.t('msg_enter_machine_name'), 'warning');
        return;
    }

    const id = document.getElementById('machine-id').value;
    const selectedDays = getSelectedDaysFromForm();

    if (selectedDays.length === 0) {
        const ok = await Popup.confirm(
            I18N.t('confirm_no_days_title'),
            I18N.t('confirm_no_days_msg'),
            { confirmText: I18N.t('btn_save_anyway'), cancelText: I18N.t('btn_back_to_select') }
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
        const existing = state.machines.find(m => m.id === id);
        machineData.id = id;
        if (existing) {
            machineData.order = existing.order;
            machineData.createdAt = existing.createdAt;
            machineData.lastWeight = existing.lastWeight;
            machineData.lastReps = existing.lastReps;
            machineData.lastSets = existing.lastSets;
            machineData.lastRepsPerSet = existing.lastRepsPerSet;
            machineData.lastDate = existing.lastDate;
        }
    }

    try {
        await gymDB.saveMachine(machineData);
        closeModal('modal-machine');
        await refreshAllData();
        Popup.toast(I18N.t('msg_machine_saved'), 'success');
    } catch (err) {
        console.error('Error saving machine:', err);
        Popup.alert('Error', I18N.t('msg_save_error') + ' ' + err.message, 'danger');
    }
}

window.confirmDeleteMachine = async (machineId) => {
    const machine = state.machines.find(m => m.id === machineId);
    if (!machine) return;

    const confirmed = await Popup.confirm(
        I18N.t('confirm_delete_machine_title'),
        I18N.t('confirm_delete_machine_msg', { name: machine.name }),
        { danger: true, confirmText: I18N.t('btn_delete_confirm'), cancelText: I18N.t('btn_cancel') }
    );

    if (confirmed) {
        try {
            await gymDB.deleteMachine(machineId);
            await refreshAllData();
            Popup.toast(I18N.t('msg_machine_deleted'), 'info');
        } catch (err) {
            console.error('Error deleting machine:', err);
            Popup.alert('Error', err.message, 'danger');
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
    document.getElementById('log-modal-machine-name').textContent = `${I18N.t('modal_log_workout_title')}: ${machine.name}`;

    // Default to today's date (local YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('log-date').value = today;

    document.getElementById('log-weight').value = machine.lastWeight || machine.defaultWeight || 50;
    const defaultRep = machine.lastReps || machine.defaultReps || 8;
    const lastSets = (machine.lastRepsPerSet && machine.lastRepsPerSet.length === 3)
        ? machine.lastRepsPerSet
        : [defaultRep, defaultRep, defaultRep];
    document.getElementById('log-reps-1').value = lastSets[0];
    document.getElementById('log-reps-2').value = lastSets[1];
    document.getElementById('log-reps-3').value = lastSets[2];
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
    const repsPerSet = [1, 2, 3].map(i => parseInt(document.getElementById(`log-reps-${i}`).value, 10) || 0);
    const sets = repsPerSet.length;
    const reps = repsPerSet[repsPerSet.length - 1];
    const notes = document.getElementById('log-notes').value.trim();
    const updateTarget = document.getElementById('log-update-target').checked;

    const logEntry = {
        machineId,
        date: new Date(dateVal).toISOString(),
        weight,
        reps,
        sets,
        repsPerSet,
        notes
    };

    try {
        await gymDB.addLog(logEntry);

        machine.lastWeight = weight;
        machine.lastReps = reps;
        machine.lastSets = sets;
        machine.lastRepsPerSet = repsPerSet;
        machine.lastDate = logEntry.date;

        if (updateTarget) {
            machine.defaultWeight = weight;
            machine.defaultReps = reps;
            machine.defaultSets = sets;
            await gymDB.saveMachine(machine);
        }

        closeModal('modal-log-workout');
        await refreshAllData();

        Popup.toast(I18N.t('msg_workout_logged', { weight, reps: formatLogReps(logEntry), name: machine.name }), 'success');

        // If trend tab is active or selected for this machine, refresh it
        if (state.currentMachineIdForTrend === machineId) {
            renderTrendView(machineId);
        }
    } catch (err) {
        console.error('Error logging workout:', err);
        Popup.alert('Error', err.message, 'danger');
    }
}

// ==========================================
// 7. TRENDS & PROGRESS ANALYTICS (Chart.js)
// ==========================================
function populateTrendMachineDropdown() {
    const select = document.getElementById('trend-machine-select');
    if (!select) return;

    if (state.machines.length === 0) {
        select.innerHTML = `<option value="">${I18N.t('no_machines_in_system')}</option>`;
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

    const unitKg = I18N.t('unit_kg');
    document.getElementById('chart-machine-title').textContent = `${I18N.t('trends_title')}: ${machine.name}`;

    const logs = await gymDB.getLogsForMachine(machineId);
    document.getElementById('chart-total-logs-badge').textContent = `${logs.length} ${I18N.t('chart_badge_workouts')}`;

    // Calculate Stats
    const startWeightEl = document.getElementById('stat-start-weight');
    const prWeightEl = document.getElementById('stat-pr-weight');
    const progressEl = document.getElementById('stat-total-progress');

    if (logs.length === 0) {
        startWeightEl.textContent = `${machine.defaultWeight || 0} ${unitKg}`;
        prWeightEl.textContent = '-';
        progressEl.textContent = I18N.t('no_trend_data');
    } else {
        const firstW = logs[0].weight;
        const weights = logs.map(l => l.weight);
        const maxW = Math.max(...weights);
        const currentW = logs[logs.length - 1].weight;
        const diff = (currentW - firstW);
        const diffSign = diff > 0 ? `+${diff}` : `${diff}`;

        startWeightEl.textContent = `${firstW} ${unitKg}`;
        prWeightEl.textContent = `${maxW} ${unitKg}`;
        progressEl.textContent = `${diffSign} ${unitKg} (${diff >= 0 ? '+' : ''}${firstW > 0 ? ((diff / firstW) * 100).toFixed(0) : 0}%)`;
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

    const unitKg = I18N.t('unit_kg');
    const isRtl = I18N.languages[I18N.currentLang]?.dir === 'rtl';
    const chartFont = I18N.currentLang === 'ar' ? 'Cairo' : 'Rubik';

    if (logs.length === 0) {
        state.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [I18N.t('no_data_yet')],
                datasets: [{
                    label: I18N.t('weight_progression_label'),
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

    const labels = logs.map(l => I18N.formatDate(l.date, { day: '2-digit', month: '2-digit' }));
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
                label: I18N.t('weight_progression_label'),
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
                    rtl: isRtl,
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
                                `${I18N.t('tooltip_weight')} ${context.parsed.y} ${unitKg}`,
                                `${I18N.t('tooltip_sets_reps')} ${formatLogReps(log)}`,
                                log.notes ? `${I18N.t('tooltip_note')} ${log.notes}` : ''
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
                        font: { family: chartFont }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.06)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: { family: chartFont },
                        callback: (val) => `${val} ${unitKg}`
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
        container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">${I18N.t('no_history_logs')}</p>`;
        return;
    }

    const unitKg = I18N.t('unit_kg');
    const sorted = [...logs].reverse();

    container.innerHTML = sorted.map(log => {
        const formattedDate = I18N.formatDate(log.date, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="history-item">
                <div>
                    <div class="history-metrics">
                        <span class="history-weight">${log.weight} ${unitKg}</span>
                        <span class="history-reps">${formatLogReps(log)}</span>
                    </div>
                    <div class="history-date">${formattedDate} ${log.notes ? `• <em>${escapeHtml(log.notes)}</em>` : ''}</div>
                </div>
                <button class="history-del-btn" onclick="confirmDeleteLog('${log.id}')" title="${I18N.t('confirm_delete_log_title')}">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
    }).join('');
}

window.confirmDeleteLog = async (logId) => {
    const ok = await Popup.confirm(
        I18N.t('confirm_delete_log_title'),
        I18N.t('confirm_delete_log_msg'),
        { danger: true, confirmText: I18N.t('btn_delete_confirm'), cancelText: I18N.t('btn_cancel') }
    );
    if (ok) {
        await gymDB.deleteLog(logId);
        Popup.toast(I18N.t('msg_log_deleted'), 'info');
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

    const machinesBadgeWord = I18N.t('badge_machines_count');
    const reorderUpTitle = I18N.t('reorder_up');
    const reorderDownTitle = I18N.t('reorder_down');
    const editDayTitle = I18N.t('btn_edit_machine');
    const deleteDayTitle = I18N.t('btn_delete_machine');

    const html = state.splitDays.length === 0
        ? `<div class="empty-state" style="padding: 24px 10px; margin: 10px 0;">
             <p style="color: var(--text-secondary); margin-bottom: 12px;">${I18N.t('no_split_days_yet')}</p>
             <button class="btn btn-primary btn-sm" onclick="openEditSplitDayModal()">
                 <i class="fa-solid fa-plus"></i> ${I18N.t('create_first_day_btn')}
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
                            <button type="button" class="btn-reorder" onclick="moveSplitDay('${day.id}', -1)" ${isFirst ? 'disabled' : ''} title="${reorderUpTitle}">
                                <i class="fa-solid fa-chevron-up"></i>
                            </button>
                            <button type="button" class="btn-reorder" onclick="moveSplitDay('${day.id}', 1)" ${isLast ? 'disabled' : ''} title="${reorderDownTitle}">
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
                        <span class="split-day-badge-count">${count} ${machinesBadgeWord}</span>
                        <button class="btn btn-secondary btn-icon-only btn-sm" onclick="openEditSplitDayModal('${day.id}')" title="${editDayTitle}">
                            <i class="fa-solid fa-pencil"></i>
                        </button>
                        <button class="btn btn-secondary btn-icon-only btn-sm" onclick="confirmDeleteSplitDay('${day.id}')" title="${deleteDayTitle}" style="color: var(--accent-rose);">
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
        titleEl.innerHTML = `<i class="fa-solid fa-pencil"></i> <span>${I18N.t('modal_edit_day_title')}</span>`;
        idInput.value = currentDay.id;
        nameInput.value = currentDay.name || '';
        scheduleInput.value = currentDay.schedule || '';
        iconInput.value = currentDay.icon || 'fa-dumbbell';
        colorInput.value = currentDay.color || '#10b981';
    } else {
        titleEl.innerHTML = `<i class="fa-solid fa-plus-circle"></i> <span>${I18N.t('modal_add_day_title')}</span>`;
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
        <button type="button" class="icon-choice-btn ${item.icon === selectedIcon ? 'selected' : ''}" data-icon="${item.icon}" title="${I18N.getIconLabel(item.icon)}">
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
        Popup.toast(I18N.t('label_day_name'), 'warning');
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
    Popup.toast(I18N.t('msg_day_saved'), 'success');
}

window.confirmDeleteSplitDay = async (dayId) => {
    const day = state.splitDays.find(d => d.id === dayId);
    if (!day) return;

    const affected = state.machines.filter(m => m.days && m.days.includes(dayId));
    let warnMsg = I18N.t('confirm_delete_day_msg', { name: day.name });
    if (affected.length > 0) {
        warnMsg += '\n' + I18N.t('confirm_delete_day_warning', { count: affected.length });
    }

    const ok = await Popup.confirm(
        I18N.t('confirm_delete_day_title'),
        warnMsg,
        { danger: true, confirmText: I18N.t('btn_delete_confirm'), cancelText: I18N.t('btn_cancel') }
    );
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
        Popup.toast(I18N.t('msg_day_deleted'), 'info');
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

    const templates = I18N.getTemplates();
    const applyText = I18N.t('btn_apply_template');

    container.innerHTML = templates.map(tpl => `
        <div class="template-card" onclick="applyPresetTemplate('${tpl.id}')">
            <div class="template-card-header">
                <span class="template-title">${escapeHtml(tpl.title)}</span>
                <span class="btn btn-cyan btn-sm"><i class="fa-solid fa-plus"></i> ${applyText}</span>
            </div>
            <p class="template-desc">${escapeHtml(tpl.description)}</p>
            <div class="template-days-pills">
                ${tpl.days.map(d => `
                    <span class="template-day-tag" style="border-color: ${d.color}60;">
                        <i class="fa-solid ${d.icon}" style="color: ${d.color};"></i>
                        <span>${escapeHtml(d.name)}</span>
                    </span>
                `).join('')}
            </div>
        </div>
    `).join('');
}

window.applyPresetTemplate = async (templateId) => {
    const templates = I18N.getTemplates();
    const tpl = templates.find(t => t.id === templateId);
    if (!tpl) return;

    let replaceExisting = false;
    if (state.splitDays.length > 0) {
        const choice = await Popup.confirm(
            I18N.t('confirm_apply_template_title', { title: tpl.title }),
            I18N.t('confirm_apply_template_msg', { count: state.splitDays.length }),
            { confirmText: I18N.t('btn_replace_all_days'), cancelText: I18N.t('btn_add_to_existing_days') }
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
    Popup.toast(I18N.t('msg_template_applied'), 'success');
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

        Popup.toast(I18N.t('msg_export_success'), 'success', 4000);
    } catch (err) {
        console.error('Export error:', err);
        Popup.alert('Error', err.message, 'danger');
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
                    throw new Error('Invalid JSON format for GymMaster backup.');
                }

                const confirmed = await Popup.confirm(
                    I18N.t('msg_import_confirm_title'),
                    I18N.t('msg_import_confirm_desc', {
                        machines: parsed.data.machines?.length || 0,
                        logs: parsed.data.logs?.length || 0,
                        days: parsed.data.splitDays?.length || 0
                    }),
                    { confirmText: I18N.t('btn_restore'), cancelText: I18N.t('btn_cancel'), danger: false }
                );

                if (confirmed) {
                    const result = await gymDB.importData(parsed, true);
                    await refreshAllData();
                    Popup.alert(
                        I18N.t('msg_import_success_title'),
                        I18N.t('msg_import_success_desc', {
                            machines: result.machinesCount,
                            logs: result.logsCount
                        }),
                        'success'
                    );
                }
            } catch (innerErr) {
                console.error('Import parse error:', innerErr);
                Popup.alert('Error', innerErr.message, 'danger');
            }
        };
        reader.readAsText(file);
    } catch (err) {
        console.error('Import file error:', err);
        Popup.alert('Error', err.message, 'danger');
    } finally {
        e.target.value = ''; // Reset file input
    }
}

async function handleClearAllData() {
    const confirmed = await Popup.confirm(
        I18N.t('confirm_reset_all_title'),
        I18N.t('confirm_reset_all_desc'),
        { danger: true, confirmText: I18N.t('btn_delete_confirm'), cancelText: I18N.t('btn_cancel') }
    );

    if (confirmed) {
        await gymDB.clearAllData();
        await refreshAllData();
        Popup.toast(I18N.t('msg_all_reset'), 'info');
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
    // Language Dropdown Switcher
    const langToggleBtn = document.getElementById('btn-lang-toggle');
    const langDropdownMenu = document.getElementById('lang-dropdown-menu');

    langToggleBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdownMenu?.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.lang-dropdown-container')) {
            langDropdownMenu?.classList.remove('show');
        }
    });

    // Language Dropdown Options
    document.querySelectorAll('.lang-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            changeAppLanguage(lang);
            langDropdownMenu?.classList.remove('show');
        });
    });

    // Settings Language Choice Cards
    document.querySelectorAll('.lang-choice-card').forEach(card => {
        card.addEventListener('click', () => {
            const lang = card.dataset.lang;
            changeAppLanguage(lang);
        });
    });

    // Add machine buttons
    document.getElementById('btn-header-add-machine')?.addEventListener('click', openAddMachineModal);
    document.getElementById('btn-empty-add-machine')?.addEventListener('click', openAddMachineModal);
    setupWheelSteppers();

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
            Popup.toast(I18N.t('msg_compressing_image'), 'info', 1500);
            const compressedBase64 = await compressImage(file, 900, 0.82);

            document.getElementById('photo-preview-wrap').style.display = 'block';
            document.getElementById('photo-prompt').style.display = 'none';
            document.getElementById('photo-preview-img').src = compressedBase64;
            document.getElementById('machine-photo-base64').value = compressedBase64;

            Popup.toast(I18N.t('msg_image_added'), 'success');
        } catch (err) {
            console.error('Image compression error:', err);
            Popup.alert('Error', err.message, 'danger');
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
            I18N.t('confirm_load_demo_title'),
            I18N.t('confirm_load_demo_desc'),
            { confirmText: I18N.t('btn_load_demo_confirm'), cancelText: I18N.t('btn_cancel') }
        );
        if (ok) {
            await seedDemoData();
            await refreshAllData();
            Popup.toast(I18N.t('msg_demo_loaded'), 'success');
        }
    });
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function formatLogReps(entry) {
    const perSet = entry?.repsPerSet || entry?.lastRepsPerSet;
    if (Array.isArray(perSet) && perSet.length) {
        return perSet.join(' / ');
    }
    const sets = entry?.sets || entry?.lastSets;
    const reps = entry?.reps || entry?.lastReps || entry?.defaultReps;
    if (sets && reps != null) return `${sets} × ${reps}`;
    return reps != null ? String(reps) : '-';
}

function bumpWheelValue(input, delta, min) {
    let current = parseFloat(input.value) || 0;
    let next = current + delta;
    if (next < min) next = min;
    if (Math.abs(delta) % 1 !== 0) {
        next = Math.round(next * 10) / 10;
    } else {
        next = Math.round(next);
    }
    input.value = next;
}

function commitWheelValue(input, min, step) {
    let val = parseFloat(input.value);
    if (Number.isNaN(val) || val < min) val = min;
    if (Math.abs(step) % 1 !== 0) {
        val = Math.round(val * 10) / 10;
    } else {
        val = Math.round(val);
    }
    input.value = val;
}

function beginWheelEdit(col, input) {
    col.classList.remove('swiping');
    col.classList.add('editing');
    input.readOnly = false;
    input.focus({ preventScroll: true });
    input.select();
}

function endWheelEdit(col, input, min, step) {
    commitWheelValue(input, min, step);
    input.readOnly = true;
    col.classList.remove('editing');
}

function setupWheelSteppers() {
    document.querySelectorAll('.wheel-stepper').forEach(col => {
        if (col.dataset.bound === '1') return;
        col.dataset.bound = '1';

        const input = col.querySelector('.wheel-value');
        const step = parseFloat(col.dataset.step) || 1;
        const min = parseFloat(col.dataset.min) || 0;

        col.querySelector('.wheel-plus')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (col.classList.contains('editing')) endWheelEdit(col, input, min, step);
            bumpWheelValue(input, step, min);
        });
        col.querySelector('.wheel-minus')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (col.classList.contains('editing')) endWheelEdit(col, input, min, step);
            bumpWheelValue(input, -step, min);
        });

        let startY = null;
        let acc = 0;
        let didSwipe = false;
        let startOnValue = false;

        col.addEventListener('pointerdown', (e) => {
            if (e.target.closest('button')) return;
            if (col.classList.contains('editing')) return;
            startY = e.clientY;
            acc = 0;
            didSwipe = false;
            startOnValue = !!e.target.closest('.wheel-value');
        });
        col.addEventListener('pointermove', (e) => {
            if (startY === null || col.classList.contains('editing')) return;
            const dy = startY - e.clientY;
            acc += dy;
            startY = e.clientY;
            const threshold = 20;
            if (!didSwipe && Math.abs(acc) < threshold) return;
            if (!didSwipe) {
                didSwipe = true;
                try { col.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
                col.classList.add('swiping');
            }
            while (acc >= threshold) {
                bumpWheelValue(input, step, min);
                acc -= threshold;
            }
            while (acc <= -threshold) {
                bumpWheelValue(input, -step, min);
                acc += threshold;
            }
        });
        const finishPointer = () => {
            const shouldEdit = startOnValue && !didSwipe && startY !== null;
            startY = null;
            acc = 0;
            startOnValue = false;
            col.classList.remove('swiping');
            if (shouldEdit) beginWheelEdit(col, input);
            didSwipe = false;
        };
        col.addEventListener('pointerup', finishPointer);
        col.addEventListener('pointercancel', () => {
            startY = null;
            acc = 0;
            didSwipe = false;
            startOnValue = false;
            col.classList.remove('swiping');
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                input.blur();
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                input.blur();
            }
        });
        input.addEventListener('blur', () => {
            if (!col.classList.contains('editing')) return;
            endWheelEdit(col, input, min, step);
        });

        col.addEventListener('wheel', (e) => {
            if (col.classList.contains('editing')) return;
            e.preventDefault();
            bumpWheelValue(input, e.deltaY < 0 ? step : -step, min);
        }, { passive: false });
    });
}

function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('./sw.js').catch((err) => {
        console.warn('Service worker registration failed:', err);
    });
}

// Security helper
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Boot up app on DOM ready
document.addEventListener('DOMContentLoaded', initApp);
