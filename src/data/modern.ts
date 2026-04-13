import type { OpeningLine } from './londonSystem';

export const modernLines: OpeningLine[] = [
  {
    id: 'modern-averbakh-1',
    name: 'Averbakh Variation',
    chapter: 'Averbakh Variation',
    moves: ['e4', 'g6', 'd4', 'Bg7', 'c4', 'd6', 'Nc3', 'e5', 'dxe5', 'dxe5', 'Qxd8+', 'Kxd8', 'f4', 'Be6', 'Nf3', 'Nd7', 'Be2', 'c6', 'O-O', 'Ke7'],
    annotations: {
      1: 'The Modern Defense. Black plays g6 immediately, preparing to fianchetto.',
      3: 'Bg7, the sniper bishop is deployed.',
      4: 'c4! White plays the Averbakh system, staking a massive claim in the center and aiming to restrict Black.',
      7: 'e5! Black challenges the center directly.',
      8: 'dxe5 leads to a famous queenless middlegame.',
      10: 'Kxd8. Black loses castling rights, but the king will be safe on e7 or c7 in the incoming structure.',
      12: 'f4 challenges Black\'s central presence.',
      19: 'Ke7! The king finds its safest square, connecting the rooks. The position is rich in maneuvering.',
    },
  },
  {
    id: 'modern-standard-1',
    name: 'Standard Line (vs Nc3)',
    chapter: 'Standard Lines',
    moves: ['e4', 'g6', 'd4', 'Bg7', 'Nc3', 'd6', 'Be3', 'a6', 'Qd2', 'b5', 'Bd3', 'Nd7', 'Nf3', 'Bb7', 'O-O', 'c5', 'dxc5', 'Nxc5', 'Bxc5', 'dxc5'],
    annotations: {
      4: 'Nc3. White develops classically without c4.',
      7: 'a6!? The Modern approach. Black prepares b5 to expand on the queenside, often delaying Nf6 to avoid giving White a target.',
      9: 'b5 grabs space.',
      13: 'Bb7 fianchettos the second bishop.',
      15: 'c5! The central counterattack. Black challenges White\'s control.',
    },
  }
];

export const modernInfo = {
  name: 'The Modern Defense',
  color: 'black' as const,
  eco: 'B06',
  description: 'A flexible, hypermodern opening. Black allows White to build a pawn center and then attacks it from the flanks.',
  keyMoves: '1.e4 g6 2.d4 Bg7',
  themes: [
    'Fianchetto on g7 as early as possible',
    'Delaying ...Nf6 to keep the options open',
    'Flank attacks with ...a6 and ...b5',
    'Challenging the center later with ...e5 or ...c5',
  ],
  chapters: ['Standard Lines', 'Averbakh Variation'],
};
