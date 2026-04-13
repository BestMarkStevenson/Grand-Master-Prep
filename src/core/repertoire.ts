// Repertoire Manager — bridges opening data with SRS
import { londonSystemLines, londonSystemInfo } from '../data/londonSystem';
import { dragonLines, dragonInfo } from '../data/dragon';
import { italianLines, italianInfo } from '../data/italian';
import { ruyLopezLines, ruyLopezInfo } from '../data/ruyLopez';
import { caroKannLines, caroKannInfo } from '../data/caroKann';
import { semiSlavLines, semiSlavInfo } from '../data/semiSlav';
import { modernLines, modernInfo } from '../data/modern';
import { SpacedRepetition } from './spaced-repetition';
import type { OpeningLine } from '../data/londonSystem';

export interface Opening {
  id: string;
  name: string;
  color: 'white' | 'black';
  eco: string;
  description: string;
  keyMoves: string;
  themes: string[];
  chapters: string[];
  lines: OpeningLine[];
}

export class RepertoireManager {
  private srs: SpacedRepetition;
  private openings: Opening[];

  constructor(srs: SpacedRepetition) {
    this.srs = srs;
    this.openings = [
      { ...londonSystemInfo, id: 'london', lines: londonSystemLines },
      { ...dragonInfo, id: 'dragon', lines: dragonLines },
      { ...italianInfo, id: 'italian', lines: italianLines },
      { ...ruyLopezInfo, id: 'ruy-lopez', lines: ruyLopezLines },
      { ...caroKannInfo, id: 'caro-kann', lines: caroKannLines },
      { ...semiSlavInfo, id: 'semi-slav', lines: semiSlavLines },
      { ...modernInfo, id: 'modern', lines: modernLines },
    ];
    // Initialize SRS cards for all lines
    const allIds = this.getAllLines().map(l => l.id);
    this.srs.initializeCards(allIds);
  }

  getOpenings(): Opening[] {
    return this.openings;
  }

  getOpening(id: string): Opening | undefined {
    return this.openings.find(o => o.id === id);
  }

  getAllLines(): OpeningLine[] {
    return this.openings.flatMap(o => o.lines);
  }

  getLinesByOpening(openingId: string): OpeningLine[] {
    const opening = this.getOpening(openingId);
    return opening ? opening.lines : [];
  }

  getLinesByChapter(openingId: string, chapter: string): OpeningLine[] {
    return this.getLinesByOpening(openingId).filter(l => l.chapter === chapter);
  }

  getLine(lineId: string): OpeningLine | undefined {
    return this.getAllLines().find(l => l.id === lineId);
  }

  getDueLines(): OpeningLine[] {
    const dueCards = this.srs.getDueCards();
    return dueCards.map(c => this.getLine(c.lineId)).filter(Boolean) as OpeningLine[];
  }

  getNewLines(): OpeningLine[] {
    const newCards = this.srs.getNewCards();
    return newCards.map(c => this.getLine(c.lineId)).filter(Boolean) as OpeningLine[];
  }

  getOpeningForLine(lineId: string): Opening | undefined {
    return this.openings.find(o => o.lines.some(l => l.id === lineId));
  }
}
