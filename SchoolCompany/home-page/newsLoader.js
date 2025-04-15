fetch('http://localhost:3000/api/news')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('news-container');
      container.innerHTML = '';

      if (!data.articles || data.articles.length === 0) {
        container.innerText = 'Няма налични новини.';
        return;
      }

      data.articles.forEach(article => {
        const div = document.createElement('div');
        div.className = 'news-item';
        div.innerHTML = `
          <h3>${article.title}</h3>
          <p>${article.description || ''}</p>
          <a href="${article.url}" target="_blank">Прочети повече</a>
        `;
        container.appendChild(div);
      });
    })
    .catch(error => {
      console.error('Грешка при зареждане на новините:', error);
      document.getElementById('news-container').innerText = 'Грешка при зареждане на новините.';
    });