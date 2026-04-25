const translations = {
  he: {
    home: "דף הבית",
    lesson: "שיעור",
    plan: "תוכנית",
    settings: "הגדרות",
    feedback: "משוב",
    history: "היסטוריה",
    start_learning: "התחל ללמוד",
    continue_learning: "המשך ללמוד",
    completed: "הושלם",
    daily_streak: "ימים רצופים",
    current_day: "יום נוכחי",
    next_lesson: "השיעור הבא",
    mastery_level: "רמת שליטה",
    time_spent: "זמן למידה",
    recall_alert: "יש חומר לחזור עליו!",
    lesson_completed: "סיימת את השיעור!",
    total_time: "זמן כולל",
  },
  en: {
    home: "Home",
    lesson: "Lesson",
    plan: "Plan",
    settings: "Settings",
    feedback: "Feedback",
    history: "History",
    start_learning: "Start Learning",
    continue_learning: "Continue Learning",
    completed: "Completed",
    daily_streak: "Daily Streak",
    current_day: "Current Day",
    next_lesson: "Next Lesson",
    mastery_level: "Mastery Level",
    time_spent: "Time Spent",
    recall_alert: "Time for review!",
    lesson_completed: "Lesson Completed!",
    total_time: "Total Time",
  }
};

export type Language = keyof typeof translations;

export function getTranslation(lang: Language = 'he') {
  return translations[lang];
}
