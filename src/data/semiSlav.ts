import type { OpeningLine } from './londonSystem';

export const semiSlavLines: OpeningLine[] = [
  {
    id: 'semislav-meran-1',
    name: 'Meran Variation',
    chapter: 'Meran Variation',
    moves: ['d4', 'd5', 'c4', 'c6', 'Nf3', 'Nf6', 'Nc3', 'e6', 'e3', 'Nbd7', 'Bd3', 'dxc4', 'Bxc4', 'b5', 'Bd3', 'Bb7', 'a3', 'a6', 'e4', 'c5', 'd5', 'c4', 'Bc2', 'Qc7'],
    annotations: {
      3: 'The Semi-Slav triangle! Black plays both ...c6 and ...e6, forming an incredibly solid fortress.',
      8: 'e3 is the quiet systemic approach. (Against Bg5, Black often plays the Botvinnik!)',
      11: 'dxc4! The hallmark of the Meran. Black gives up the center temporarily to expand rapidly on the queenside.',
      13: 'b5 kicks the bishop and gains massive queenside space.',
      15: 'Bb7 fianchettos the bishop on the newly opened a8-h1 diagonal.',
      19: 'c5! The critical central break. Black challenges White\'s center immediately.',
      23: 'Qc7 develops the queen and supports e5.',
    },
  },
  {
    id: 'semislav-botvinnik-1',
    name: 'Botvinnik Variation',
    chapter: 'Botvinnik Variation',
    moves: ['d4', 'd5', 'c4', 'c6', 'Nf3', 'Nf6', 'Nc3', 'e6', 'Bg5', 'dxc4', 'e4', 'b5', 'e5', 'h6', 'Bh4', 'g5', 'Nxg5', 'hxg5', 'Bxg5', 'Nbd7', 'exf6', 'Bb7', 'g3', 'c5', 'd5', 'Qb6', 'Bg2', 'O-O-O'],
    annotations: {
      8: 'Bg5! White plays the absolute sharpest main line. It\'s do or die from here.',
      9: 'dxc4! The Botvinnik variation. Black grabs the pawn and dares White to prove compensation.',
      11: 'b5 defends the pawn aggressively.',
      12: 'e5 pins the knight. White seeks to crush Black immediately.',
      13: 'h6! Black forces the issue.',
      15: 'g5! Black breaks the pin but radically weakens the kingside.',
      16: 'Nxg5! Sacrifice! White gives up the knight for two pawns and massive attacking chances.',
      23: 'g3 prepares to fianchetto the bishop to put pressure on the long diagonal.',
      27: 'O-O-O! Black castles long, completing development in one of the most chaotic positions in chess.',
    },
  }
];

export const semiSlavInfo = {
  name: 'The Semi-Slav Defense',
  color: 'black' as const,
  eco: 'D43',
  description: 'An immensely deeply analyzed and hyper-aggressive defense to 1.d4. Black forms a solid triangle but strikes back violently.',
  keyMoves: '1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 e6',
  themes: [
    'The c6, d5, e6 pawn triangle',
    'Queenside expansion with ...dxc4 and ...b5',
    'Massive tactical complications',
    'The Botvinnik madness',
  ],
  chapters: ['Meran Variation', 'Botvinnik Variation'],
};
