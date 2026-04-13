// SM-2 Spaced Repetition Algorithm
// Adapted from SuperMemo's SM-2 for chess opening training

export interface ReviewCard {
  lineId: string;
  level: number;        // 0-8 (0 = new, 8 = mastered)
  nextReview: number;   // timestamp
  lastReview: number;   // timestamp
  totalReviews: number;
  correctCount: number;
  incorrectCount: number;
  streak: number;       // consecutive correct answers
}

export interface SRSStats {
  totalCards: number;
  newCards: number;
  learningCards: number;
  reviewCards: number;
  masteredCards: number;
  dueNow: number;
  accuracy: number;
  currentStreak: number;  // daily streak
  lastStudyDate: string;
}

// Intervals in milliseconds for each level
const INTERVALS = [
  0,                    // Level 0: New (immediate)
  4 * 60 * 60 * 1000,  // Level 1: 4 hours
  24 * 60 * 60 * 1000, // Level 2: 1 day
  3 * 24 * 60 * 60 * 1000, // Level 3: 3 days
  7 * 24 * 60 * 60 * 1000, // Level 4: 1 week
  14 * 24 * 60 * 60 * 1000, // Level 5: 2 weeks
  30 * 24 * 60 * 60 * 1000, // Level 6: 1 month
  90 * 24 * 60 * 60 * 1000, // Level 7: 3 months
  180 * 24 * 60 * 60 * 1000, // Level 8: 6 months (mastered)
];

const STORAGE_KEY = 'gm-prep-srs';
const STATS_KEY = 'gm-prep-stats';

export class SpacedRepetition {
  private cards: Map<string, ReviewCard>;
  private stats: SRSStats;

  constructor() {
    this.cards = new Map();
    this.stats = this.getDefaultStats();
    this.load();
  }

  private getDefaultStats(): SRSStats {
    return {
      totalCards: 0,
      newCards: 0,
      learningCards: 0,
      reviewCards: 0,
      masteredCards: 0,
      dueNow: 0,
      accuracy: 0,
      currentStreak: 0,
      lastStudyDate: '',
    };
  }

  // Initialize cards for a set of line IDs
  initializeCards(lineIds: string[]): void {
    for (const id of lineIds) {
      if (!this.cards.has(id)) {
        this.cards.set(id, {
          lineId: id,
          level: 0,
          nextReview: 0,
          lastReview: 0,
          totalReviews: 0,
          correctCount: 0,
          incorrectCount: 0,
          streak: 0,
        });
      }
    }
    this.save();
  }

  // Process a correct answer
  markCorrect(lineId: string): ReviewCard {
    const card = this.getOrCreateCard(lineId);
    const now = Date.now();

    card.level = Math.min(card.level + 1, 8);
    card.lastReview = now;
    card.nextReview = now + INTERVALS[card.level];
    card.totalReviews++;
    card.correctCount++;
    card.streak++;

    this.cards.set(lineId, card);
    this.updateDailyStreak();
    this.save();
    return card;
  }

  // Process an incorrect answer
  markIncorrect(lineId: string): ReviewCard {
    const card = this.getOrCreateCard(lineId);
    const now = Date.now();

    card.level = 1; // Reset to level 1 (not 0, so it's not "new")
    card.lastReview = now;
    card.nextReview = now + INTERVALS[1]; // Review in 4 hours
    card.totalReviews++;
    card.incorrectCount++;
    card.streak = 0;

    this.cards.set(lineId, card);
    this.updateDailyStreak();
    this.save();
    return card;
  }

  // Get all cards due for review
  getDueCards(): ReviewCard[] {
    const now = Date.now();
    const due: ReviewCard[] = [];

    this.cards.forEach((card) => {
      if (card.nextReview <= now) {
        due.push(card);
      }
    });

    // Sort: lower levels first, then by nextReview time
    due.sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return a.nextReview - b.nextReview;
    });

    return due;
  }

  // Get new cards (never reviewed)
  getNewCards(): ReviewCard[] {
    const newCards: ReviewCard[] = [];
    this.cards.forEach((card) => {
      if (card.level === 0 && card.totalReviews === 0) {
        newCards.push(card);
      }
    });
    return newCards;
  }

  // Get card for a specific line
  getCard(lineId: string): ReviewCard | undefined {
    return this.cards.get(lineId);
  }

  // Get statistics
  getStats(): SRSStats {
    const now = Date.now();
    let newCards = 0, learningCards = 0, reviewCards = 0, masteredCards = 0, dueNow = 0;
    let totalCorrect = 0, totalReviews = 0;

    this.cards.forEach((card) => {
      if (card.level === 0 && card.totalReviews === 0) {
        newCards++;
      } else if (card.level >= 7) {
        masteredCards++;
      } else {
        learningCards++;
      }

      if (card.nextReview <= now && (card.level > 0 || card.totalReviews === 0)) {
        dueNow++;
        reviewCards++;
      }

      totalCorrect += card.correctCount;
      totalReviews += card.totalReviews;
    });

    return {
      totalCards: this.cards.size,
      newCards,
      learningCards,
      reviewCards,
      masteredCards,
      dueNow,
      accuracy: totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0,
      currentStreak: this.stats.currentStreak,
      lastStudyDate: this.stats.lastStudyDate,
    };
  }

  // Get level description
  static getLevelName(level: number): string {
    const names = ['New', 'Learning', 'Familiar', 'Comfortable', 'Solid', 'Strong', 'Expert', 'Near-Master', 'Mastered'];
    return names[level] || 'Unknown';
  }

  // Get status color class
  static getStatusClass(card: ReviewCard): string {
    if (card.level === 0 && card.totalReviews === 0) return 'new';
    if (card.level >= 7) return 'mastered';
    if (card.nextReview <= Date.now()) return 'review';
    return 'learning';
  }

  // Format next review time
  static formatNextReview(card: ReviewCard): string {
    if (card.level === 0 && card.totalReviews === 0) return 'New';
    const now = Date.now();
    const diff = card.nextReview - now;
    if (diff <= 0) return 'Due now';
    if (diff < 60 * 60 * 1000) return `${Math.round(diff / (60 * 1000))}m`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.round(diff / (60 * 60 * 1000))}h`;
    return `${Math.round(diff / (24 * 60 * 60 * 1000))}d`;
  }

  private getOrCreateCard(lineId: string): ReviewCard {
    let card = this.cards.get(lineId);
    if (!card) {
      card = {
        lineId,
        level: 0,
        nextReview: 0,
        lastReview: 0,
        totalReviews: 0,
        correctCount: 0,
        incorrectCount: 0,
        streak: 0,
      };
    }
    return { ...card };
  }

  private updateDailyStreak(): void {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (this.stats.lastStudyDate === today) {
      // Already studied today
      return;
    }
    if (this.stats.lastStudyDate === yesterday) {
      this.stats.currentStreak++;
    } else if (this.stats.lastStudyDate !== today) {
      this.stats.currentStreak = 1;
    }
    this.stats.lastStudyDate = today;
  }

  // Reset all progress
  resetAll(): void {
    this.cards.clear();
    this.stats = this.getDefaultStats();
    this.save();
  }

  // Persistence
  private save(): void {
    try {
      const cardsObj: Record<string, ReviewCard> = {};
      this.cards.forEach((card, key) => {
        cardsObj[key] = card;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cardsObj));
      localStorage.setItem(STATS_KEY, JSON.stringify(this.stats));
    } catch (e) {
      console.warn('Failed to save SRS data:', e);
    }
  }

  private load(): void {
    try {
      const cardsJson = localStorage.getItem(STORAGE_KEY);
      if (cardsJson) {
        const cardsObj = JSON.parse(cardsJson) as Record<string, ReviewCard>;
        Object.entries(cardsObj).forEach(([key, card]) => {
          this.cards.set(key, card);
        });
      }
      const statsJson = localStorage.getItem(STATS_KEY);
      if (statsJson) {
        this.stats = { ...this.getDefaultStats(), ...JSON.parse(statsJson) };
      }
    } catch (e) {
      console.warn('Failed to load SRS data:', e);
    }
  }
}
