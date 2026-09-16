/**
 * GymMaster - Internationalization & Translations
 * Supported Languages:
 *  - Hebrew (עברית) - he (RTL)
 *  - English - en (LTR)
 *  - Arabic (العربية) - ar (RTL)
 *  - Russian (Русский) - ru (LTR)
 */

const I18N = {
    languages: {
        he: { code: 'he', name: 'עברית', dir: 'rtl', short: 'עב', flag: '🇮🇱', locale: 'he-IL' },
        en: { code: 'en', name: 'English', dir: 'ltr', short: 'EN', flag: '🇺🇸', locale: 'en-US' },
        ar: { code: 'ar', name: 'العربية', dir: 'rtl', short: 'عر', flag: '🇦🇪', locale: 'ar-SA' },
        ru: { code: 'ru', name: 'Русский', dir: 'ltr', short: 'RU', flag: '🇷🇺', locale: 'ru-RU' }
    },

    defaultLang: 'he',
    currentLang: 'he',

    translations: {
        he: {
            app_title: 'GymMaster',
            app_subtitle: 'ניהול מכשירים ומעקב אימונים',
            new_machine: 'מכשיר חדש',
            manage_split_days: 'נהל ימי אימון',
            split_day_section_title: 'בחירת יום / פיצול אימון',
            all_machines_label: 'כל המכשירים',
            all_pill: 'הכל',
            new_day_pill: 'יום חדש',
            search_placeholder: 'חיפוש מכשיר או תרגיל לפי שם...',
            empty_title: 'אין עדיין מכשירים ליום זה',
            empty_desc: 'הוסף את המכשיר הראשון שלך עם תמונה, ימי אימון, משקל יעד וחזרות.',
            empty_add_btn: 'צלם והוסף מכשיר ראשון',

            // Navigation
            nav_machines: 'מכשירים',
            nav_trends: 'מגמות ו-Trend',
            nav_settings: 'הגדרות וגיבוי',

            // Cubes & Details
            unit_kg: 'ק"ג',
            reps: 'חזרות',
            sets: 'סטים',
            last_badge_prefix: 'ביצוע אחרון',
            tap_to_view: 'לחץ לצפייה בפרטים',
            btn_open_details: 'פרטי מכשיר',
            tap_to_enlarge: 'לחץ להגדלה',
            no_photo_placeholder: 'ללא תמונה',

            // Details Modal
            details_modal_title: 'פרטי מכשיר',
            target_weight: 'משקל מתוכנן',
            target_sets_reps: 'סטים וחזרות',
            last_workout_logged: 'אימון אחרון שנרשם:',
            seat_adjustment_title: 'כיוונון מושב / פין:',
            notes_technique_title: 'דגשים וטכניקה:',
            btn_log_workout: 'רשום ביצוע',
            btn_trend: 'Trend',
            btn_edit_machine: 'ערוך מכשיר',
            btn_delete_machine: 'מחק מכשיר',

            // Add/Edit Machine Modal
            modal_add_machine: 'הוספת מכשיר חדש',
            modal_edit_machine: 'עריכת מכשיר',
            label_machine_name: 'שם המכשיר או התרגיל *',
            ph_machine_name: 'למשל: לחיצת חזה במכונה, פולי עליון...',
            label_machine_photo: 'תמונת המכשיר (לזיהוי ויזואלי מהיר)',
            photo_prompt_title: 'צלם מכשיר או בחר תמונה',
            photo_prompt_sub: 'עוזר לזהות את המכשיר במבט אחד בחדר הכושר',
            btn_camera: 'צילום ישיר',
            btn_gallery: 'מהגלריה',
            label_planned_days: 'ימי אימון מתוכננים',
            label_target_weight: 'משקל מתוכנן (ק"ג)',
            label_target_reps: 'חזרות מתוכננות',
            label_sets_count: 'כמות סטים',
            label_seat_pin: 'כיוונון מושב / פין',
            ph_seat_pin: 'למשל: גובה 4, משענת 2',
            label_notes: 'הערות ודגשי טכניקה',
            ph_notes: 'למשל: אחיזה רחבה, דרופ-סט בסיום, תנועה איטית ומבוקרת...',
            btn_cancel: 'ביטול',
            btn_save_machine: 'שמור מכשיר',

            // Log Workout Modal
            modal_log_workout_title: 'רישום ביצוע אימון',
            label_log_date: 'תאריך האימון',
            label_weight_done: 'משקל שבוצע (ק"ג)',
            label_reps_done: 'חזרות שבוצעו',
            label_sets_done: 'סטים שבוצעו',
            log_set_n: 'סט {n}',
            swipe_hint: 'החלק למעלה או למטה כדי לשנות',
            label_log_notes: 'הערות לביצוע היום',
            ph_log_notes: 'למשל: הרגיש קל, שבוע הבא להעלות משקל!',
            chk_update_target: 'עדכן משקל זה כמשקל היעד החדש של המכשיר',
            btn_save_log: 'שמור ביצוע',

            // Trends View
            trends_title: 'מעקב מגמות והתקדמות',
            label_select_trend_machine: 'בחר מכשיר לצפייה במגמה:',
            stat_start_weight: 'משקל התחלתי',
            stat_pr: 'שיא אישי (PR)',
            stat_total_progress: 'התקדמות כוללת',
            chart_title: 'גרף משקלי עבודה לאורך זמן',
            chart_badge_workouts: 'אימונים רשומים',
            history_title: 'היסטוריית אימונים שנרשמו למכשיר זה',
            no_history_logs: 'אין עדיין אימונים שנרשמו למכשיר זה. לחץ על "רשום ביצוע" בכרטיס המכשיר.',
            no_trend_data: 'טרם נרשמו ביצועים',

            // Manage Split Days Modal
            manage_split_modal_title: 'ניהול סוגי ימי אימון מתוכננים',
            btn_new_workout_day: 'יום אימון חדש',
            btn_preset_templates: 'תבניות פיצול מוכנות (PPL וכו\')',
            btn_done: 'סיום',
            badge_machines_count: 'מכשירים',
            reorder_up: 'העבר למעלה',
            reorder_down: 'העבר למטה',
            no_split_days_yet: 'אין עדיין ימי אימון מוגדרים.',
            create_first_day_btn: 'צור יום אימון ראשון',

            // Add/Edit Split Day Modal
            modal_add_day_title: 'הוספת יום אימון חדש',
            modal_edit_day_title: 'עריכת יום אימון',
            label_day_name: 'שם יום האימון / הפיצול *',
            ph_day_name: 'למשל: חזה וכתפיים / פול בקרקע / Push Day',
            label_day_schedule: 'תזמון או הערה (אופציונלי)',
            ph_day_schedule: 'למשל: ימי ראשון ורביעי / אימון A / דגש כוח',
            label_choose_icon: 'בחר אייקון ליום זה',
            label_choose_color: 'בחר צבע נושא',
            btn_save_day: 'שמור יום אימון',

            // Preset Templates Modal
            templates_modal_title: 'בחירת תבנית פיצול מוכנה',
            templates_modal_desc: 'בחר תבנית פיצול מוכנה להחלה מהירה. תוכל לבחור אם להחליף את הימים הקיימים או להוסיף אליהם.',
            btn_apply_template: 'החל תבנית',
            btn_close: 'סגור',

            // Settings View
            settings_title: 'גיבוי, שחזור והגדרות',
            lang_card_title: 'שפת הממשק / Interface Language',
            lang_card_desc: 'בחר את שפת האפליקציה המועדפת עליך (תומך בעברית, אנגלית, ערבית ורוסית).',
            backup_card_title: 'גיבוי ושחזור נתונים מקומי',
            backup_card_desc: 'הנתונים והתמונות נשמרים במכשירך בבסיס נתונים מקומי מהיר (IndexedDB). תוכל לייצא קובץ גיבוי מלא או לשחזר ממכשיר אחר.',
            btn_export_json: 'ייצוא גיבוי מלא (JSON)',
            btn_import_json: 'שחזור / ייבוא מקובץ',
            manage_splits_settings_title: 'ניהול סוגי ימי אימון מתוכננים',
            manage_splits_settings_desc: 'התאם אישית את ימי ופיצולי האימון שלך לפי התוכנית (ערוך שמות, ימי אימון מתוכננים, אייקונים וצבעים, ושנה את הסדר שלהם).',
            btn_ready_templates: 'תבניות מוכנות',
            btn_add_day_short: 'הוסף יום',
            danger_zone_title: 'איפוס וטעינת נתונים',
            danger_zone_desc: 'מחיקת כל המכשירים, התמונות והיסטוריית האימונים לצורך התחלה נקייה לחלוטין.',
            btn_clear_all: 'אפס ומחק את כל הנתונים',
            btn_load_demo: 'טען נתוני דוגמה להתרשמות',

            // Popups & Alerts
            msg_app_loaded: 'GymMaster נטען בהצלחה! ברוך הבא לאימון.',
            msg_db_error: 'אירעה שגיאה בטעינת מאגר הנתונים המקומי:',
            msg_enter_machine_name: 'אנא הזן שם למכשיר',
            confirm_no_days_title: 'לא נבחרו ימי אימון',
            confirm_no_days_msg: 'לא בחרת יום אימון עבור מכשיר זה. המכשיר יופיע רק בלשונית "הכל". האם להמשיך?',
            btn_save_anyway: 'כן, שמור בכל זאת',
            btn_back_to_select: 'חזור ובחר יום',
            msg_machine_saved: 'נשמר בהצלחה!',
            msg_save_error: 'לא ניתן לשמור את המכשיר:',
            confirm_delete_machine_title: 'מחיקת מכשיר',
            confirm_delete_machine_msg: 'האם אתה בטוח שברצונך למחוק את {name}? כל היסטוריית האימונים והגרפים של מכשיר זה יימחקו לצמיתות.',
            btn_delete_confirm: 'כן, מחק',
            msg_machine_deleted: 'נמחק בהצלחה',
            msg_workout_logged: 'כל הכבוד! נרשמו {weight} ק"ג × {reps} ל-{name}',
            confirm_delete_log_title: 'מחיקת רישום אימון',
            confirm_delete_log_msg: 'האם ברצונך למחוק רשומת אימון זו מההיסטוריה?',
            msg_log_deleted: 'רשומת האימון נמחקה',
            msg_day_saved: 'יום אימון נשמר בהצלחה!',
            confirm_delete_day_title: 'מחיקת יום אימון',
            confirm_delete_day_msg: 'האם למחוק את יום האימון "{name}"?',
            confirm_delete_day_warning: 'שים לב: ישנם {count} מכשירים המשוייכים ליום זה.',
            msg_day_deleted: 'יום האימון נמחק',
            confirm_apply_template_title: 'החלת תבנית: {title}',
            confirm_apply_template_msg: 'האם ברצונך להחליף את כל {count} הימים הקיימים בימי התבנית, או להוסיף את ימי התבנית לימים הקיימים?',
            btn_replace_all_days: 'החלף הכל בימי התבנית',
            btn_add_to_existing_days: 'הוסף לימים הקיימים',
            msg_template_applied: 'התבנית הוחלה בהצלחה!',
            msg_export_success: 'קובץ הגיבוי הורד בהצלחה! כל המכשירים, התמונות וההיסטוריה שמורים.',
            msg_import_confirm_title: 'שחזור מגיבוי',
            msg_import_confirm_desc: 'נמצאו בקובץ:\n• {machines} מכשירים\n• {logs} אימונים בהיסטוריה\n• {days} ימי אימון.\n\nהאם להחליף את כל הנתונים הקיימים בנתוני הגיבוי?',
            btn_restore: 'שחזר נתונים',
            msg_import_success_title: 'השחזור הושלם בהצלחה!',
            msg_import_success_desc: 'שוחזרו בהצלחה {machines} מכשירים ו-{logs} רשומות אימון.',
            confirm_reset_all_title: 'איפוס ומחיקת כל הנתונים',
            confirm_reset_all_desc: 'אזהרה: פעולה זו תמחק את כל המכשירים, התמונות והיסטוריית האימונים לצמיתות! מומלץ לוודא שביצעת ייצוא גיבוי קודם. האם להמשיך?',
            msg_all_reset: 'כל הנתונים אופסו בהצלחה',
            confirm_load_demo_title: 'טעינת נתוני דוגמה',
            confirm_load_demo_desc: 'האם ברצונך לטעון נתוני דוגמה של מכשירים ואימונים?',
            btn_load_demo_confirm: 'טען נתוני דוגמה',
            msg_demo_loaded: 'נתוני דוגמה נטענו בהצלחה',
            msg_compressing_image: 'מעבד ודוחס תמונה...',
            msg_image_added: 'התמונה נוספה בהצלחה!',
            popup_understand: 'הבנתי, תודה',
            no_machines_in_system: 'אין עדיין מכשירים במערכת',
            no_data_yet: 'אין נתונים עדיין',
            weight_progression_label: 'משקל עבודה (ק"ג)',
            tooltip_weight: 'משקל:',
            tooltip_sets_reps: 'סטים וחזרות:',
            tooltip_note: 'הערה:',
            lang_switched: 'שפת הממשק הוחלפה לעברית'
        },

        en: {
            app_title: 'GymMaster',
            app_subtitle: 'Workout & Equipment Tracker',
            new_machine: 'New Machine',
            manage_split_days: 'Manage Split Days',
            split_day_section_title: 'Workout Split / Day',
            all_machines_label: 'All Machines',
            all_pill: 'All',
            new_day_pill: 'New Day',
            search_placeholder: 'Search machine or exercise...',
            empty_title: 'No machines yet for this day',
            empty_desc: 'Add your first machine with a photo, split days, target weight and reps.',
            empty_add_btn: 'Capture & Add First Machine',

            // Navigation
            nav_machines: 'Machines',
            nav_trends: 'Trends & Progress',
            nav_settings: 'Settings & Backup',

            // Cubes & Details
            unit_kg: 'kg',
            reps: 'reps',
            sets: 'sets',
            last_badge_prefix: 'Last',
            tap_to_view: 'Tap to view details',
            btn_open_details: 'Machine details',
            tap_to_enlarge: 'Tap to enlarge',
            no_photo_placeholder: 'No photo',

            // Details Modal
            details_modal_title: 'Machine Details',
            target_weight: 'Target Weight',
            target_sets_reps: 'Sets & Reps',
            last_workout_logged: 'Last Logged Workout:',
            seat_adjustment_title: 'Seat / Pin Adjustment:',
            notes_technique_title: 'Form & Technique Notes:',
            btn_log_workout: 'Log Workout',
            btn_trend: 'Trend',
            btn_edit_machine: 'Edit Machine',
            btn_delete_machine: 'Delete Machine',

            // Add/Edit Machine Modal
            modal_add_machine: 'Add New Machine',
            modal_edit_machine: 'Edit Machine',
            label_machine_name: 'Machine or Exercise Name *',
            ph_machine_name: 'e.g., Chest Press Machine, Lat Pulldown...',
            label_machine_photo: 'Machine Photo (for quick visual recognition)',
            photo_prompt_title: 'Take a photo or choose image',
            photo_prompt_sub: 'Helps instantly spot the machine at the gym',
            btn_camera: 'Direct Camera',
            btn_gallery: 'From Gallery',
            label_planned_days: 'Planned Workout Days',
            label_target_weight: 'Target Weight (kg)',
            label_target_reps: 'Target Reps',
            label_sets_count: 'Number of Sets',
            label_seat_pin: 'Seat / Pin Adjustment',
            ph_seat_pin: 'e.g., Seat height 4, backrest 2',
            label_notes: 'Technique Notes & Cues',
            ph_notes: 'e.g., Wide grip, slow eccentric descent, drop set at the end...',
            btn_cancel: 'Cancel',
            btn_save_machine: 'Save Machine',

            // Log Workout Modal
            modal_log_workout_title: 'Log Workout Performance',
            label_log_date: 'Workout Date',
            label_weight_done: 'Weight Lifted (kg)',
            label_reps_done: 'Reps Completed',
            label_sets_done: 'Sets Completed',
            log_set_n: 'Set {n}',
            swipe_hint: 'Swipe up or down to change',
            label_log_notes: 'Notes for today\'s session',
            ph_log_notes: 'e.g., Felt easy, increase weight next week!',
            chk_update_target: 'Update this weight as the new target weight for this machine',
            btn_save_log: 'Save Log',

            // Trends View
            trends_title: 'Trends & Progress Tracking',
            label_select_trend_machine: 'Select machine to view trend:',
            stat_start_weight: 'Starting Weight',
            stat_pr: 'Personal Record (PR)',
            stat_total_progress: 'Total Progress',
            chart_title: 'Workout Weight Progression Over Time',
            chart_badge_workouts: 'workouts logged',
            history_title: 'Workout History for This Machine',
            no_history_logs: 'No workouts logged yet for this machine. Tap "Log Workout" on the machine card.',
            no_trend_data: 'No logs recorded yet',

            // Manage Split Days Modal
            manage_split_modal_title: 'Manage Planned Workout Split Days',
            btn_new_workout_day: 'New Workout Day',
            btn_preset_templates: 'Pre-made Split Templates (PPL etc.)',
            btn_done: 'Done',
            badge_machines_count: 'machines',
            reorder_up: 'Move Up',
            reorder_down: 'Move Down',
            no_split_days_yet: 'No workout days defined yet.',
            create_first_day_btn: 'Create First Workout Day',

            // Add/Edit Split Day Modal
            modal_add_day_title: 'Add New Workout Day',
            modal_edit_day_title: 'Edit Workout Day',
            label_day_name: 'Workout Day / Split Name *',
            ph_day_name: 'e.g., Push Day / Chest & Shoulders / Upper Body',
            label_day_schedule: 'Schedule or Note (optional)',
            ph_day_schedule: 'e.g., Sundays & Wednesdays / Workout A / Strength Focus',
            label_choose_icon: 'Choose Icon for This Day',
            label_choose_color: 'Choose Theme Color',
            btn_save_day: 'Save Workout Day',

            // Preset Templates Modal
            templates_modal_title: 'Choose Ready-Made Split Template',
            templates_modal_desc: 'Select a pre-configured workout split. You can choose to replace existing days or add to them.',
            btn_apply_template: 'Apply Template',
            btn_close: 'Close',

            // Settings View
            settings_title: 'Settings, Language & Backup',
            lang_card_title: 'Interface Language / שפת הממשק',
            lang_card_desc: 'Choose your preferred app language (supports Hebrew, English, Arabic, and Russian).',
            backup_card_title: 'Local Database Backup & Restore',
            backup_card_desc: 'All machine data and photos are stored securely in your browser\'s local IndexedDB. You can export a full backup or restore to another device.',
            btn_export_json: 'Export Full Backup (JSON)',
            btn_import_json: 'Restore / Import from File',
            manage_splits_settings_title: 'Manage Planned Workout Split Days',
            manage_splits_settings_desc: 'Customize your workout splits and days (edit names, schedule notes, icons, colors, and change their order).',
            btn_ready_templates: 'Ready Templates',
            btn_add_day_short: 'Add Day',
            danger_zone_title: 'Reset & Demo Data',
            danger_zone_desc: 'Permanently delete all machines, photos, and workout history for a completely clean start.',
            btn_clear_all: 'Reset & Delete All Data',
            btn_load_demo: 'Load Demo Data to Explore',

            // Popups & Alerts
            msg_app_loaded: 'GymMaster loaded successfully! Welcome to your workout.',
            msg_db_error: 'Error initializing local database:',
            msg_enter_machine_name: 'Please enter a machine or exercise name',
            confirm_no_days_title: 'No Workout Days Selected',
            confirm_no_days_msg: 'You have not assigned this machine to any workout days. It will only appear under "All". Continue?',
            btn_save_anyway: 'Yes, Save Anyway',
            btn_back_to_select: 'Go Back & Select Day',
            msg_machine_saved: 'Machine saved successfully!',
            msg_save_error: 'Unable to save machine:',
            confirm_delete_machine_title: 'Delete Machine',
            confirm_delete_machine_msg: 'Are you sure you want to delete "{name}"? All training history and progression charts for this machine will be permanently removed.',
            btn_delete_confirm: 'Yes, Delete',
            msg_machine_deleted: 'Machine deleted successfully',
            msg_workout_logged: 'Awesome job! Logged {weight} kg × {reps} for {name}',
            confirm_delete_log_title: 'Delete Workout Entry',
            confirm_delete_log_msg: 'Are you sure you want to delete this workout entry from history?',
            msg_log_deleted: 'Workout entry deleted',
            msg_day_saved: 'Workout day saved successfully!',
            confirm_delete_day_title: 'Delete Workout Day',
            confirm_delete_day_msg: 'Are you sure you want to delete "{name}"?',
            confirm_delete_day_warning: 'Note: {count} machines are assigned to this day.',
            msg_day_deleted: 'Workout day deleted',
            confirm_apply_template_title: 'Apply Template: {title}',
            confirm_apply_template_msg: 'Do you want to replace all {count} current days with the template days, or add the template days to your existing days?',
            btn_replace_all_days: 'Replace All Days',
            btn_add_to_existing_days: 'Add to Existing Days',
            msg_template_applied: 'Template applied successfully!',
            msg_export_success: 'Backup downloaded successfully! All machines, photos, and logs are secured.',
            msg_import_confirm_title: 'Restore from Backup',
            msg_import_confirm_desc: 'Backup contains:\n• {machines} machines\n• {logs} workout logs\n• {days} workout split days.\n\nDo you want to replace all current data with this backup?',
            btn_restore: 'Restore Data',
            msg_import_success_title: 'Restore Completed Successfully!',
            msg_import_success_desc: 'Successfully restored {machines} machines and {logs} workout history records.',
            confirm_reset_all_title: 'Reset & Delete All Data',
            confirm_reset_all_desc: 'Warning: This will permanently delete all machines, photos, and workout history! Make sure you exported a backup first. Proceed?',
            msg_all_reset: 'All data has been reset successfully',
            confirm_load_demo_title: 'Load Demo Data',
            confirm_load_demo_desc: 'Do you want to load sample machines and workout logs for demonstration?',
            btn_load_demo_confirm: 'Load Demo Data',
            msg_demo_loaded: 'Demo data loaded successfully',
            msg_compressing_image: 'Processing and compressing photo...',
            msg_image_added: 'Photo added successfully!',
            popup_understand: 'Got it, thanks',
            no_machines_in_system: 'No machines in the system yet',
            no_data_yet: 'No data yet',
            weight_progression_label: 'Working Weight (kg)',
            tooltip_weight: 'Weight:',
            tooltip_sets_reps: 'Sets & Reps:',
            tooltip_note: 'Note:',
            lang_switched: 'Language switched to English'
        },

        ar: {
            app_title: 'GymMaster',
            app_subtitle: 'إدارة الأجهزة وتتبع التمارين',
            new_machine: 'جهاز جديد',
            manage_split_days: 'إدارة أيام التدريب',
            split_day_section_title: 'اختيار اليوم / جدول التمرين',
            all_machines_label: 'جميع الأجهزة',
            all_pill: 'الكل',
            new_day_pill: 'يوم جديد',
            search_placeholder: 'بحث عن جهاز أو تمرين بالاسم...',
            empty_title: 'لا توجد أجهزة لهذا اليوم بعد',
            empty_desc: 'أضف جهازك الأول مع صورة وأيام التمرين والوزن المستهدف والتكرارات.',
            empty_add_btn: 'التقط صورة وأضف أول جهاز',

            // Navigation
            nav_machines: 'الأجهزة',
            nav_trends: 'الاتجاهات والتطور',
            nav_settings: 'الإعدادات والنسخ',

            // Cubes & Details
            unit_kg: 'كغ',
            reps: 'تكرار',
            sets: 'مجموعات',
            last_badge_prefix: 'آخر أداء',
            tap_to_view: 'اضغط لعرض التفاصيل',
            btn_open_details: 'تفاصيل الجهاز',
            tap_to_enlarge: 'اضغط للتكبير',
            no_photo_placeholder: 'بدون صورة',

            // Details Modal
            details_modal_title: 'تفاصيل الجهاز',
            target_weight: 'الوزن المستهدف',
            target_sets_reps: 'المجموعات والتكرارات',
            last_workout_logged: 'آخر تمرين مسجل:',
            seat_adjustment_title: 'ضبط المقعد / القفل:',
            notes_technique_title: 'ملاحظات الأداء والتقنية:',
            btn_log_workout: 'تسجيل الأداء',
            btn_trend: 'الرسم البياني',
            btn_edit_machine: 'تعديل الجهاز',
            btn_delete_machine: 'حذف الجهاز',

            // Add/Edit Machine Modal
            modal_add_machine: 'إضافة جهاز جديد',
            modal_edit_machine: 'تعديل الجهاز',
            label_machine_name: 'اسم الجهاز أو التمرين *',
            ph_machine_name: 'مثال: ضغط صدر بالماكينة، سحب علوي...',
            label_machine_photo: 'صورة الجهاز (للتعرف البصري السريع)',
            photo_prompt_title: 'التقط صورة أو اختر من المعرض',
            photo_prompt_sub: 'يساعدك على التعرف على الجهاز بلمحة في النادي الرياضي',
            btn_camera: 'تصوير مباشر',
            btn_gallery: 'من المعرض',
            label_planned_days: 'أيام التدريب المحددة',
            label_target_weight: 'الوزن المستهدف (كغ)',
            label_target_reps: 'التكرارات المستهدفة',
            label_sets_count: 'عدد المجموعات',
            label_seat_pin: 'ضبط المقعد / القفل',
            ph_seat_pin: 'مثال: ارتفاع المقعد 4، المسند 2',
            label_notes: 'ملاحظات التقنية والتكنيك',
            ph_notes: 'مثال: قبضة عريضة، نزول بطيء وتحكم كامل...',
            btn_cancel: 'إلغاء',
            btn_save_machine: 'حفظ الجهاز',

            // Log Workout Modal
            modal_log_workout_title: 'تسجيل أداء التمرين',
            label_log_date: 'تاريخ التمرين',
            label_weight_done: 'الوزن المرفوع (كغ)',
            label_reps_done: 'التكرارات المنفذة',
            label_sets_done: 'المجموعات المنفذة',
            log_set_n: 'مجموعة {n}',
            swipe_hint: 'اسحب لأعلى أو لأسفل للتغيير',
            label_log_notes: 'ملاحظات لأداء اليوم',
            ph_log_notes: 'مثال: كان خفيفاً، زيادة الوزن الأسبوع القادم!',
            chk_update_target: 'تحديث هذا الوزن كوزن مستهدف جديد للجهاز',
            btn_save_log: 'حفظ السجل',

            // Trends View
            trends_title: 'متابعة التطور والتقدم',
            label_select_trend_machine: 'اختر الجهاز لعرض التقدم:',
            stat_start_weight: 'الوزن الأولي',
            stat_pr: 'الرقم القياسي (PR)',
            stat_total_progress: 'التقدم الإجمالي',
            chart_title: 'رسم بياني لتطور الأوزان مع الوقت',
            chart_badge_workouts: 'تمارين مسجلة',
            history_title: 'سجل التمارين السابقة لهذا الجهاز',
            no_history_logs: 'لم يتم تسجيل أي تمارين لهذا الجهاز بعد. اضغط على "تسجيل الأداء" في بطاقة الجهاز.',
            no_trend_data: 'لم يتم تسجيل بيانات بعد',

            // Manage Split Days Modal
            manage_split_modal_title: 'إدارة أيام وجداول التمارين',
            btn_new_workout_day: 'يوم تدريب جديد',
            btn_preset_templates: 'جداول تمارين جاهزة (PPL وغيره)',
            btn_done: 'تم',
            badge_machines_count: 'أجهزة',
            reorder_up: 'تحريك لأعلى',
            reorder_down: 'تحريك لأسفل',
            no_split_days_yet: 'لا توجد أيام تدريب محددة بعد.',
            create_first_day_btn: 'إنشاء أول يوم تدريب',

            // Add/Edit Split Day Modal
            modal_add_day_title: 'إضافة يوم تدريب جديد',
            modal_edit_day_title: 'تعديل يوم التدريب',
            label_day_name: 'اسم يوم التدريب / الجدول *',
            ph_day_name: 'مثال: Push Day / صدر وأكتاف / الجزء العلوي',
            label_day_schedule: 'التوقيت أو ملاحظة (اختياري)',
            ph_day_schedule: 'مثال: الأحد والأربعاء / تمرين A / تركيز قوة',
            label_choose_icon: 'اختر أيقونة لهذا اليوم',
            label_choose_color: 'اختر لون اليوم',
            btn_save_day: 'حفظ يوم التدريب',

            // Preset Templates Modal
            templates_modal_title: 'اختيار جدول تمارين جاهز',
            templates_modal_desc: 'اختر جدول تمرين مسبق الإعداد للتطبيق السريع. يمكنك اختيار استبدال الأيام الحالية أو الإضافة إليها.',
            btn_apply_template: 'تطبيق الجدول',
            btn_close: 'إغلاق',

            // Settings View
            settings_title: 'الإعدادات واللغة والنسخ الاحتياطي',
            lang_card_title: 'لغة التطبيق / Interface Language',
            lang_card_desc: 'اختر لغة التطبيق المفضلة لديك (يدعم العبرية والإنجليزية والعربية والروسية).',
            backup_card_title: 'النسخ الاحتياطي المحلي والاستعادة',
            backup_card_desc: 'يتم حفظ جميع بيانات الأجهزة والصور بأمان في متصفحك محلياً (IndexedDB). يمكنك تنزيل نسخة احتياطية كاملة أو استعادتها.',
            btn_export_json: 'تصدير نسخة احتياطية كاملة (JSON)',
            btn_import_json: 'استعادة / استيراد من ملف',
            manage_splits_settings_title: 'إدارة أيام وجداول التمارين',
            manage_splits_settings_desc: 'خصص أيام التمارين وتقسيماتك وفق خطتك (تعديل الأسماء، الملاحظات، الأيقونات، الألوان والترتيب).',
            btn_ready_templates: 'جداول جاهزة',
            btn_add_day_short: 'إضافة يوم',
            danger_zone_title: 'إعادة ضبط وبيانات تجريبية',
            danger_zone_desc: 'حذف جميع الأجهزة والصور وسجل التمارين لبداية جديدة ونظيفة بالكامل.',
            btn_clear_all: 'إعادة ضبط وحذف كل البيانات',
            btn_load_demo: 'تحميل بيانات تجريبية للاستكشاف',

            // Popups & Alerts
            msg_app_loaded: 'تم تحميل GymMaster بنجاح! مرحباً بك في تمرينك.',
            msg_db_error: 'خطأ في تشغيل قاعدة البيانات المحلية:',
            msg_enter_machine_name: 'يرجى إدخال اسم الجهاز أو التمرين',
            confirm_no_days_title: 'لم يتم تحديد أيام تمرين',
            confirm_no_days_msg: 'لم تحدد أي يوم تمرين لهذا الجهاز. سيظهر فقط تحت تبويب "الكل". هل تريد المتابعة؟',
            btn_save_anyway: 'نعم، حفظ على أي حال',
            btn_back_to_select: 'العودة لاختيار اليوم',
            msg_machine_saved: 'تم حفظ الجهاز بنجاح!',
            msg_save_error: 'تعذر حفظ الجهاز:',
            confirm_delete_machine_title: 'حذف الجهاز',
            confirm_delete_machine_msg: 'هل أنت متأكد من حذف "{name}"؟ سيتم حذف جميع التمارين والرسوم البيانية لهذا الجهاز نهائياً.',
            btn_delete_confirm: 'نعم، احذف',
            msg_machine_deleted: 'تم حذف الجهاز بنجاح',
            msg_workout_logged: 'عمل رائع! تم تسجيل {weight} كغ × {reps} لـ {name}',
            confirm_delete_log_title: 'حذف تسجيل التمرين',
            confirm_delete_log_msg: 'هل تريد حذف هذا السجل من تاريخ التمارين؟',
            msg_log_deleted: 'تم حذف سجل التمرين',
            msg_day_saved: 'تم حفظ يوم التدريب بنجاح!',
            confirm_delete_day_title: 'حذف يوم التدريب',
            confirm_delete_day_msg: 'هل أنت متأكد من حذف "{name}"؟',
            confirm_delete_day_warning: 'تنبيه: هناك {count} أجهزة مرتبطة بهذا اليوم.',
            msg_day_deleted: 'تم حذف يوم التدريب',
            confirm_apply_template_title: 'تطبيق الجدول: {title}',
            confirm_apply_template_msg: 'هل ترغب في استبدال جميع الأيام الحالية ({count}) بأيام الجدول الجديد، أو إضافتها إلى الأيام الحالية؟',
            btn_replace_all_days: 'استبدال كل الأيام',
            btn_add_to_existing_days: 'إضافة للأيام الحالية',
            msg_template_applied: 'تم تطبيق جدول التمارين بنجاح!',
            msg_export_success: 'تم تنزيل ملف النسخة الاحتياطية بنجاح! جميع الأجهزة والصور محفوظة.',
            msg_import_confirm_title: 'استعادة من النسخة الاحتياطية',
            msg_import_confirm_desc: 'يحتوي الملف على:\n• {machines} أجهزة\n• {logs} تمارين مسجلة\n• {days} أيام تدريب.\n\nهل ترغب في استبدال كافة البيانات الحالية؟',
            btn_restore: 'استعادة البيانات',
            msg_import_success_title: 'اكتملت الاستعادة بنجاح!',
            msg_import_success_desc: 'تمت استعادة {machines} أجهزة و {logs} سجل تمرين بنجاح.',
            confirm_reset_all_title: 'إعادة ضبط وحذف كل البيانات',
            confirm_reset_all_desc: 'تحذير: سيؤدي هذا الإجراء إلى مسح كافة الأجهزة والصور وسجل التمارين نهائياً! تأكد من حفظ نسخة احتياطية أولاً. متابعة؟',
            msg_all_reset: 'تمت إعادة ضبط كل البيانات بنجاح',
            confirm_load_demo_title: 'تحميل بيانات تجريبية',
            confirm_load_demo_desc: 'هل ترغب في تحميل أجهزة وتمارين تجريبية للاستكشاف؟',
            btn_load_demo_confirm: 'تحميل البيانات التجريبية',
            msg_demo_loaded: 'تم تحميل البيانات التجريبية بنجاح',
            msg_compressing_image: 'جاري معالجة وضغط الصورة...',
            msg_image_added: 'تمت إضافة الصورة بنجاح!',
            popup_understand: 'حسناً، شكراً',
            no_machines_in_system: 'لا توجد أجهزة في النظام بعد',
            no_data_yet: 'لا توجد بيانات بعد',
            weight_progression_label: 'الوزن الفعلي (كغ)',
            tooltip_weight: 'الوزن:',
            tooltip_sets_reps: 'المجموعات والتكرارات:',
            tooltip_note: 'ملاحظة:',
            lang_switched: 'تم تغيير لغة التطبيق إلى العربية'
        },

        ru: {
            app_title: 'GymMaster',
            app_subtitle: 'Управление тренажерами и тренировками',
            new_machine: 'Новый тренажер',
            manage_split_days: 'Управление днями',
            split_day_section_title: 'Выбор дня / Сплит тренировки',
            all_machines_label: 'Все тренажеры',
            all_pill: 'Все',
            new_day_pill: 'Новый день',
            search_placeholder: 'Поиск тренажера или упражнения...',
            empty_title: 'Для этого дня еще нет тренажеров',
            empty_desc: 'Добавьте первый тренажер с фото, днями сплита, весом и повторениями.',
            empty_add_btn: 'Сфотографировать и добавить первый тренажер',

            // Navigation
            nav_machines: 'Тренажеры',
            nav_trends: 'Тренды и Прогресс',
            nav_settings: 'Настройки и Бэкап',

            // Cubes & Details
            unit_kg: 'кг',
            reps: 'повт.',
            sets: 'подх.',
            last_badge_prefix: 'Посл.',
            tap_to_view: 'Нажмите для просмотра',
            btn_open_details: 'Данные тренажера',
            tap_to_enlarge: 'Нажмите для увеличения',
            no_photo_placeholder: 'Без фото',

            // Details Modal
            details_modal_title: 'Информация о тренажере',
            target_weight: 'Целевой вес',
            target_sets_reps: 'Подходы и повторения',
            last_workout_logged: 'Последняя запись тренировки:',
            seat_adjustment_title: 'Настройка сиденья / штифта:',
            notes_technique_title: 'Техника и примечания:',
            btn_log_workout: 'Записать тренировку',
            btn_trend: 'График',
            btn_edit_machine: 'Редактировать',
            btn_delete_machine: 'Удалить',

            // Add/Edit Machine Modal
            modal_add_machine: 'Добавить тренажер',
            modal_edit_machine: 'Редактировать тренажер',
            label_machine_name: 'Название тренажера или упражнения *',
            ph_machine_name: 'например: Жим от груди в тренажере, верхняя тяга...',
            label_machine_photo: 'Фото тренажера (для быстрого опознания)',
            photo_prompt_title: 'Сфотографируйте или выберите изображение',
            photo_prompt_sub: 'Помогает мгновенно узнать тренажер в зале с одного взгляда',
            btn_camera: 'Камера',
            btn_gallery: 'Из галереи',
            label_planned_days: 'Запланированные дни сплита',
            label_target_weight: 'Целевой вес (кг)',
            label_target_reps: 'Целевые повторения',
            label_sets_count: 'Количество подходов',
            label_seat_pin: 'Положение сиденья / фиксатора',
            ph_seat_pin: 'например: Высота сиденья 4, спинка 2',
            label_notes: 'Примечания по технике',
            ph_notes: 'например: Широкий хват, медленное опускание, дроп-сет в конце...',
            btn_cancel: 'Отмена',
            btn_save_machine: 'Сохранить тренажер',

            // Log Workout Modal
            modal_log_workout_title: 'Запись выполнения упражнения',
            label_log_date: 'Дата тренировки',
            label_weight_done: 'Рабочий вес (кг)',
            label_reps_done: 'Выполненные повторения',
            label_sets_done: 'Выполненные подходы',
            log_set_n: 'Подход {n}',
            swipe_hint: 'Проведите вверх или вниз, чтобы изменить',
            label_log_notes: 'Заметки о тренировке',
            ph_log_notes: 'например: Легко пошло, на следующей неделе увеличить вес!',
            chk_update_target: 'Обновить этот вес как новый целевой вес для тренажера',
            btn_save_log: 'Сохранить запись',

            // Trends View
            trends_title: 'Отслеживание прогресса и трендов',
            label_select_trend_machine: 'Выберите тренажер для просмотра тренда:',
            stat_start_weight: 'Начальный вес',
            stat_pr: 'Личный рекорд (PR)',
            stat_total_progress: 'Общий прогресс',
            chart_title: 'График рабочих весов во времени',
            chart_badge_workouts: 'записанных тренировок',
            history_title: 'История тренировок для этого тренажера',
            no_history_logs: 'Для этого тренажера еще нет записей. Нажмите "Записать тренировку" в карточке.',
            no_trend_data: 'Данных еще нет',

            // Manage Split Days Modal
            manage_split_modal_title: 'Управление тренировочными сплитами',
            btn_new_workout_day: 'Новый тренировочный день',
            btn_preset_templates: 'Готовые шаблоны сплитов (PPL и др.)',
            btn_done: 'Готово',
            badge_machines_count: 'тренажеров',
            reorder_up: 'Переместить вверх',
            reorder_down: 'Переместить вниз',
            no_split_days_yet: 'Тренировочные дни еще не созданы.',
            create_first_day_btn: 'Создать первый тренировочный день',

            // Add/Edit Split Day Modal
            modal_add_day_title: 'Добавить тренировочный день',
            modal_edit_day_title: 'Редактировать тренировочный день',
            label_day_name: 'Название тренировочного дня / сплита *',
            ph_day_name: 'например: Push Day / Грудь и плечи / Верх тела',
            label_day_schedule: 'Расписание или заметка (необязательно)',
            ph_day_schedule: 'например: Пн и Чт / Тренировка А / Акцент на силу',
            label_choose_icon: 'Выберите иконку для этого дня',
            label_choose_color: 'Выберите цвет темы',
            btn_save_day: 'Сохранить день',

            // Preset Templates Modal
            templates_modal_title: 'Выбор готового шаблона сплита',
            templates_modal_desc: 'Выберите готовый сплит для быстрого применения. Вы можете заменить текущие дни или добавить к ним.',
            btn_apply_template: 'Применить шаблон',
            btn_close: 'Закрыть',

            // Settings View
            settings_title: 'Настройки, язык и резервное копирование',
            lang_card_title: 'Язык интерфейса / Interface Language',
            lang_card_desc: 'Выберите предпочтительный язык интерфейса (поддерживаются иврит, английский, арабский и русский).',
            backup_card_title: 'Локальное резервное копирование и восстановление',
            backup_card_desc: 'Все данные и фотографии безопасно хранятся в браузере в локальной IndexedDB. Вы можете экспортировать полную копию или восстановить на другом устройстве.',
            btn_export_json: 'Экспорт резервной копии (JSON)',
            btn_import_json: 'Восстановить / Импорт из файла',
            manage_splits_settings_title: 'Управление тренировочными сплитами',
            manage_splits_settings_desc: 'Настройте дни и сплиты под вашу программу (редактируйте названия, расписание, иконки, цвета и меняйте порядок).',
            btn_ready_templates: 'Готовые шаблоны',
            btn_add_day_short: 'Добавить день',
            danger_zone_title: 'Сброс и демо-данные',
            danger_zone_desc: 'Безвозвратное удаление всех тренажеров, фотографий и истории для чистого начала.',
            btn_clear_all: 'Сбросить и удалить все данные',
            btn_load_demo: 'Загрузить демо-данные для ознакомления',

            // Popups & Alerts
            msg_app_loaded: 'GymMaster успешно загружен! Удачной тренировки.',
            msg_db_error: 'Ошибка инициализации локальной базы данных:',
            msg_enter_machine_name: 'Пожалуйста, введите название тренажера или упражнения',
            confirm_no_days_title: 'Дни сплита не выбраны',
            confirm_no_days_msg: 'Вы не назначили этот тренажер ни на один тренировочный день. Он будет виден только во вкладке "Все". Продолжить?',
            btn_save_anyway: 'Да, все равно сохранить',
            btn_back_to_select: 'Вернуться и выбрать день',
            msg_machine_saved: 'Тренажер успешно сохранен!',
            msg_save_error: 'Не удалось сохранить тренажер:',
            confirm_delete_machine_title: 'Удаление тренажера',
            confirm_delete_machine_msg: 'Вы уверены, что хотите удалить "{name}"? Вся история тренировок и графики будут безвозвратно удалены.',
            btn_delete_confirm: 'Да, удалить',
            msg_machine_deleted: 'Тренажер успешно удален',
            msg_workout_logged: 'Отличная работа! Записано {weight} кг × {reps} для {name}',
            confirm_delete_log_title: 'Удаление записи тренировки',
            confirm_delete_log_msg: 'Вы действительно хотите удалить эту запись из истории тренировок?',
            msg_log_deleted: 'Запись тренировки удалена',
            msg_day_saved: 'Тренировочный день успешно сохранен!',
            confirm_delete_day_title: 'Удаление тренировочного дня',
            confirm_delete_day_msg: 'Удалить тренировочный день "{name}"?',
            confirm_delete_day_warning: 'Обратите внимание: к этому дню привязано {count} тренажеров.',
            msg_day_deleted: 'Тренировочный день удален',
            confirm_apply_template_title: 'Применить шаблон: {title}',
            confirm_apply_template_msg: 'Хотите заменить все текущие дни ({count}) на дни из шаблона или добавить их к существующим?',
            btn_replace_all_days: 'Заменить все дни',
            btn_add_to_existing_days: 'Добавить к существующим',
            msg_template_applied: 'Шаблон успешно применен!',
            msg_export_success: 'Резервная копия успешно загружена! Все тренажеры, фотографии и история сохранены.',
            msg_import_confirm_title: 'Восстановление из резервной копии',
            msg_import_confirm_desc: 'В файле обнаружено:\n• {machines} тренажеров\n• {logs} записей тренировок\n• {days} тренировочных дней.\n\nЗаменить все текущие данные данными из файла?',
            btn_restore: 'Восстановить данные',
            msg_import_success_title: 'Восстановление успешно завершено!',
            msg_import_success_desc: 'Успешно восстановлено {machines} тренажеров и {logs} записей тренировок.',
            confirm_reset_all_title: 'Сброс и удаление всех данных',
            confirm_reset_all_desc: 'Внимание: это действие безвозвратно удалит все тренажеры, фото и историю тренировок! Убедитесь, что сделали экспорт бэкапа. Продолжить?',
            msg_all_reset: 'Все данные успешно сброшены',
            confirm_load_demo_title: 'Загрузка демонстрационных данных',
            confirm_load_demo_desc: 'Хотите загрузить примеры тренажеров и тренировок для ознакомления?',
            btn_load_demo_confirm: 'Загрузить демо',
            msg_demo_loaded: 'Демо-данные успешно загружены',
            msg_compressing_image: 'Обработка и сжатие фото...',
            msg_image_added: 'Фото успешно добавлено!',
            popup_understand: 'Понятно, спасибо',
            no_machines_in_system: 'В системе пока нет тренажеров',
            no_data_yet: 'Данных пока нет',
            weight_progression_label: 'Рабочий вес (кг)',
            tooltip_weight: 'Вес:',
            tooltip_sets_reps: 'Подходы и повторения:',
            tooltip_note: 'Примечание:',
            lang_switched: 'Язык интерфейса изменен на русский'
        }
    },

    // Split Icons with multilingual labels
    icons: {
        'fa-dumbbell': { he: 'משקולת / חזה', en: 'Dumbbell / Chest', ar: 'دمبل / صدر', ru: 'Гантель / Жим' },
        'fa-arrows-up-down': { he: 'משיכה / גב', en: 'Pull / Back', ar: 'سحب / ظهر', ru: 'Тяга / Спина' },
        'fa-person-running': { he: 'רגליים / ריצה', en: 'Legs / Cardio', ar: 'أرجل / ركض', ru: 'Ноги / Бег' },
        'fa-hand-back-fist': { he: 'זרועות / אגרוף', en: 'Arms / Biceps', ar: 'أذرع / بايسبس', ru: 'Руки / Бицепс' },
        'fa-fire': { he: 'כוח / אנרגיה', en: 'Power / Full Body', ar: 'طاقة / قوة', ru: 'Сила / Энергия' },
        'fa-heart-pulse': { he: 'אירובי / דופק', en: 'Cardio / Pulse', ar: 'كارديو / نبض', ru: 'Кардио / Пульс' },
        'fa-stopwatch': { he: 'אינטרוולים / זמן', en: 'Intervals / Time', ar: 'فترات / توقيت', ru: 'Интервалы / Время' },
        'fa-bolt': { he: 'כוח מתפרץ', en: 'Explosive Power', ar: 'قوة انفجارية', ru: 'Взрывная сила' },
        'fa-shield-halved': { he: 'בטן / ליבה', en: 'Abs / Core', ar: 'بطن / كور', ru: 'Пресс / Кор' },
        'fa-award': { he: 'שיא PR', en: 'Personal Record (PR)', ar: 'رقم قياسي', ru: 'Личный рекорд' },
        'fa-bullseye': { he: 'מטרה / מיקוד', en: 'Target / Focus', ar: 'هدف / تركيز', ru: 'Цель / Фокус' },
        'fa-weight-hanging': { he: 'משקל כבד', en: 'Heavy Weight', ar: 'أوزان ثقيلة', ru: 'Тяжелый вес' }
    },

    // Pre-built Split Templates localized
    templates: {
        he: [
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
        ],

        en: [
            {
                id: 'ppl',
                title: 'Push / Pull / Legs (PPL)',
                description: 'The golden standard split – Push, Pull, and Legs (3 to 6 sessions per week)',
                days: [
                    { name: 'Push (Chest, Shoulders, Triceps)', icon: 'fa-dumbbell', color: '#06b6d4', schedule: 'Mon & Thu' },
                    { name: 'Pull (Back & Biceps)', icon: 'fa-arrows-up-down', color: '#10b981', schedule: 'Tue & Fri' },
                    { name: 'Legs & Core', icon: 'fa-person-running', color: '#f59e0b', schedule: 'Wed & Sat' }
                ]
            },
            {
                id: 'upper_lower',
                title: 'Upper / Lower Body Split',
                description: 'Balanced 4-day workout schedule alternating between upper and lower body',
                days: [
                    { name: 'Upper Body A', icon: 'fa-dumbbell', color: '#38bdf8', schedule: 'Upper workout Mon / Thu' },
                    { name: 'Lower Body B', icon: 'fa-person-running', color: '#ec4899', schedule: 'Lower workout Tue / Fri' }
                ]
            },
            {
                id: 'classic_3',
                title: 'Classic 3-Day Muscle Split',
                description: 'Traditional bodybuilding split across 3 targeted gym sessions',
                days: [
                    { name: 'Chest & Shoulders', icon: 'fa-dumbbell', color: '#06b6d4', schedule: 'Sunday or Monday' },
                    { name: 'Back & Biceps', icon: 'fa-arrows-up-down', color: '#10b981', schedule: 'Tuesday or Wednesday' },
                    { name: 'Legs & Triceps', icon: 'fa-person-running', color: '#f59e0b', schedule: 'Thursday or Friday' }
                ]
            },
            {
                id: 'weekdays_5',
                title: '5-Day Weekday Split',
                description: 'Dedicated focus each weekday from Monday through Friday',
                days: [
                    { name: 'Monday - Chest', icon: 'fa-dumbbell', color: '#38bdf8', schedule: 'Start of week' },
                    { name: 'Tuesday - Back', icon: 'fa-arrows-up-down', color: '#10b981', schedule: 'Midweek pull' },
                    { name: 'Wednesday - Legs', icon: 'fa-person-running', color: '#f59e0b', schedule: 'Leg day power' },
                    { name: 'Thursday - Shoulders', icon: 'fa-bolt', color: '#ec4899', schedule: 'Boulder shoulders' },
                    { name: 'Friday - Arms & Core', icon: 'fa-fire', color: '#8b5cf6', schedule: 'Weekend pump' }
                ]
            },
            {
                id: 'fbw',
                title: 'Full Body Workout (FBW)',
                description: 'High-frequency 2-3 full body sessions covering all major muscle groups',
                days: [
                    { name: 'Full Body Workout A', icon: 'fa-fire', color: '#10b981', schedule: 'Workout A (Mon/Tue)' },
                    { name: 'Full Body Workout B', icon: 'fa-bolt', color: '#06b6d4', schedule: 'Workout B (Thu/Fri)' }
                ]
            }
        ],

        ar: [
            {
                id: 'ppl',
                title: 'دفع / سحب / أرجل (PPL)',
                description: 'التقسيم الأكثر كفاءة وشهرة – تمرين الدفع، السحب والأرجل (3-6 أيام بالأسبوع)',
                days: [
                    { name: 'Push (صدر، أكتاف، ترايسبس)', icon: 'fa-dumbbell', color: '#06b6d4', schedule: 'الأحد والأربعاء' },
                    { name: 'Pull (ظهر وبايسبس)', icon: 'fa-arrows-up-down', color: '#10b981', schedule: 'الإثنين والخميس' },
                    { name: 'Legs (أرجل وبطن)', icon: 'fa-person-running', color: '#f59e0b', schedule: 'الثلاثاء والجمعة' }
                ]
            },
            {
                id: 'upper_lower',
                title: 'علوي / سفلي (Upper / Lower)',
                description: 'تقسيم 4 أيام أسبوعياً بالتبادل بين الجزء العلوي والسفلي للجسم',
                days: [
                    { name: 'الجزء العلوي (Upper Body)', icon: 'fa-dumbbell', color: '#38bdf8', schedule: 'تمرين علوي A / C' },
                    { name: 'الجزء السفلي (Lower Body)', icon: 'fa-person-running', color: '#ec4899', schedule: 'تمرين سفلي B / D' }
                ]
            },
            {
                id: 'classic_3',
                title: 'كلاسيكي 3 أيام (Arnold Split)',
                description: 'توزيع كلاسيكي متوازن للمجموعات العضلية على 3 أيام أسبوعياً',
                days: [
                    { name: 'صدر وأكتاف', icon: 'fa-dumbbell', color: '#06b6d4', schedule: 'يوم الأحد' },
                    { name: 'ظهر وبايسبس', icon: 'fa-arrows-up-down', color: '#10b981', schedule: 'يوم الثلاثاء' },
                    { name: 'أرجل وترايسبس', icon: 'fa-person-running', color: '#f59e0b', schedule: 'يوم الخميس' }
                ]
            },
            {
                id: 'weekdays_5',
                title: 'خمسة أيام أسبوعية (من الأحد للخميس)',
                description: 'تسمية مباشرة ومنظمة لكل يوم تدريبي خلال الأسبوع',
                days: [
                    { name: 'يوم الأحد', icon: 'fa-dumbbell', color: '#38bdf8', schedule: 'بداية الأسبوع' },
                    { name: 'يوم الإثنين', icon: 'fa-arrows-up-down', color: '#10b981', schedule: 'تمرين الإثنين' },
                    { name: 'يوم الثلاثاء', icon: 'fa-person-running', color: '#f59e0b', schedule: 'منتصف الأسبوع' },
                    { name: 'يوم الأربعاء', icon: 'fa-hand-back-fist', color: '#ec4899', schedule: 'تمرين الأربعاء' },
                    { name: 'يوم الخميس', icon: 'fa-fire', color: '#8b5cf6', schedule: 'ختام الأسبوع' }
                ]
            },
            {
                id: 'fbw',
                title: 'تمرين لكامل الجسم (Full Body)',
                description: '2-3 حصص أسبوعياً تشمل جميع العضلات الكبرى لنتائج سريعة',
                days: [
                    { name: 'تمرين A - شامل (صدر، ظهر، أرجل)', icon: 'fa-fire', color: '#10b981', schedule: 'الأحد' },
                    { name: 'تمرين B - شامل (أكتاف، ذراعين، بطن)', icon: 'fa-bolt', color: '#06b6d4', schedule: 'الأربعاء' }
                ]
            }
        ],

        ru: [
            {
                id: 'ppl',
                title: 'Жим / Тяга / Ноги (PPL)',
                description: 'Золотой стандарт сплита – толчковые, тяговые и день ног (3-6 раз в неделю)',
                days: [
                    { name: 'Жим (Грудь, плечи, трицепс)', icon: 'fa-dumbbell', color: '#06b6d4', schedule: 'Пн и Чт' },
                    { name: 'Тяга (Спина и бицепс)', icon: 'fa-arrows-up-down', color: '#10b981', schedule: 'Вт и Пт' },
                    { name: 'Ноги и пресс', icon: 'fa-person-running', color: '#f59e0b', schedule: 'Ср и Сб' }
                ]
            },
            {
                id: 'upper_lower',
                title: 'Верх / Низ тела (Upper / Lower)',
                description: 'Сбалансированная 4-дневная программа: чередование верха и низа тела',
                days: [
                    { name: 'Верх тела (Upper Body)', icon: 'fa-dumbbell', color: '#38bdf8', schedule: 'Пн / Чт' },
                    { name: 'Низ тела (Lower Body)', icon: 'fa-person-running', color: '#ec4899', schedule: 'Вт / Пт' }
                ]
            },
            {
                id: 'classic_3',
                title: 'Классический 3-дневный сплит',
                description: 'Традиционное распределение групп мышц на 3 целевые тренировки в неделю',
                days: [
                    { name: 'Грудь и плечи', icon: 'fa-dumbbell', color: '#06b6d4', schedule: 'Понедельник' },
                    { name: 'Спина и бицепс', icon: 'fa-arrows-up-down', color: '#10b981', schedule: 'Среда' },
                    { name: 'Ноги и трицепс', icon: 'fa-person-running', color: '#f59e0b', schedule: 'Пятница' }
                ]
            },
            {
                id: 'weekdays_5',
                title: '5 дней недели (Пн - Пт)',
                description: 'Четкий фокус на каждую группу мышц по рабочим дням недели',
                days: [
                    { name: 'Понедельник - Грудь', icon: 'fa-dumbbell', color: '#38bdf8', schedule: 'Старт недели' },
                    { name: 'Вторник - Спина', icon: 'fa-arrows-up-down', color: '#10b981', schedule: 'Тяга спины' },
                    { name: 'Среда - Ноги', icon: 'fa-person-running', color: '#f59e0b', schedule: 'Мощь ног' },
                    { name: 'Четверг - Плечи', icon: 'fa-bolt', color: '#ec4899', schedule: 'Плечевой пояс' },
                    { name: 'Пятница - Руки и пресс', icon: 'fa-fire', color: '#8b5cf6', schedule: 'Финал недели' }
                ]
            },
            {
                id: 'fbw',
                title: 'Фулбоди / Все тело (Full Body)',
                description: '2-3 тренировки в неделю, прорабатывающие все тело за занятие',
                days: [
                    { name: 'Тренировка А (Грудь, Спина, Ноги)', icon: 'fa-fire', color: '#10b981', schedule: 'Понедельник' },
                    { name: 'Тренировка Б (Плечи, Руки, Пресс)', icon: 'fa-bolt', color: '#06b6d4', schedule: 'Четверг' }
                ]
            }
        ]
    },

    // Demo machines for each language
    demoMachines: {
        he: [
            { name: 'לחיצת חזה במכונה (Chest Press)', seat: 'מושב בגובה 4, ידיות בקו פטמות', notes: 'להצמיד שכמות אחורה, מרפקים ב-45 מעלות, לשלוט בירידה', dayIdx: 0, weight: 50, sets: 3, reps: 10 },
            { name: 'לחיצת כתפיים בישיבה (Shoulder Press)', seat: 'משענת ב-80 מעלות, גובה 3', notes: 'דחיפה מעלה בלי לנעול מרפקים, בטן מוחזקת', dayIdx: 0, weight: 35, sets: 3, reps: 10 },
            { name: 'פרפר במכונה (Pec Deck Flyes)', seat: 'מושב גובה 5, מרפקים מעט כפופים', notes: 'כיווץ מודגש לשנייה במרכז, פתיחה איטית ומבוקרת', dayIdx: 0, weight: 45, sets: 3, reps: 12 },
            { name: 'פולי עליון באחיזה רחבה (Lat Pulldown)', seat: 'כריות ירך צמודות, מוט רחב', notes: 'משיכה לכיוון החזה העליון, כיווץ שכמות בסוף המשיכה', dayIdx: 1, weight: 55, sets: 4, reps: 12 },
            { name: 'לחיצת רגליים בשיפוע (Leg Press)', seat: 'רגליים ברוחב כתפיים במרכז הפלטה', notes: 'לא לנעול ברכיים בסיום היישור, לרדת עד 90 מעלות', dayIdx: 2, weight: 120, sets: 4, reps: 12 },
            { name: 'פשיטת ברכיים במכונה (Leg Extension)', seat: 'גליל על הקרסול, משענת צמודה', notes: 'הרמה מבוקרת, החזקה קצרה למעלה וירידה איטית', dayIdx: 2, weight: 50, sets: 3, reps: 12 }
        ],
        en: [
            { name: 'Machine Chest Press', seat: 'Seat at pin 4, handles at mid-chest', notes: 'Retract scapula, elbows at 45 degrees, slow eccentric lowering', dayIdx: 0, weight: 50, sets: 3, reps: 10 },
            { name: 'Seated Shoulder Press', seat: 'Backrest 80°, height pin 3', notes: 'Press up without locking elbows, brace core firmly', dayIdx: 0, weight: 35, sets: 3, reps: 10 },
            { name: 'Pec Deck Machine Flyes', seat: 'Seat height 5, slight bend in elbows', notes: 'Squeeze chest hard at the center for 1 second, controlled opening', dayIdx: 0, weight: 45, sets: 3, reps: 12 },
            { name: 'Wide-Grip Lat Pulldown', seat: 'Thigh pads snug, wide bar grip', notes: 'Pull bar to upper chest, squeeze lats and scapulae together', dayIdx: 1, weight: 55, sets: 4, reps: 12 },
            { name: 'Incline Leg Press 45°', seat: 'Feet shoulder-width apart in the center', notes: 'Never hyperextend knees at top, lower to 90 degrees', dayIdx: 2, weight: 120, sets: 4, reps: 12 },
            { name: 'Seated Leg Extension', seat: 'Pad right on top of ankles, back firmly against seat', notes: 'Controlled squeeze at top, 2 second slow descent', dayIdx: 2, weight: 50, sets: 3, reps: 12 }
        ],
        ar: [
            { name: 'جهاز ضغط الصدر (Machine Chest Press)', seat: 'المقعد على رقم 4، المقابض بمحاذاة منتصف الصدر', notes: 'تثبيت لوحي الكتف للخلف، ثني الكوعين 45 درجة، والنزول ببطء وتحكم', dayIdx: 0, weight: 50, sets: 3, reps: 10 },
            { name: 'ضغط الأكتاف بالماكينة (Shoulder Press)', seat: 'مسند الظهر 80 درجة، الارتفاع 3', notes: 'دفع الوزن للأعلى دون قفل المرفقين، شد عضلات البطن', dayIdx: 0, weight: 35, sets: 3, reps: 10 },
            { name: 'فراشة الصدر (Pec Deck Flyes)', seat: 'ارتفاع المقعد 5، انحناء بسيط في المرفقين', notes: 'عصر الصدر بقوة لمدة ثانية في المنتصف والفتح ببطء', dayIdx: 0, weight: 45, sets: 3, reps: 12 },
            { name: 'سحب علوي للظهر (Lat Pulldown)', seat: 'تثبيت وسائد الفخذين بإحكام، قبضة عريضة', notes: 'سحب البار لأعلى الصدر، عصر عضلات الظهر السفلية', dayIdx: 1, weight: 55, sets: 4, reps: 12 },
            { name: 'مكبس الأرجل المائل (Leg Press 45°)', seat: 'القدمان باتساع الكتفين في منتصف اللوح', notes: 'عدم قفل الركبتين عند الصعود، والنزول بزاوية 90 درجة', dayIdx: 2, weight: 120, sets: 4, reps: 12 },
            { name: 'مد الأرجل بالماكينة (Leg Extension)', seat: 'الوسادة فوق الكاحل مباشرة، الظهر ملاصق للمسند', notes: 'رفع محكم مع ثبات لمدة ثانية في الأعلى والنزول ببطء', dayIdx: 2, weight: 50, sets: 3, reps: 12 }
        ],
        ru: [
            { name: 'Жим от груди в тренажере (Chest Press)', seat: 'Сиденье на 4, рукояти на уровне груди', notes: 'Свести лопатки, локти под 45 градусов, контролируемое опускание', dayIdx: 0, weight: 50, sets: 3, reps: 10 },
            { name: 'Жим на плечи сидя (Shoulder Press)', seat: 'Спинка 80 градусов, высота 3', notes: 'Жим вверх без блокировки локтей, мышцы кора напряжены', dayIdx: 0, weight: 35, sets: 3, reps: 10 },
            { name: 'Сведение рук в тренажере Бабочка (Pec Deck)', seat: 'Сиденье на 5, локти чуть согнуты', notes: 'Пиковое сокращение на 1 секунду, медленное растяжение', dayIdx: 0, weight: 45, sets: 3, reps: 12 },
            { name: 'Верхняя тяга широким хватом (Lat Pulldown)', seat: 'Валики плотно к бедрам, широкий хват', notes: 'Тяга к верху груди, сведение лопаток в нижней точке', dayIdx: 1, weight: 55, sets: 4, reps: 12 },
            { name: 'Жим ногами под углом 45° (Leg Press)', seat: 'Стопы на ширине плеч по центру платформы', notes: 'Не выпрямлять колени до конца, опускать до 90 градусов', dayIdx: 2, weight: 120, sets: 4, reps: 12 },
            { name: 'Разгибание ног сидя (Leg Extension)', seat: 'Валик на уровне лодыжек, спина прижата', notes: 'Фиксация в верхней точке на 1 сек, медленный спуск', dayIdx: 2, weight: 50, sets: 3, reps: 12 }
        ]
    },

    // Get a translated string by key with optional replacements
    t(key, replacements = {}) {
        const lang = this.currentLang || this.defaultLang;
        const dict = this.translations[lang] || this.translations[this.defaultLang];
        let text = dict[key] || this.translations['en'][key] || this.translations['he'][key] || key;

        for (const [k, v] of Object.entries(replacements)) {
            text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
        }
        return text;
    },

    getTemplates() {
        const lang = this.currentLang || this.defaultLang;
        return this.templates[lang] || this.templates['en'] || this.templates['he'];
    },

    getIconLabel(iconClass) {
        const lang = this.currentLang || this.defaultLang;
        const iconData = this.icons[iconClass];
        if (iconData && iconData[lang]) return iconData[lang];
        if (iconData && iconData['en']) return iconData['en'];
        return 'Icon';
    },

    getDemoMachines() {
        const lang = this.currentLang || this.defaultLang;
        return this.demoMachines[lang] || this.demoMachines['en'] || this.demoMachines['he'];
    },

    formatDate(dateObj, options = { day: '2-digit', month: '2-digit', year: 'numeric' }) {
        const langMeta = this.languages[this.currentLang] || this.languages[this.defaultLang];
        try {
            return new Date(dateObj).toLocaleDateString(langMeta.locale, options);
        } catch {
            return new Date(dateObj).toLocaleDateString(undefined, options);
        }
    },

    // Set active language and apply to DOM
    setLanguage(langCode) {
        if (!this.languages[langCode]) {
            langCode = this.defaultLang;
        }
        this.currentLang = langCode;
        localStorage.setItem('gym_lang', langCode);

        const langMeta = this.languages[langCode];
        document.documentElement.lang = langCode;
        document.documentElement.dir = langMeta.dir;

        // Apply translations to all DOM elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            el.textContent = this.t(key);
        });

        // Apply placeholders
        document.querySelectorAll('[data-i18n-ph]').forEach(el => {
            const key = el.dataset.i18nPh;
            el.placeholder = this.t(key);
        });

        // Apply titles
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.dataset.i18nTitle;
            el.title = this.t(key);
        });

        document.querySelectorAll('[data-i18n-set]').forEach(el => {
            el.textContent = this.t('log_set_n', { n: el.dataset.i18nSet });
        });

        // Update active flags & indicators
        const currentLangLabel = document.getElementById('current-lang-code');
        if (currentLangLabel) {
            currentLangLabel.textContent = langMeta.short;
        }
        const currentLangFlag = document.getElementById('current-lang-flag');
        if (currentLangFlag) {
            currentLangFlag.textContent = langMeta.flag;
        }

        document.querySelectorAll('.lang-option-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === langCode);
        });
        document.querySelectorAll('.lang-choice-card').forEach(card => {
            card.classList.toggle('active', card.dataset.lang === langCode);
        });
    },

    // Init language from storage or browser preference
    init() {
        let saved = localStorage.getItem('gym_lang');
        if (!saved || !this.languages[saved]) {
            const browserLang = (navigator.language || 'he').toLowerCase();
            if (browserLang.startsWith('en')) saved = 'en';
            else if (browserLang.startsWith('ar')) saved = 'ar';
            else if (browserLang.startsWith('ru')) saved = 'ru';
            else saved = 'he';
        }
        this.setLanguage(saved);
    }
};

window.I18N = I18N;
