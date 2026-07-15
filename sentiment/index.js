const express = require('express');
const natural = require('natural');

const app = express();
const PORT = process.env.PORT || 3080;

app.use(express.json());

const Analyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;
const analyzer = new Analyzer('English', stemmer, 'afinn');

// POST /sentiment - analyze the sentiment of a piece of text
app.post('/sentiment', (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'A non-empty "text" field is required' });
  }

  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text);
  const score = analyzer.getSentiment(tokens);

  let sentiment = 'neutral';
  if (score > 0) sentiment = 'positive';
  if (score < 0) sentiment = 'negative';

  res.json({ text, score, sentiment });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'sentiment-analyzer' });
});

app.listen(PORT, () => {
  console.log(`Sentiment analyzer service listening on port ${PORT}`);
});

module.exports = app;