// London System Opening Lines
// White plays 1.d4 with Bf4 setup
// Each line has: name, moves (SAN), annotations, and the side the player trains as

export interface OpeningLine {
  id: string;
  name: string;
  chapter: string;
  moves: string[];  // SAN moves alternating white/black
  annotations: Record<number, string>;  // move index -> annotation
  fen?: string; // starting FEN if not from start
}

export const londonSystemLines: OpeningLine[] = [
  // === Chapter 1: Core Setup ===
  {
    id: 'london-main-1',
    name: 'Classical Main Line',
    chapter: 'Core Setup',
    moves: ['d4', 'd5', 'Bf4', 'Nf6', 'e3', 'e6', 'Nf3', 'Bd6', 'Bg3', 'O-O', 'Bd3', 'c5', 'c3', 'Nc6', 'Nbd2', 'Qe7', 'Ne5'],
    annotations: {
      2: 'The London move! Develop the dark-squared bishop before closing it in with e3.',
      4: 'e3 solidifies the center and prepares Bd3. The bishop is already outside the pawn chain.',
      8: 'If Black plays Bd6 trying to trade, retreat to g3 — the bishop is still powerful on this diagonal.',
      10: 'Bd3 aims at the kingside. The battery Bd3 + potential Qc2 can create mating threats.',
      16: 'Ne5 is the ideal outpost. The knight here controls critical squares and supports a kingside attack.',
    },
  },
  {
    id: 'london-main-2',
    name: 'vs ...c5 Early',
    chapter: 'Core Setup',
    moves: ['d4', 'd5', 'Bf4', 'c5', 'e3', 'Nc6', 'c3', 'Nf6', 'Nd2', 'e6', 'Ngf3', 'Bd6', 'Bg3', 'O-O', 'Bd3', 'b6', 'Ne5'],
    annotations: {
      2: 'The London bishop comes out early, before e3.',
      3: 'Black challenges the center immediately with ...c5.',
      6: 'c3 supports d4 and prepares Nd2-f3 maneuver.',
      8: 'Nd2 develops flexibly — the knight can go to f3 or b3 depending on Black\'s setup.',
      16: 'Again Ne5 — the London\'s dream square for the knight.',
    },
  },
  {
    id: 'london-main-3',
    name: 'vs ...Qb6 Pressure',
    chapter: 'Core Setup',
    moves: ['d4', 'd5', 'Bf4', 'Nf6', 'e3', 'c5', 'c3', 'Nc6', 'Nd2', 'Qb6', 'Qb3', 'c4', 'Qc2', 'Bf5', 'Qc1', 'e6', 'Nh3'],
    annotations: {
      9: 'Black tries the ...Qb6 trick to pressure b2.',
      10: 'Qb3! Blocks the pressure and offers a queen trade that favors White.',
      11: 'Black pushes c4 to lock the queenside, but this releases central tension.',
      14: 'Nh3! A creative maneuver — the knight heads to f4 via h3, avoiding blocking the f-pawn.',
    },
  },
  // === Chapter 2: vs King's Indian Setup ===
  {
    id: 'london-kid-1',
    name: 'vs KID / Grünfeld (g6)',
    chapter: 'vs King\'s Indian',
    moves: ['d4', 'Nf6', 'Bf4', 'g6', 'e3', 'Bg7', 'Nf3', 'O-O', 'Be2', 'd6', 'h3', 'Nbd7', 'O-O', 'Qe8', 'Bh2', 'e5', 'dxe5', 'dxe5', 'Nc3'],
    annotations: {
      2: 'Against ...Nf6, we still play Bf4 immediately.',
      3: 'Black commits to a fianchetto setup.',
      8: 'Be2 instead of Bd3 — better against the fianchetto since g7 bishop contests the h1-a8 diagonal.',
      10: 'h3 prevents ...Nh5 hitting the bishop and prepares Bh2 retreat.',
      14: 'Bh2 is more useful than Bg3 here — it keeps pressure on e5.',
    },
  },
  {
    id: 'london-kid-2',
    name: 'vs KID with ...c5',
    chapter: 'vs King\'s Indian',
    moves: ['d4', 'Nf6', 'Bf4', 'g6', 'e3', 'Bg7', 'Nf3', 'd6', 'Be2', 'O-O', 'O-O', 'c5', 'c3', 'cxd4', 'exd4', 'Nc6', 'Nbd2', 'Nh5', 'Bh2'],
    annotations: {
      11: 'Black strikes with ...c5.',
      12: 'c3 keeps the center solid.',
      17: 'Black tries ...Nh5 to harass the bishop.',
      18: 'Bh2! The standard retreat. The bishop is still useful here, eyeing e5.',
    },
  },
  // === Chapter 3: The e4 Break ===
  {
    id: 'london-e4-1',
    name: 'Central e4 Break',
    chapter: 'The e4 Break',
    moves: ['d4', 'd5', 'Bf4', 'Nf6', 'e3', 'e6', 'Nd2', 'Bd6', 'Bg3', 'O-O', 'Bd3', 'c5', 'c3', 'Nc6', 'Ngf3', 'Re8', 'Ne5', 'Nd7', 'f4', 'f6', 'Nxc6', 'bxc6', 'e4'],
    annotations: {
      7: 'Nd2 first! This flexible move order keeps options open for the f3 knight.',
      16: 'Ne5 occupies the outpost.',
      18: 'f4! Supports e5 and prepares the e4 break.',
      22: 'e4! The thematic break. White seizes the center!',
    },
  },
  {
    id: 'london-e4-2',
    name: 'Pawn Storm with f4-e4',
    chapter: 'The e4 Break',
    moves: ['d4', 'd5', 'Bf4', 'Nf6', 'e3', 'e6', 'Nf3', 'Be7', 'Bd3', 'Nbd7', 'Nbd2', 'O-O', 'Qe2', 'Re8', 'h3', 'Nf8', 'g4', 'N6d7', 'Bh2', 'f6', 'O-O-O'],
    annotations: {
      12: 'Qe2 supports the upcoming e4 push.',
      16: 'g4! An aggressive kingside expansion. With the king going queenside, this is very natural.',
      20: 'O-O-O! The aggressive castle — White can now push g5, h4-h5 for a kingside attack.',
    },
  },
  // === Chapter 4: Jobava London ===
  {
    id: 'london-jobava-1',
    name: 'Jobava London Main Line',
    chapter: 'Jobava London',
    moves: ['d4', 'd5', 'Nc3', 'Nf6', 'Bf4', 'e6', 'Nb5', 'Na6', 'e3', 'Bb4+', 'c3', 'Be7', 'Bd3', 'c5', 'Nf3', 'O-O', 'O-O'],
    annotations: {
      2: 'The Jobava! Nc3 before Nf3 signals an aggressive setup.',
      4: 'Bf4 — now it\'s the Jobava London. More double-edged than the classical London.',
      6: 'Nb5! Threatening Nc7 forking rook and king. Black must react.',
      7: 'Na6 is the main response, keeping options flexible.',
    },
  },
  {
    id: 'london-jobava-2',
    name: 'Jobava vs ...c5',
    chapter: 'Jobava London',
    moves: ['d4', 'd5', 'Nc3', 'Nf6', 'Bf4', 'c5', 'e3', 'cxd4', 'exd4', 'a6', 'Nf3', 'Nc6', 'Bd3', 'Bg4', 'O-O', 'e6', 'h3', 'Bh5', 'Ne5'],
    annotations: {
      5: 'Black challenges with ...c5 against the Jobava.',
      8: 'We recapture with the e-pawn, maintaining a strong center.',
      18: 'Ne5 again — this knight loves this square in the London!',
    },
  },
  // === Chapter 5: Kingside Attack Plans ===
  {
    id: 'london-attack-1',
    name: 'Kingside Attack with h4-h5',
    chapter: 'Kingside Attacks',
    moves: ['d4', 'd5', 'Bf4', 'Nf6', 'e3', 'e6', 'Nf3', 'Bd6', 'Bg3', 'O-O', 'Bd3', 'c5', 'c3', 'Nc6', 'Nbd2', 'Qe7', 'Ne5', 'Nd7', 'f4', 'f5', 'Ndf3', 'Nxe5', 'Nxe5', 'Nd7', 'Qh5'],
    annotations: {
      16: 'Ne5 is planted.',
      18: 'f4 supports the knight and restricts Black\'s counterplay.',
      24: 'Qh5! A powerful queen sortie targeting h7 and putting pressure on Black\'s kingside.',
    },
  },
  {
    id: 'london-attack-2',
    name: 'Battery Bd3 + Qc2',
    chapter: 'Kingside Attacks',
    moves: ['d4', 'd5', 'Bf4', 'Nf6', 'e3', 'e6', 'Nf3', 'c5', 'c3', 'Nc6', 'Bd3', 'Bd6', 'Bg3', 'O-O', 'Nbd2', 'Re8', 'Qc2', 'Bxg3', 'hxg3', 'e5'],
    annotations: {
      16: 'Qc2! Creates a deadly battery aimed at h7. Combined with Bd3, this threatens a direct mating attack.',
      19: 'After hxg3, the h-file opens up — a lethal attacking resource!',
    },
  },
  // === Chapter 6: Endgame & Conversion ===
  {
    id: 'london-endgame-1',
    name: 'Favorable Endgame Structure',
    chapter: 'Endgame Ideas',
    moves: ['d4', 'd5', 'Bf4', 'Nf6', 'e3', 'Bf5', 'Bd3', 'Bxd3', 'Qxd3', 'e6', 'Nf3', 'Be7', 'O-O', 'O-O', 'Nbd2', 'Nbd7', 'c4', 'c6', 'Qc2'],
    annotations: {
      5: 'If Black develops the bishop to f5, we trade with Bd3.',
      6: 'After the trade, White\'s pawn structure is slightly superior — the bishop on f4 is better than Black\'s remaining pieces.',
      16: 'c4! Challenge the center in the middlegame/endgame transition.',
    },
  },
  // === Chapter 7: Anti-London Setups ===
  {
    id: 'london-anti-1',
    name: 'vs ...Bf5 (Mirror Setup)',
    chapter: 'Anti-London Lines',
    moves: ['d4', 'd5', 'Bf4', 'Bf5', 'e3', 'e6', 'Nf3', 'Nf6', 'Bd3', 'Bxd3', 'Qxd3', 'Bd6', 'Bg3', 'Bxg3', 'hxg3', 'Nbd7', 'Nd2', 'O-O', 'O-O-O'],
    annotations: {
      3: 'Black mirrors with ...Bf5. This is a popular try.',
      8: 'We trade bishops — White gets the open h-file which is very valuable.',
      14: 'After hxg3, the h-file is a battering ram against Black\'s king.',
      18: 'O-O-O! Castle long and attack down the h-file. Very aggressive.',
    },
  },
  {
    id: 'london-anti-2',
    name: 'vs ...e5 Gambit',
    chapter: 'Anti-London Lines',
    moves: ['d4', 'd5', 'Bf4', 'Nf6', 'e3', 'e5', 'dxe5', 'Nh5', 'Bg5', 'Be7', 'Bxe7', 'Qxe7', 'Nc3', 'O-O', 'Bd3', 'Nd7', 'Nge2'],
    annotations: {
      5: 'The aggressive ...e5!? gambit attempt.',
      6: 'dxe5 — accept the pawn. White stands well.',
      8: 'Bg5! Strong — pin the queen and maintain the extra pawn.',
      16: 'Nge2 develops solidly. White is a pawn up with a comfortable position.',
    },
  },
  {
    id: 'london-anti-3',
    name: 'vs Dutch Setup (...f5)',
    chapter: 'Anti-London Lines',
    moves: ['d4', 'f5', 'Bf4', 'Nf6', 'e3', 'e6', 'Nf3', 'b6', 'Bd3', 'Bb7', 'Nbd2', 'Be7', 'O-O', 'O-O', 'Ne5', 'd6', 'Nd3', 'Nbd7', 'c4'],
    annotations: {
      1: 'The Dutch! An unusual response but the London handles it well.',
      14: 'Ne5 pressures the center.',
      18: 'c4 grabs space. White has a harmonious setup against the Dutch.',
    },
  },
  {
    id: 'london-rapid-1',
    name: 'Rapid Development Line',
    chapter: 'Core Setup',
    moves: ['d4', 'Nf6', 'Bf4', 'd5', 'e3', 'e6', 'Nf3', 'c5', 'c3', 'Nc6', 'Bd3', 'cxd4', 'exd4', 'Bd6', 'Bxd6', 'Qxd6', 'Nbd2', 'O-O', 'O-O', 'Bd7', 'Re1'],
    annotations: {
      11: 'If Black trades on d4, we recapture with the e-pawn keeping a strong center.',
      14: 'The trade of dark-squared bishops is fine — White has the better pawn structure.',
      20: 'Re1 supports the e-file and prepares Ne5.',
    },
  },
  {
    id: 'london-trap-1',
    name: 'The London Trap',
    chapter: 'Tactical Themes',
    moves: ['d4', 'd5', 'Bf4', 'Nf6', 'e3', 'c5', 'c3', 'Nc6', 'Nd2', 'e5', 'dxe5', 'Nh5', 'Be2'],
    annotations: {
      9: 'Black plays the aggressive ...e5 trying to win the bishop.',
      10: 'dxe5! Take the pawn.',
      11: '...Nh5 attacks the bishop, but...',
      12: 'Be2! Trapping the knight! If ...Nhf6, exf6 wins, and if ...Nhf4, exf4 followed by Bxh5.',
    },
  },
];

export const londonSystemInfo = {
  name: 'The London System',
  color: 'white' as const,
  eco: 'D02',
  description: 'A solid, flexible opening for White starting with 1.d4 and 2.Bf4. Used by Magnus Carlsen, Gata Kamsky, and Ding Liren at the highest level.',
  keyMoves: '1.d4 d5 2.Bf4',
  themes: [
    'Develop Bf4 before e3',
    'Ne5 is the dream square',
    'Bd3 + Qc2 battery on the h7 diagonal',
    'h3 to prevent ...Nh5, retreat Bh2',
    'The e4 break with proper preparation',
    'Kingside attack with f4, g4, h4',
  ],
  chapters: ['Core Setup', 'vs King\'s Indian', 'The e4 Break', 'Jobava London', 'Kingside Attacks', 'Endgame Ideas', 'Anti-London Lines', 'Tactical Themes'],
};
