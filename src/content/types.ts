export interface DayContent {
  day: number;
  title: string;
  category: 'בקרה' | 'הניע חשמלי' | 'DSP' | 'אלגוריתמים' | 'קוונטי' | 'מבוא' | 'פרויקט' | 'רובוטיקה';
  level: 'מתחיל' | 'בינוני' | 'מתקדם';
  duration_min: number;

  hero: {
    emoji?: string;
    badge: string;
    subtitle: string;
    why_today: string;
    prepares_for: string;
  };

  sections: {
    background: {
      problem: string;
      real_world: { icon: string; name: string; sensor: string }[];
      key_ideas: { number: string; title: string; desc: string }[];
    };
    theory: {
      diagram: string;
      key_equation: { latex: string; explanation: string };
      tradeoff: { pro: string; pro_label: string; con: string; con_label: string };
    };
    simulation: {
      component: string;
      intuition: string;
    };
    challenge: {
      questions: {
        id: number;
        question: string;
        options: { id: 'a'|'b'|'c'|'d'; text: string; correct: boolean }[];
        explanation: string;
        formula?: string;
      }[];
    };
    summary: {
      points: { text: string; tag: string }[];
      misconceptions: { myth: string; truth: string }[];
      next_day: { title: string; desc: string };
    };
    summary_extended?: {
      overview: string;          // פסקת מבוא אקדמית
      theory_deep: string;       // הסבר תיאורטי מלא + נוסחאות (markdown + LaTeX)
      worked_example: string;    // דוגמה מחושבת צעד-אחר-צעד
      applications: string[];    // 3 יישומים תעשייתיים
      further_reading: string[]; // מקורות / נושאים להמשך
    };
  };

  meta: {
    estimated_complexity: 1 | 2 | 3 | 4 | 5;
    prerequisites: number[];
    tags: string[];
  };
}
