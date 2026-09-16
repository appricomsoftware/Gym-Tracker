// IndexedDB storage manager for Gym Tracker
const DB_NAME = 'GymMasterDB';
const DB_VERSION = 1;

class GymDB {
    constructor() {
        this.db = null;
    }

    async init() {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Machines store
                if (!db.objectStoreNames.contains('machines')) {
                    const machineStore = db.createObjectStore('machines', { keyPath: 'id' });
                    machineStore.createIndex('days', 'days', { multiEntry: true });
                    machineStore.createIndex('name', 'name', { unique: false });
                    machineStore.createIndex('updatedAt', 'updatedAt', { unique: false });
                }

                // Logs / History store
                if (!db.objectStoreNames.contains('logs')) {
                    const logStore = db.createObjectStore('logs', { keyPath: 'id' });
                    logStore.createIndex('machineId', 'machineId', { unique: false });
                    logStore.createIndex('date', 'date', { unique: false });
                }

                // Workout split days store
                if (!db.objectStoreNames.contains('splitDays')) {
                    db.createObjectStore('splitDays', { keyPath: 'id' });
                }
            };

            request.onsuccess = async (event) => {
                this.db = event.target.result;
                await this.seedDefaultDays();
                resolve(this.db);
            };

            request.onerror = (event) => {
                console.error('IndexedDB open error:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // Default workout days
    async seedDefaultDays() {
        const days = await this.getAllSplitDays();
        if (days.length === 0) {
            let defaultDays;
            if (typeof I18N !== 'undefined' && typeof I18N.getTemplates === 'function') {
                const tpls = I18N.getTemplates();
                defaultDays = tpls[0].days.map((d, idx) => ({
                    id: 'day_' + (idx + 1),
                    name: d.name,
                    icon: d.icon || 'fa-dumbbell',
                    color: d.color || '#38bdf8',
                    order: idx + 1,
                    schedule: d.schedule || ''
                }));
            } else {
                defaultDays = [
                    { id: 'chest_shoulders', name: 'חזה וכתפיים', icon: 'fa-dumbbell', color: '#38bdf8', order: 1, schedule: 'ימי ראשון ורביעי' },
                    { id: 'back_biceps', name: 'גב ויד קדמית', icon: 'fa-arrows-up-down', color: '#4ade80', order: 2, schedule: 'ימי שני וחמישי' },
                    { id: 'legs_abs', name: 'רגליים ובטן', icon: 'fa-person-running', color: '#f59e0b', order: 3, schedule: 'ימי שלישי' },
                    { id: 'arms_core', name: 'יד קדמית ואחורית', icon: 'fa-hand-back-fist', color: '#ec4899', order: 4, schedule: 'דגש זרועות' },
                    { id: 'full_body', name: 'אימון כללי / כוח', icon: 'fa-fire', color: '#a855f7', order: 5, schedule: 'אימון כוח מלא' }
                ];
            }
            for (const day of defaultDays) {
                await this.saveSplitDay(day);
            }
        }
    }

    // Split Days
    async getAllSplitDays() {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('splitDays', 'readonly');
            const store = tx.objectStore('splitDays');
            const req = store.getAll();
            req.onsuccess = () => {
                const days = req.result || [];
                days.sort((a, b) => (a.order || 999) - (b.order || 999));
                resolve(days);
            };
            req.onerror = () => reject(req.error);
        });
    }

    async saveSplitDay(day) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('splitDays', 'readwrite');
            const store = tx.objectStore('splitDays');
            const req = store.put(day);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async deleteSplitDay(dayId) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('splitDays', 'readwrite');
            const store = tx.objectStore('splitDays');
            const req = store.delete(dayId);
            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);
        });
    }

    // Machines
    async getAllMachines() {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('machines', 'readonly');
            const store = tx.objectStore('machines');
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => reject(req.error);
        });
    }

    async getMachineById(id) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('machines', 'readonly');
            const store = tx.objectStore('machines');
            const req = store.get(id);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async saveMachine(machine) {
        if (!machine.id) {
            machine.id = 'mach_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
        }
        machine.updatedAt = new Date().toISOString();
        if (!machine.createdAt) {
            machine.createdAt = machine.updatedAt;
        }

        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('machines', 'readwrite');
            const store = tx.objectStore('machines');
            const req = store.put(machine);
            req.onsuccess = () => resolve(machine);
            req.onerror = () => reject(req.error);
        });
    }

    async deleteMachine(id) {
        // Also delete associated logs
        const logs = await this.getLogsForMachine(id);
        const tx = this.db.transaction(['machines', 'logs'], 'readwrite');
        const machineStore = tx.objectStore('machines');
        const logStore = tx.objectStore('logs');

        machineStore.delete(id);
        for (const log of logs) {
            logStore.delete(log.id);
        }

        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => reject(tx.error);
        });
    }

    // Logs / Workout History
    async addLog(log) {
        if (!log.id) {
            log.id = 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
        }
        if (!log.date) {
            log.date = new Date().toISOString();
        }

        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['logs', 'machines'], 'readwrite');
            const logStore = tx.objectStore('logs');
            const machineStore = tx.objectStore('machines');

            logStore.add(log);

            // Update machine's latest stats
            const mReq = machineStore.get(log.machineId);
            mReq.onsuccess = () => {
                const machine = mReq.result;
                if (machine) {
                    machine.lastWeight = log.weight;
                    machine.lastReps = log.reps;
                    machine.lastSets = log.sets;
                    machine.lastRepsPerSet = log.repsPerSet || null;
                    machine.lastDate = log.date;
                    machine.updatedAt = new Date().toISOString();
                    machineStore.put(machine);
                }
            };

            tx.oncomplete = () => resolve(log);
            tx.onerror = () => reject(tx.error);
        });
    }

    async getLogsForMachine(machineId) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('logs', 'readonly');
            const store = tx.objectStore('logs');
            const index = store.index('machineId');
            const req = index.getAll(machineId);
            req.onsuccess = () => {
                const logs = req.result || [];
                // Sort ascending by date for charts
                logs.sort((a, b) => new Date(a.date) - new Date(b.date));
                resolve(logs);
            };
            req.onerror = () => reject(req.error);
        });
    }

    async getAllLogs() {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('logs', 'readonly');
            const store = tx.objectStore('logs');
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => reject(req.error);
        });
    }

    async deleteLog(logId) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('logs', 'readwrite');
            const store = tx.objectStore('logs');
            const req = store.delete(logId);
            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);
        });
    }

    // Export entire database to JSON object
    async exportData() {
        const [splitDays, machines, logs] = await Promise.all([
            this.getAllSplitDays(),
            this.getAllMachines(),
            this.getAllLogs()
        ]);

        return {
            version: DB_VERSION,
            appName: 'GymMaster',
            exportedAt: new Date().toISOString(),
            data: {
                splitDays,
                machines,
                logs
            }
        };
    }

    // Import data from JSON object
    async importData(importedPayload, clearExisting = false) {
        if (!importedPayload || !importedPayload.data) {
            throw new Error('קובץ הגיבוי אינו תקין או שאינו מכיל מידע מתאים.');
        }

        const { splitDays = [], machines = [], logs = [] } = importedPayload.data;

        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['splitDays', 'machines', 'logs'], 'readwrite');
            const dayStore = tx.objectStore('splitDays');
            const machineStore = tx.objectStore('machines');
            const logStore = tx.objectStore('logs');

            if (clearExisting) {
                dayStore.clear();
                machineStore.clear();
                logStore.clear();
            }

            for (const day of splitDays) {
                dayStore.put(day);
            }
            for (const m of machines) {
                machineStore.put(m);
            }
            for (const l of logs) {
                logStore.put(l);
            }

            tx.oncomplete = () => resolve({
                daysCount: splitDays.length,
                machinesCount: machines.length,
                logsCount: logs.length
            });
            tx.onerror = () => reject(tx.error);
        });
    }

    // Reset all data
    async clearAllData() {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['splitDays', 'machines', 'logs'], 'readwrite');
            tx.objectStore('splitDays').clear();
            tx.objectStore('machines').clear();
            tx.objectStore('logs').clear();

            tx.oncomplete = async () => {
                await this.seedDefaultDays();
                resolve(true);
            };
            tx.onerror = () => reject(tx.error);
        });
    }
}

// Global DB instance
window.gymDB = new GymDB();
