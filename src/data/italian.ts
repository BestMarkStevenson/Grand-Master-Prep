import type { OpeningLine } from './londonSystem';

export const italianLines: OpeningLine[] = [
  {
    id: 'italian-main-1',
    name: 'Giuoco Pianissimo Main Line',
    chapter: 'Giuoco Piano',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd3', 'd6', 'O-O', 'a6', 'Bb3', 'Ba7', 'Re1', 'O-O', 'h3', 'h6', 'Nbd2'],
    annotations: {
      4: 'The Italian Game begins. White eyes the f7 square.',
      5: 'The Giuoco Piano (Quiet Game). Black develops symmetrically.',
      6: 'c3 prepares d4 and gives the bishop a retreat square on c2.',
      8: 'd3 signals the Giuoco Pianissimo. White plays solidly, delaying d4 for a later strike.',
      12: 'Bb3 retreats the bishop before it can be attacked by ...Na5.',
      18: 'Nbd2 begins the classical knight maneuver to f1 and g3 (or e3).',
    },
  },
  {
    id: 'italian-evans-1',
    name: 'Evans Gambit Accepted',
    chapter: 'Evans Gambit',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4', 'Bxb4', 'c3', 'Ba5', 'd4', 'exd4', 'O-O', 'Nge7', 'cxd4', 'd5', 'exd5', 'Nxd5', 'Ba3'],
    annotations: {
      6: 'b4!? The Evans Gambit! White sacrifices a pawn for rapid development and central control.',
      8: 'c3 kicks the bishop and prepares d4.',
      10: 'd4 immediately challenges the center.',
      18: 'Ba3! A powerful diagonal for the bishop, stopping Black from castling.',
    },
  },
  {
    id: 'italian-two-knights-1',
    name: 'Fried Liver Attack',
    chapter: 'Two Knights Defense',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5', 'Nxd5', 'Nxf7', 'Kxf7', 'Qf3+', 'Ke6', 'Nc3', 'Nb4', 'O-O', 'c6', 'd4'],
    annotations: {
      5: 'The Two Knights Defense. Black immediately attacks e4.',
      6: 'Ng5 targets f7, leading to incredibly sharp forcing lines.',
      9: 'Nxd5?! This allows the legendary Fried Liver Attack. Natural, but dangerous for Black.',
      10: 'Nxf7! The sacrifice that defines the Fried Liver.',
      12: 'Qf3+ forces the King to e6 to defend the knight on d5.',
      18: 'd4! White blows open the center while Black\'s king is exposed.',
    },
  }
];

export const italianInfo = {
  name: 'The Italian Game',
  color: 'white' as const,
  eco: 'C50',
  description: 'A classical, fundamental chess opening beginning with 1.e4 e5 2.Nf3 Nc6 3.Bc4. Focuses on rapid development and controlling the center.',
  keyMoves: '1.e4 e5 2.Nf3 Nc6 3.Bc4',
  themes: [
    'Quick center control and castling',
    'Targeting the f7 square',
    'Classical knight maneuvers (Nd2-f1-g3)',
    'The e4-d3 pawn structure in Pianissimo',
  ],
  chapters: ['Giuoco Piano', 'Evans Gambit', 'Two Knights Defense'],
};
