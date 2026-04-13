// Sicilian Dragon Opening Lines
// Black plays 1...c5 with ...g6 fianchetto
import type { OpeningLine } from './londonSystem';

export const dragonLines: OpeningLine[] = [
  // === Chapter 1: Yugoslav Attack Main Line ===
  {
    id: 'dragon-yugo-1',
    name: 'Yugoslav Attack Main Line',
    chapter: 'Yugoslav Attack',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'f3', 'O-O', 'Qd2', 'Nc6', 'Bc4', 'd5', 'Bb3', 'Nxd4', 'Bxd4', 'e5', 'Be3', 'Be6'],
    annotations: {
      1: 'Dragon begins! 1...c5 — the Sicilian.',
      3: 'Black plays ...d6, committing to the Dragon structure.',
      9: '...g6 — the Dragon pawn formation is established.',
      10: 'Be3 signals the Yugoslav Attack — the most critical test.',
      12: 'f3 supports the center and prepares Qd2 + O-O-O.',
      14: 'Qd2 connects with Be3 for the Bh6 exchange idea.',
      17: '...d5! The thematic central counter-strike in the Dragon.',
    },
  },
  {
    id: 'dragon-yugo-2',
    name: 'Yugoslav: Soltis Variation',
    chapter: 'Yugoslav Attack',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'f3', 'O-O', 'Qd2', 'Nc6', 'Bc4', 'Bd7', 'O-O-O', 'Rc8', 'Bb3', 'Ne5', 'h4', 'h5'],
    annotations: {
      18: 'Bd7 — preparing ...Rc8 and queenside counterplay.',
      19: 'White castles long — the race begins!',
      20: '...Rc8 — aiming at the c2 pawn and the open c-file.',
      22: '...Ne5 reroutes the knight to attack White\'s king.',
      23: 'h4 — White begins the kingside pawn storm.',
      24: '...h5! The Soltis Variation — blocking the pawn storm. This is Black\'s key defensive resource.',
    },
  },
  {
    id: 'dragon-yugo-3',
    name: 'Yugoslav: Chinese Dragon',
    chapter: 'Yugoslav Attack',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'f3', 'O-O', 'Qd2', 'Nc6', 'Bc4', 'Bd7', 'O-O-O', 'Qa5', 'Bb3', 'Rfc8', 'Kb1', 'Ne5'],
    annotations: {
      20: '...Qa5! The start of the Chinese Dragon setup — the queen supports ...Rfc8 and ...Nc4.',
      22: '...Rfc8 — the rook joins the attack on c-file.',
      23: 'Kb1 is a useful prophylactic move, tucking the king away.',
      24: '...Ne5 heads for c4 — a devastating outpost!',
    },
  },
  {
    id: 'dragon-yugo-4',
    name: 'Yugoslav: 9.O-O-O Variation',
    chapter: 'Yugoslav Attack',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'f3', 'O-O', 'Qd2', 'Nc6', 'O-O-O', 'd5', 'exd5', 'Nxd5', 'Nxc6', 'bxc6', 'Nxd5', 'cxd5', 'Qxd5', 'Qc7'],
    annotations: {
      17: 'When White plays 9.O-O-O without Bc4, Black strikes with ...d5 immediately!',
      18: '...d5! Blowing open the center while White hasn\'t fully consolidated.',
      25: '...Qc7 — Black has excellent compensation with the bishop pair and active pieces.',
    },
  },
  // === Chapter 2: Classical Variation ===
  {
    id: 'dragon-classical-1',
    name: 'Classical: Be2 Main Line',
    chapter: 'Classical Variation',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be2', 'Bg7', 'O-O', 'Nc6', 'Be3', 'O-O', 'Nb3', 'Be6', 'f4', 'Na5', 'f5', 'Bc4'],
    annotations: {
      10: 'Be2 — the Classical Variation. Less aggressive than the Yugoslav but very solid.',
      14: 'O-O — White castles kingside, a very different game compared to the Yugoslav.',
      18: '...Na5-c4 maneuver is a key Dragon idea to activate the knight.',
      20: '...Na5 heads to c4 — a fantastic outpost in the Dragon!',
      22: '...Bc4! Trading the light-squared bishops favors Black in the Dragon.',
    },
  },
  {
    id: 'dragon-classical-2',
    name: 'Classical with Qd2',
    chapter: 'Classical Variation',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be2', 'Bg7', 'O-O', 'O-O', 'Nb3', 'Nc6', 'Kh1', 'a5', 'a4', 'Be6', 'f4', 'Nb4'],
    annotations: {
      18: '...a5! Grabbing queenside space — a common Dragon idea.',
      22: '...Nb4 puts pressure on c2 and d3 squares.',
    },
  },
  // === Chapter 3: Anti-Dragon Lines ===
  {
    id: 'dragon-anti-1',
    name: 'Levenfish Attack (6.f4)',
    chapter: 'Anti-Dragon Lines',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'f4', 'Nc6', 'Nxc6', 'bxc6', 'e5', 'Nd7', 'exd6', 'exd6', 'Be2', 'Be7', 'O-O', 'O-O', 'Be3', 'Bf6'],
    annotations: {
      10: 'The Levenfish! 6.f4 is an aggressive try to blow open the center.',
      14: '...bxc6 — taking toward center gives Black good pawn structure.',
      24: '...Bf6 — Black has a solid position with good piece activity.',
    },
  },
  {
    id: 'dragon-anti-2',
    name: 'vs 6.Bg5 (Anti-Dragon)',
    chapter: 'Anti-Dragon Lines',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Bg5', 'Bg7', 'Bb5+', 'Bd7', 'Qd2', 'Nc6', 'Bxf6', 'Bxf6', 'Nxc6', 'bxc6', 'Bd3', 'Bg7', 'O-O', 'O-O'],
    annotations: {
      10: '6.Bg5 — an Anti-Dragon system trying to double Black\'s pawns.',
      14: 'We develop naturally and castle safely.',
      24: 'Black has a very comfortable position after castling.',
    },
  },
  {
    id: 'dragon-anti-3',
    name: 'Dragondorf / Maroczy Bind',
    chapter: 'Anti-Dragon Lines',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'g6', 'c4', 'Bg7', 'Be3', 'Nf6', 'Nc3', 'O-O', 'Be2', 'd5', 'exd5', 'Nxd5', 'Nxd5', 'Qxd5'],
    annotations: {
      8: 'When Black plays ...g6 before ...Nf6, White can try the Maroczy Bind with c4.',
      15: '...d5! Breaking the bind is the key idea for Black.',
      20: 'After the exchanges, Black has equalized comfortably.',
    },
  },
  // === Chapter 4: Key Dragon Plans ===
  {
    id: 'dragon-plan-1',
    name: 'Queenside Counterattack',
    chapter: 'Dragon Plans',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'f3', 'O-O', 'Qd2', 'Nc6', 'Bc4', 'Bd7', 'O-O-O', 'Rc8', 'Bb3', 'Ne5', 'Kb1', 'Nc4', 'Bxc4', 'Rxc4'],
    annotations: {
      20: '...Rc8 takes the open c-file — the Dragon\'s main counterattacking resource.',
      22: '...Ne5 reroutes to c4, the dream square.',
      24: '...Nc4! The knight arrives at its ideal post, pressuring b2 and d2.',
      26: '...Rxc4 — Black has active pieces and queenside pressure.',
    },
  },
  {
    id: 'dragon-plan-2',
    name: '...d5 Central Break',
    chapter: 'Dragon Plans',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'f3', 'O-O', 'Qd2', 'Nc6', 'Bc4', 'd5', 'Bb3', 'dxe4', 'Nxc6', 'bxc6', 'fxe4', 'Qc7'],
    annotations: {
      18: '...d5! The defining break. When it works, Black gets a great game.',
      20: '...dxe4 opens the position favorably.',
      24: '...Qc7 — Black has excellent piece activity and a strong center.',
    },
  },
  {
    id: 'dragon-plan-3',
    name: 'Exchange Sacrifice on c3',
    chapter: 'Dragon Plans',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'f3', 'Nc6', 'Qd2', 'O-O', 'Bc4', 'Bd7', 'O-O-O', 'Rc8', 'Bb3', 'Ne5', 'h4', 'h5', 'Kb1', 'Nc4', 'Bxc4', 'Rxc4', 'Nde2', 'Qa5'],
    annotations: {
      22: '...Ne5-c4 is the standard Dragon maneuver.',
      24: '...h5 stops the kingside pawn storm.',
      28: '...Rxc4 — in some lines, the exchange sacrifice ...Rxc3!? is a typical Dragon theme for crushing queenside initiative.',
      30: '...Qa5 — Black coordinates the pieces for maximum pressure.',
    },
  },
  // === Chapter 5: Accelerated Dragon ===
  {
    id: 'dragon-accel-1',
    name: 'Accelerated Dragon Main Line',
    chapter: 'Accelerated Dragon',
    moves: ['e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'g6', 'Nc3', 'Bg7', 'Be3', 'Nf6', 'Bc4', 'O-O', 'Bb3', 'd6', 'f3', 'Bd7', 'Qd2', 'Qa5'],
    annotations: {
      3: '...Nc6 before ...d6 — the Accelerated Dragon move order.',
      7: 'Black fianchettoes without playing ...d6 yet, keeping the ...d5 break available.',
      16: '...d6 — now transposing to a standard Dragon structure but with a tempo advantage.',
      20: '...Qa5 — active queen placement putting pressure on the queenside.',
    },
  },
  {
    id: 'dragon-accel-2',
    name: 'Accelerated: vs Maroczy Bind',
    chapter: 'Accelerated Dragon',
    moves: ['e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'g6', 'c4', 'Nf6', 'Nc3', 'd6', 'Be2', 'Nxd4', 'Qxd4', 'Bg7', 'Be3', 'O-O', 'Qd2', 'Be6', 'O-O', 'Qa5'],
    annotations: {
      8: '5.c4 — the Maroczy Bind. White clamps down on d5.',
      13: '...Nxd4 exchanging a pair of knights to reduce White\'s control.',
      22: '...Qa5 — Black plays actively to prevent White from consolidating.',
    },
  },
  // === Chapter 6: Dragon Endgames ===
  {
    id: 'dragon-end-1',
    name: 'Dragon Bishop Endgame',
    chapter: 'Dragon Endgames',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be2', 'Bg7', 'O-O', 'Nc6', 'Be3', 'O-O', 'Qd2', 'Ng4', 'Bxg4', 'Bxg4', 'Nxc6', 'bxc6', 'Bh6', 'Bxh6', 'Qxh6', 'Qb6'],
    annotations: {
      18: '...Ng4! Provoking an exchange to get the bishop pair.',
      24: 'After trades, Black\'s Dragon bishop is strong in the endgame.',
      26: '...Qb6 — Black has excellent endgame prospects with the strong dark-squared bishop.',
    },
  },
  {
    id: 'dragon-sideline-1',
    name: 'vs 6.Be3 without f3',
    chapter: 'Anti-Dragon Lines',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'Qd2', 'Nc6', 'O-O-O', 'O-O', 'f3', 'd5', 'exd5', 'Nxd5', 'Nxc6', 'bxc6', 'Nxd5', 'cxd5', 'Qxd5', 'Qc7'],
    annotations: {
      12: 'Without f3 first, the structure is slightly different.',
      19: '...d5! Striking in the center before White consolidates.',
      26: '...Qc7 — active counterplay for Black.',
    },
  },
];

export const dragonInfo = {
  name: 'The Sicilian Dragon',
  color: 'black' as const,
  eco: 'B70-B79',
  description: 'One of the sharpest openings in chess. Black fianchettoes the king\'s bishop and creates a fire-breathing attack along the long diagonal. Characters: Garry Kasparov, Magnus Carlsen (occasionally), Teimour Radjabov.',
  keyMoves: '1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6',
  themes: [
    'Fianchetto bishop on g7 controls the long diagonal',
    '...Rc8 for queenside counterplay on the c-file',
    '...Ne5-c4 knight maneuver to pressure White',
    '...d5 central break when possible',
    '...h5 (Soltis) to block kingside pawn storms',
    'Exchange sacrifices on c3 for initiative',
  ],
  chapters: ['Yugoslav Attack', 'Classical Variation', 'Anti-Dragon Lines', 'Dragon Plans', 'Accelerated Dragon', 'Dragon Endgames'],
};
