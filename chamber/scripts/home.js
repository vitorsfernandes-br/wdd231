
function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

/* ---------- Weather ---------- */
const WEATHER_API_KEY = "64e93b83a3f55b5ff789590f7ee436eb";
const WEATHER_LAT = -23.7172; // Itapecerica da Serra, SP
const WEATHER_LON = -46.8494;
const WEATHER_URL = "https://api.openweathermap.org/data/2.5";
const WEATHER_QUERY = `lat=${WEATHER_LAT}&lon=${WEATHER_LON}&units=metric&appid=${WEATHER_API_KEY}`;

const currentWeather = document.querySelector("#weather-current");
const forecastList = document.querySelector("#weather-forecast");

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function weatherIcon(code, description) {
  const icon = createElement("img", "weather-icon");
  icon.src = `https://openweathermap.org/img/wn/${code}@2x.png`;
  icon.alt = description;
  icon.width = 100;
  icon.height = 100;
  return icon;
}

function displayCurrentWeather(data) {
  const { description, icon } = data.weather[0];
  const text = createElement("div", "weather-text");
  text.append(createElement("p", "weather-temp", `${Math.round(data.main.temp)}°C`));
  text.append(createElement("p", "weather-description", capitalize(description)));
  text.append(
    createElement(
      "p",
      "weather-extra",
      `High ${Math.round(data.main.temp_max)}°C, low ${Math.round(data.main.temp_min)}°C, humidity ${data.main.humidity}%`
    )
  );
  currentWeather.replaceChildren(weatherIcon(icon, capitalize(description)), text);
}

function groupForecastByDay(list, timezoneOffset) {
  const days = new Map();
  list.forEach((entry) => {
    const day = new Date((entry.dt + timezoneOffset) * 1000).toISOString().slice(0, 10);
    if (!days.has(day)) days.set(day, []);
    days.get(day).push(entry);
  });
  return days;
}

function displayForecast(data) {
  const offset = data.city.timezone;
  const today = new Date((Math.floor(Date.now() / 1000) + offset) * 1000).toISOString().slice(0, 10);
  const days = [...groupForecastByDay(data.list, offset)].filter(([day]) => day > today).slice(0, 3);

  const items = days.map(([day, entries]) => {
    const high = Math.round(Math.max(...entries.map((entry) => entry.main.temp_max)));
    const low = Math.round(Math.min(...entries.map((entry) => entry.main.temp_min)));
    const midday = entries.reduce((best, entry) => {
      const hour = new Date((entry.dt + offset) * 1000).getUTCHours();
      const bestHour = new Date((best.dt + offset) * 1000).getUTCHours();
      return Math.abs(hour - 12) < Math.abs(bestHour - 12) ? entry : best;
    });
    const { description, icon } = midday.weather[0];
    const label = new Date(`${day}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });

    const item = createElement("li", "forecast-day");
    item.append(createElement("h4", "", label));
    const image = weatherIcon(icon, capitalize(description));
    image.width = 64;
    image.height = 64;
    item.append(image);
    item.append(createElement("p", "forecast-temp", `High ${high}°C`));
    item.append(createElement("p", "forecast-temp", `Low ${low}°C`));
    return item;
  });
  forecastList.replaceChildren(...items);
}

async function loadWeather() {
  if (WEATHER_API_KEY === "PASTE_YOUR_API_KEY_HERE") {
    currentWeather.replaceChildren(createElement("p", "", "Add your OpenWeatherMap API key in scripts/home.js to see the weather."));
    return;
  }
  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(`${WEATHER_URL}/weather?${WEATHER_QUERY}`),
      fetch(`${WEATHER_URL}/forecast?${WEATHER_QUERY}`),
    ]);
    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error(`HTTP ${currentResponse.status} / ${forecastResponse.status}`);
    }
    displayCurrentWeather(await currentResponse.json());
    displayForecast(await forecastResponse.json());
  } catch (error) {
    currentWeather.replaceChildren(createElement("p", "", "Weather is unavailable right now. Please try again later."));
    console.error("Failed to load weather:", error);
  }
}

/* ---------- Member spotlights ---------- */
const spotlightContainer = document.querySelector("#spotlight-container");
const SPOTLIGHT_COUNT = 3;
const MEMBERSHIP_LEVELS = { 2: "Silver", 3: "Gold" };

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createSpotlightCard(member) {
  const levelName = MEMBERSHIP_LEVELS[member.membership];
  const card = createElement("article", "member-card");

  const logo = createElement("img", "member-image");
  logo.src = `images/${member.image}`;
  logo.alt = `Logo of ${member.name}`;
  logo.loading = "lazy";
  logo.width = 400;
  logo.height = 150;
  card.append(logo);

  const info = createElement("div", "member-info");
  const top = createElement("div", "member-topline");
  top.append(createElement("h3", "", member.name));
  top.append(createElement("span", `level level-${levelName.toLowerCase()}`, levelName));
  info.append(top);
  info.append(createElement("p", "category", member.category));

  const details = createElement("address", "member-details");
  details.append(createElement("span", "", member.address));
  const phone = createElement("a", "", member.phone);
  phone.href = `tel:${member.phone.replace(/[^\d+]/g, "")}`;
  details.append(phone);
  const website = createElement("a", "", "Visit website ↗");
  website.href = member.website;
  website.target = "_blank";
  website.rel = "noopener noreferrer";
  website.setAttribute("aria-label", `Visit website of ${member.name}`);
  details.append(website);
  info.append(details);

  card.append(info);
  return card;
}

async function displaySpotlights() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const members = await response.json();
    const eligible = members.filter((member) => member.membership >= 2); // silver or gold
    const picked = shuffle(eligible).slice(0, SPOTLIGHT_COUNT);
    spotlightContainer.replaceChildren(...picked.map(createSpotlightCard));
  } catch (error) {
    spotlightContainer.replaceChildren(createElement("p", "", "Could not load member spotlights. Open the site using Live Server and try again."));
    console.error("Failed to load member spotlights:", error);
  }
}

loadWeather();
displaySpotlights();
