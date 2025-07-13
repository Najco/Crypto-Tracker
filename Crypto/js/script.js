const cryptoList = document.getElementById('cryptoList');
const sortBy = document.getElementById('sortBy');
const notification = document.getElementById('customNotification');

let coins = [];

async function fetchData() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
    );
    const data = await res.json();
    coins = data;
    renderCoins();
    showNotification('✅ Podaci osveženi');
  } catch (err) {
    showNotification('⚠️ Greška pri preuzimanju podataka', '#dc3545');
  }
}

function renderCoins() {
  const sorted = [...coins];
  const sort = sortBy.value;

  if (sort === 'price')
    sorted.sort((a, b) => b.current_price - a.current_price);
  else if (sort === 'change')
    sorted.sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    );
  else sorted.sort((a, b) => a.market_cap_rank - b.market_cap_rank);

  cryptoList.innerHTML = '';
  sorted.forEach(coin => {
    const change = coin.price_change_percentage_24h.toFixed(2);
    const changeClass = change >= 0 ? 'price-up' : 'price-down';
    const arrow = change >= 0 ? '🔺' : '🔻';
    const html = `
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-sm p-3 h-100">
          <div class="d-flex align-items-center mb-2">
            <img src="${coin.image}" alt="${coin.name}" class="me-2" />
            <div>
              <strong>${coin.name} (${coin.symbol.toUpperCase()})</strong><br />
              <small>Rank: #${coin.market_cap_rank}</small>
            </div>
          </div>
          <p class="mb-1">💰 $${coin.current_price.toLocaleString()}</p>
          <p class="${changeClass}">Promena 24h: ${arrow} ${Math.abs(
      change
    )}%</p>
        </div>
      </div>
    `;
    cryptoList.innerHTML += html;
  });
}

function showNotification(msg, color = '#0d6efd') {
  notification.innerText = msg;
  notification.style.background = color;
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 3000);
}

sortBy.addEventListener('change', renderCoins);
fetchData();
setInterval(fetchData, 60000); // refresh na svakih 60 sekundi
