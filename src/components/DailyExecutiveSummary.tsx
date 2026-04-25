import React, { useRef } from 'react';
import { cn } from '@/src/lib/utils';
import { FileText, Download, Share2, Bookmark } from 'lucide-react';

export default function DailyExecutiveSummary() {
  const summaryRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!summaryRef.current) return;
    
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);

      const canvas = await (html2canvas as any)(summaryRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('engineer-daily-summary.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('חלה שגיאה ביצירת ה-PDF. נא לנסות שוב.');
    }
  };

  return (
    <div className="bg-[hsl(var(--color-surface))] border border-[hsl(var(--color-border))] rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-[hsl(var(--color-text))] p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText size={20} />
          <h3 className="font-bold">סיכום מנהלים יומי — יום 1</h3>
        </div>
        <div className="flex gap-2">
          <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="שמור למועדפים">
            <Bookmark size={16} />
          </button>
          <button 
            onClick={downloadPDF}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" 
            title="הורד כ-PDF"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      <div ref={summaryRef} className="p-8 prose prose-sm max-w-none text-[hsl(var(--color-text-muted))] leading-relaxed text-right bg-white">
        <h4 className="text-[hsl(var(--color-text))] font-bold text-lg mb-4 border-b pb-2">תמצית הנדסית: לולאת בקרה סגורה</h4>
        
        <p>
          היום התמקדנו באבן היסוד של הנדסת המערכות: <strong>המשוב (Feedback)</strong>. בניגוד ללולאה פתוחה, שבה פקודה נשלחת ללא בדיקת תוצאות, לולאה סגורה יוצרת דיאלוג מתמיד בין הרצוי למצוי. חקרנו כיצד השגיאה (Error) היא למעשה ה"דלק" שמניע את המערכת — ללא שגיאה, לבקר אין סיבה לפעול.
        </p>

        <div className="my-6 bg-[hsl(var(--color-surface-2))] p-4 rounded-xl border-r-4 border-[hsl(var(--color-primary))]">
          <h5 className="text-[hsl(var(--color-primary))] font-bold mb-2">תובנות מהסימולציה:</h5>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>רווח פרופורציונלי (Kp):</strong> ראינו שהגדלת הרווח מאיצה את התגובה ומקטינה את השגיאה, אך מחיר היציבות כבד — Kp גבוה מדי מוביל לתנודות (Oscillations) שעלולות להרוס את המערכת הפיזיקלית.</li>
            <li><strong>דחיית הפרעות:</strong> נוכחנו לדעת שלולאה סגורה יודעת "להילחם" בשינויים חיצוניים (כמו חיכוך מוגבר) ולשמור על יציבות, תכונה שאינה קיימת במערכות ללא משוב.</li>
          </ul>
        </div>

        <p>
          למדנו את ה-Trade-off הקלאסי של המהנדס: הרצון להגיב מהר ולהיות מדויק מתנגש עם הרגישות לרעש בחיישנים והסיכון לאי-יציבות. פונקציית המעבר שפיתחנו, <code>T(s) = CG / (1 + CGH)</code>, היא הכלי המתמטי שמאפשר לנו לחזות את ההתנהגות הזו עוד לפני שבנינו את האב-טיפוס הראשון.
        </p>

        <h5 className="text-[hsl(var(--color-text))] font-bold mt-6 mb-2">שורה תחתונה לקריירה:</h5>
        <p className="italic bg-[hsl(var(--color-pastel-teal))] p-3 rounded-lg text-[hsl(var(--color-primary))] font-medium">
          מהנדס טוב לא שואל רק "איך המערכת עובדת?", אלא "איך היא מתקנת את עצמה כשמשהו משתבש?".
        </p>
      </div>
      
      <div className="bg-[hsl(var(--color-surface-2))] p-4 border-t border-[hsl(var(--color-border))] flex justify-center">
        <button className="flex items-center gap-2 text-xs font-bold text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--color-primary))] transition-colors">
          <Share2 size={14} />
          שתף סיכום עם עמיתים
        </button>
      </div>
    </div>
  );
}
