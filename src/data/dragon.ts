// Sicilian Dragon Opening Lines
// Black plays 1...c5 with ...g6 fianchetto. Repertoire based firmly on Anish Giri's "The Dragon Sicilian"
import type { OpeningLine } from './londonSystem';

export const dragonLines: OpeningLine[] = [
  {
    id: 'dragon-giri-1',
    name: 'Yugoslav Attack: 9.Bc4 overview',
    chapter: 'Yugoslav Attack',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'f3', 'O-O', 'Qd2', 'Nc6', 'Bc4', 'Bd7', 'O-O-O'],
    annotations: {
      16: '9.Bc4 is the main line of the Yugoslav Attack, preventing Black\'s central ...d5 break.',
      17: '...Bd7 - preparing queenside counterplay. The stage is set for the main battle.',
    },
  },
  {
    id: 'dragon-giri-2',
    name: 'Yugoslav Attack with 9.Bc4 Nxd4',
    chapter: 'Yugoslav Attack',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'f3', 'O-O', 'Qd2', 'Nc6', 'Bc4', 'Nxd4', 'Bxd4', 'Be6'],
    annotations: {
      17: '9...Nxd4! Giri\'s pragmatic choice. Black sidesteps the main lines (often requiring massive memorization) for a solid, engine-approved path.',
      19: '...Be6 aiming to exchange White\'s strong dark-squared bishop or transition into a safe endgame.',
    },
  },
  {
    id: 'dragon-giri-3',
    name: 'Dragon main line 9.0-0-0 d5: tenth move sidelines',
    chapter: 'Dragon main line 9.0-0-0 d5',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'f3', 'O-O', 'Qd2', 'Nc6', 'O-O-O', 'd5', 'Qe1', 'e5', 'Nxc6', 'bxc6'],
    annotations: {
      16: 'When White omits Bc4 and castles long, Black immediately strikes with 9...d5!',
      18: '10.Qe1 is a common sideline instead of taking on d5.',
      19: '...e5! Seizing space and kicking the knight.',
    },
  },
  {
    id: 'dragon-giri-4',
    name: 'Dragon main line 9.0-0-0 d5: 10.exd5',
    chapter: 'Dragon main line 9.0-0-0 d5',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'f3', 'O-O', 'Qd2', 'Nc6', 'O-O-O', 'd5', 'exd5', 'Nxd5', 'Nxc6', 'bxc6', 'Nxd5', 'cxd5', 'Qxd5', 'Qc7'],
    annotations: {
      17: '9...d5! The thematic central counter-strike.',
      19: '10...Nxd5 is standard here. White typically exchanges on c6 and d5.',
      25: '...Qc7. Black sacrifices a pawn but gains enormous compensation via the bishop pair and open files to attack White\'s king.',
    },
  },
  {
    id: 'dragon-giri-5',
    name: 'The early 9.g4',
    chapter: 'The early 9.g4',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'f3', 'O-O', 'Qd2', 'Nc6', 'g4', 'Nxd4', 'Bxd4', 'Be6'],
    annotations: {
      16: '9.g4 - White goes for an immediate pawn storm.',
      17: '...Nxd4 is Giri\'s consistent approach to these positions, maintaining solidity.',
    },
  },
  {
    id: 'dragon-giri-6',
    name: 'Classical System: 6.Be2',
    chapter: 'Classical System',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be2', 'Bg7', 'O-O', 'O-O', 'Be3', 'Nc6', 'Nb3', 'Be6'],
    annotations: {
      10: '6.Be2 - The Classical Variation. White aims for a quieter, positional game.',
      15: '...Nc6 developing naturally.',
      17: '...Be6 preparing queenside action.',
    },
  },
  {
    id: 'dragon-giri-7',
    name: 'Fianchetto System: 6.g3',
    chapter: 'Fianchetto System',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'g3', 'Nc6', 'Nde2', 'Bg7', 'Bg2', 'O-O', 'O-O', 'Rb8'],
    annotations: {
      10: '6.g3 - The Fianchetto System, a very solid approach for White.',
      13: '...Bg7 continuing typical Dragon development.',
      17: '...Rb8 preparing queenside expansion with ...b5.',
    },
  },
  {
    id: 'dragon-giri-8',
    name: 'Levenfish System: 6.f4',
    chapter: 'Levenfish System',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'f4', 'Nc6', 'Nxc6', 'bxc6', 'e5', 'Nd7', 'exd6', 'exd6'],
    annotations: {
      10: '6.f4 is the highly aggressive Levenfish Attack, trying to pose immediate central problems.',
      11: '...Nc6 is Black\'s best bet, meeting the center head-on.',
      17: '...exd6 Black handles the early central complications and gets a very playable position.',
    },
  },
  {
    id: 'dragon-giri-9',
    name: '6.Bc4 System',
    chapter: '6.Bc4 System',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Bc4', 'Bg7', 'O-O', 'O-O', 'Bb3', 'Nc6', 'h3', 'Nxd4'],
    annotations: {
      10: '6.Bc4 without an early Be3 or f3. White tries to combine Bc4 with O-O.',
      17: '...Nxd4 continuing the practical approach, clarifying the center.',
    },
  },
  {
    id: 'dragon-giri-10',
    name: 'Sixth move sidelines',
    chapter: 'Sixth move sidelines',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Bg5', 'Bg7', 'Qd2', 'h6', 'Bh4', 'Nc6', 'O-O-O', 'O-O'],
    annotations: {
      10: '6.Bg5 is the most notable sideline here, aiming to bypass standard Dragon theory.',
      13: '...h6 immediately putting the question to the bishop.',
      17: '...O-O Black achieves a solid setup.',
    },
  },
  {
    id: 'dragon-giri-11',
    name: 'Move orders & Accelerated Dragon',
    chapter: 'Move orders & Accelerated',
    moves: ['e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'g6', 'c4', 'Nf6', 'Nc3', 'd6'],
    annotations: {
      7: '...g6 immediately, using the Accelerated Dragon move order.',
      8: '5.c4 - The Maroczy Bind is the critical test here.',
      11: '...d6 transposes into standard bind structures where Giri recommends specific active plans.',
    },
  },
  {
    id: 'dragon-giri-12',
    name: 'Dragodorf: bonus chapter',
    chapter: 'Dragodorf',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'a6', 'f3', 'b5', 'Qd2', 'Bb7'],
    annotations: {
      11: '9...a6 is the hallmark of the Dragodorf, blending the Dragon (g6) with Najdorf ideas.',
      13: '...b5 launching an immediate queenside counter-attack.',
    },
  },
  {
    id: 'dragon-giri-13',
    name: 'The system with 5.f3',
    chapter: 'The system with 5.f3',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'f3', 'e5', 'Nb3', 'd5', 'Bg5', 'd4', 'c3', 'Nc6'],
    annotations: {
      8: '5.f3 White solidifies e4 before developing the knight to c3.',
      9: '...e5 grabbing space.',
      11: '...d5! an excellent central break while White is still setting up.',
    },
  },
  {
    id: 'dragon-giri-14',
    name: 'The queen recapture: 4.Qxd4',
    chapter: 'The queen recapture: 4.Qxd4',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Qxd4', 'Nc6', 'Bb5', 'Bd7', 'Bxc6', 'Bxc6', 'Nc3', 'Nf6', 'Bg5', 'e6'],
    annotations: {
      6: '4.Qxd4 completely sidesteps the open Sicilian mainlines.',
      7: '...Nc6 developing with a tempo on the queen.',
      11: '...Bxc6 Black obtains the bishop pair in a solid position.',
    },
  },
];

export const dragonInfo = {
  name: 'The Dragon Sicilian',
  color: 'black' as const,
  eco: 'B70-B79',
  description: 'A "Take-No-Prisoners" Repertoire Versus 1.e4 by Anish Giri. Features the pragmatic 9...Nxd4 against the Yugoslav Attack to sidestep immense theory, dynamic counters to 9.O-O-O with 9...d5, and deep coverage of all major Anti-Dragon systems including Classical, Fianchetto, and Levenfish setups.',
  keyMoves: '1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6',
  themes: [
    'Pragmatic 9...Nxd4 in Yugoslav to avoid complex theory',
    'Immediate 9...d5 strike against 9.O-O-O setups',
    'Solid development in Fianchetto and Classical lines',
    'Comprehensive solutions against all anti-Sicilians'
  ],
  chapters: [
    'Yugoslav Attack',
    'Dragon main line 9.0-0-0 d5',
    'The early 9.g4',
    'Classical System',
    'Fianchetto System',
    'Levenfish System',
    '6.Bc4 System',
    'Sixth move sidelines',
    'Move orders & Accelerated',
    'Dragodorf',
    'The system with 5.f3',
    'The queen recapture: 4.Qxd4'
  ],
};
