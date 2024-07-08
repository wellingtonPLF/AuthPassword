type Callback = (trigram: string) => void;

export class TrigramIndex {
    private phrases: string[];
    private trigramIndex: { [key: string]: number[] };

    constructor(inputPhrases: string[]) {
        this.phrases = [];
        this.trigramIndex = {};

        for (const phrase of inputPhrases) {
            this.index(phrase);
        }
    }

    private asTrigrams(phrase: string, callback: Callback): void {
        const rawData = "  ".concat(phrase, "  ");
        for (let i = rawData.length - 3; i >= 0; i--) {
            callback.call(this, rawData.slice(i, i + 3));
        }
    }

    public index(phrase: string): void {
        if (!phrase || phrase === "" || this.phrases.indexOf(phrase) >= 0) return;
        const phraseIndex = this.phrases.push(phrase) - 1;
        this.asTrigrams(phrase, (trigram: string) => {
            let phrasesForTrigram = this.trigramIndex[trigram];
            if (!phrasesForTrigram) phrasesForTrigram = [];
            if (phrasesForTrigram.indexOf(phraseIndex) < 0) phrasesForTrigram.push(phraseIndex);
            this.trigramIndex[trigram] = phrasesForTrigram;
        });
    }

    public find(phrase: string): { phrase: string; matches: number }[] {
        const phraseMatches: { [key: number]: number } = {};
        let trigramsInPhrase = 0;

        this.asTrigrams(phrase, (trigram: string) => {
            const phrasesForTrigram = this.trigramIndex[trigram];
            trigramsInPhrase += 1;
            if (phrasesForTrigram) {
                for (const phraseIndex of phrasesForTrigram) {
                    if (!phraseMatches[phraseIndex]) phraseMatches[phraseIndex] = 0;
                    phraseMatches[phraseIndex] += 1;
                }
            }
        });

        const result: { phrase: string; matches: number }[] = [];
        for (const i in phraseMatches) {
            result.push({ phrase: this.phrases[i], matches: phraseMatches[i] });
        }

        result.sort((a, b) => b.matches - a.matches);
        return result;
    }
}
