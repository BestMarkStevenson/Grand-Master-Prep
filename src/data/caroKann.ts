import type { OpeningLine } from './londonSystem';

export const caroKannLines: OpeningLine[] = [
  {
    id: 'caro-advance-1',
    name: 'Advance Variation (Short)',
    chapter: 'Advance Variation',
    moves: ['e4', 'c6', 'd4', 'd5', 'e5', 'Bf5', 'Nf3', 'e6', 'Be2', 'c5', 'Be3', 'cxd4', 'Nxd4', 'Ne7', 'O-O', 'Nbc6', 'c4'],
    annotations: {
      1: 'The Caro-Kann! Black prepares to contest the center with d5 while keeping the light-squared bishop unblocked.',
      4: 'e5! The Advance variation. White claims a significant spatial advantage in the center.',
      5: 'Bf5 successfully develops the bishop BEFORE playing e6 (the main point of the Caro-Kann over the French).',
      8: 'Be2 (the Short Variation). White plays solidly, aiming for central stability rather than immediate tactical mayhem.',
      9: 'c5! Black immediately strikes at the base of White\'s pawn chain.',
      16: 'c4 challenges Black\'s setup, breaking open the center.',
    },
  },
  {
    id: 'caro-classical-1',
    name: 'Classical (Capablanca) Variation',
    chapter: 'Classical Variation',
    moves: ['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Bf5', 'Ng3', 'Bg6', 'h4', 'h6', 'Nf3', 'Nd7', 'h5', 'Bh7', 'Bd3', 'Bxd3', 'Qxd3', 'e6', 'Bf4', 'Ngf6', 'O-O-O', 'Be7', 'Ne4'],
    annotations: {
      4: 'Nc3. The Classical approach, supporting the center.',
      7: 'Bf5 (The Capablanca Variation). Black develops the bishop with tempo on the knight.',
      10: 'h4! White tries to trap the bishop with h5.',
      11: 'h6 gives the bishop a retreat square on h7.',
      14: 'h5 fixes the pawn structure on the kingside and restricts Black.',
      16: 'Bd3 forces the trade of Black\'s prized light-squared bishop.',
      22: 'O-O-O leads to opposite-side castling and sharp attacking chances.',
    },
  },
  {
    id: 'caro-exchange-1',
    name: 'Exchange Variation (Carlsbad)',
    chapter: 'Exchange Variation',
    moves: ['e4', 'c6', 'd4', 'd5', 'exd5', 'cxd5', 'Bd3', 'Nc6', 'c3', 'Nf6', 'Bf4', 'Bg4', 'Qb3', 'Qc8', 'Nd2', 'e6', 'Ngf3', 'Be7', 'O-O', 'O-O'],
    annotations: {
      4: 'exd5. The Exchange Variation. Less theoretical but very positional.',
      6: 'Bd3 controls the crucial b1-h7 diagonal before Black can play Bf5.',
      8: 'c3 solidifies d4 and blunts any pressure on the queenside.',
      12: 'Qb3 pressures b7 and tests Black\'s development.',
      13: 'Qc8 defends b7 and keeps the position solid. This setup strongly resembles the Carlsbad structure from the Queen\'s Gambit Declined.',
    },
  }
];

export const caroKannInfo = {
  name: 'The Caro-Kann Defense',
  color: 'black' as const,
  eco: 'B18',
  description: 'A tremendously solid defense to 1.e4. Black prepares to challenge the center with d5 without blocking their light-squared bishop.',
  keyMoves: '1.e4 c6 2.d4 d5',
  themes: [
    'Developing the light-squared bishop outside the pawn chain',
    'Striking at the center with ...c5',
    'Extremely solid and hard to break down',
    'Excellent endgame structures',
  ],
  chapters: ['Advance Variation', 'Classical Variation', 'Exchange Variation'],
};
