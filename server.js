const express = require('express');
const cors = require('cors');
const NewsAPI = require('newsapi');

const app = express();
const newsapi = new NewsAPI('65b518e024f548b78d602efe7ab716da');

app.use(cors());

app.get('/api/news', async (req, res) => {
  try {
    const response = await newsapi.v2.topHeadlines({
        sources: 'bbc-news' ,
        // q: 'health',
        language: 'en',
        country: 'us'
      });
      

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: 'Грешка при зареждане на новините.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API сървърът работи на http://localhost:${PORT}`);
});
