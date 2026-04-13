import type { OpeningLine } from './londonSystem';

export const ruyLopezLines: OpeningLine[] = [
  {
    id: 'ruy-main-1',
    name: 'Morphy Defense Main Line',
    chapter: 'Morphy Defense',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7', 'Re1', 'b5', 'Bb3', 'd6', 'c3', 'O-O', 'h3', 'Na5', 'Bc2', 'c5', 'd4', 'Qc7'],
    annotations: {
      4: 'The Ruy Lopez (Spanish Game)! White immediately pressures the knight defending e5.',
      5: 'The Morphy Defense. Black questions the bishop.',
      10: 'Re1 defends e4, preparing to strike with c3 and d4.',
      14: 'c3 creates a retreat for the bishop to c2 and prepares d4.',
      16: 'h3! A critical prophylactic move in the Spanish to prevent Bg4 pins.',
      17: 'Na5 (Chigorin variation) attacks the bishop and prepares c5.',
      20: 'd4 challenges the center. A massive central struggle ensues.',
    },
  },
  {
    id: 'ruy-marshall-1',
    name: 'Marshall Attack',
    chapter: 'Marshall Attack',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7', 'Re1', 'b5', 'Bb3', 'O-O', 'c3', 'd5', 'exd5', 'Nxd5', 'Nxe5', 'Nxe5', 'Rxe5', 'c6', 'd4', 'Bd6', 'Re1', 'Qh4', 'g3', 'Qh3'],
    annotations: {
      13: 'O-O instead of d6! Black prepares a famous gambit.',
      15: 'd5! The Marshall Attack. Black sacrifices a pawn for a devastating kingside initiative.',
      20: 'Rxe5 accepts the pawn.',
      25: 'Qh4 targets h2 immediately.',
      27: 'Qh3 cements the queen on the kingside, preparing Re8 and Bg4 or Bf5.',
    },
  },
  {
    id: 'ruy-berlin-1',
    name: 'Berlin Endgame',
    chapter: 'Berlin Defense',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'Nf6', 'O-O', 'Nxe4', 'd4', 'Nd6', 'Bxc6', 'dxc6', 'dxe5', 'Nf5', 'Qxd8+', 'Kxd8', 'Nc3', 'Bd7', 'h3', 'h6', 'Bf4', 'Kc8'],
    annotations: {
      5: 'The Berlin Defense. Black plays solidly, often aiming for the famous Berlin Endgame.',
      7: 'Nxe4 grabs the e-pawn.',
      9: 'Nd6 hits the bishop.',
      14: 'Qxd8+! White goes for the legendary endgame. Black loses castling rights, but gets the bishop pair and a solid structure.',
      15: 'Kxd8. The endgame officially begins.',
    },
  }
];

export const ruyLopezInfo = {
  name: 'The Ruy Lopez',
  color: 'white' as const,
  eco: 'C89',
  description: 'The Spanish Game. The most complex and theoretically rich opening in chess, testing every aspect of chess understanding.',
  keyMoves: '1.e4 e5 2.Nf3 Nc6 3.Bb5',
  themes: [
    'Tremendous strategic depth',
    'The "Spanish Bishop" on the a2-g8 diagonal',
    'Prophylaxis with h3',
    'Massive tension in the c3-d4 setup',
  ],
  chapters: ['Morphy Defense', 'Marshall Attack', 'Berlin Defense'],
};
