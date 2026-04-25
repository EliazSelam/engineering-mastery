import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Renders a LaTeX expression to an HTML string for use with dangerouslySetInnerHTML.
 */
export const tex = (expr: string) => {
  try {
    return { 
      __html: katex.renderToString(expr, { 
        throwOnError: false,
        displayMode: false 
      }) 
    };
  } catch (error) {
    console.error('KaTeX rendering error:', error);
    return { __html: expr };
  }
};

/**
 * Renders a LaTeX expression to an HTML string in display mode (centered, larger).
 */
export const texDisplay = (expr: string) => {
  try {
    return { 
      __html: katex.renderToString(expr, { 
        throwOnError: false,
        displayMode: true 
      }) 
    };
  } catch (error) {
    console.error('KaTeX rendering error:', error);
    return { __html: expr };
  }
};
