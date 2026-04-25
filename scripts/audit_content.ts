
import { DAYS } from '../src/content/days';
import fs from 'fs';
import path from 'path';

console.log('--- T1: Content Integrity ---');
const ids = DAYS.map(d => d.day);
console.log('Total days:', DAYS.length);
console.log('Unique IDs:', new Set(ids).size);
const missingDays = [...Array(30)].map((_,i)=>i+1).filter(n => !ids.includes(n));
console.log('Missing days 1-30:', missingDays);
const duplicates = ids.filter((id,i) => ids.indexOf(id) !== i);
console.log('Duplicates:', duplicates);
console.log('Days without summary_extended:', DAYS.filter(d => !d.sections.summary_extended).map(d => d.day));

const missingFields = DAYS.filter(d => 
  !d.title || !d.hero || !d.sections?.background || !d.sections?.theory || 
  !d.sections?.simulation || !d.sections?.challenge || !d.sections?.summary
).map(d => d.day);
console.log('Days missing required fields:', missingFields);

const challengeCounts = DAYS.map(d => ({day: d.day, q: d.sections.challenge?.questions?.length ?? 0})).filter(x => x.q < 3);
console.log('Challenge question counts (< 3):', challengeCounts);

console.log('\n--- T2: Simulations and Diagrams Mapping ---');
const dayPagePath = path.resolve(process.cwd(), 'src/pages/DayPage.tsx');
if (fs.existsSync(dayPagePath)) {
    const dp = fs.readFileSync(dayPagePath, 'utf-8');
    
    // Improved regex to find component keys in the objects
    const simComponentsMatch = dp.match(/const SIMULATION_COMPONENTS: Record<string, React\.ComponentType<any>> = \{([\s\S]*?)\};/);
    const diagramComponentsMatch = dp.match(/const DIAGRAM_COMPONENTS: Record<string, React\.ComponentType<any>> = \{([\s\S]*?)\};/);

    const simKeys = simComponentsMatch ? simComponentsMatch[1].split(',').map(s => s.trim().split(':')[0].trim()).filter(Boolean) : [];
    const diagKeys = diagramComponentsMatch ? diagramComponentsMatch[1].split(',').map(s => s.trim().split(':')[0].trim()).filter(Boolean) : [];

    const referencedSims = DAYS.map(d => d.sections.simulation.component);
    const referencedDiagrams = DAYS.map(d => d.sections.theory.diagram).filter(Boolean);

    const missingSims = [...new Set(referencedSims)].filter(s => !simKeys.includes(s));
    const missingDiags = [...new Set(referencedDiagrams)].filter(d => !diagKeys.includes(d));

    console.log('Sims referenced but missing from SIMULATION_COMPONENTS:', missingSims);
    console.log('Diagrams referenced but missing from DIAGRAM_COMPONENTS:', missingDiags);
} else {
    console.log('DayPage.tsx not found at', dayPagePath);
}
