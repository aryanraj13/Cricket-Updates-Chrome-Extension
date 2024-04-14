async function getMatchData() {
    try {
        const response = await fetch("https://api.cricapi.com/v1/currentMatches?apikey=eb21d9c2-74d8-4a2f-864d-1764b26a37f1&offset=0");
        const data = await response.json();

        if (data.status !== "success") return;

        const matchesList = data.data.filter(match => match.series_id === "76ae85e2-88e5-4e99-83e4-5f352108aebc");

        if (!matchesList) return [];

        const relevantData = matchesList.map(match => {
            const { name, status, score, teams, teamInfo } = match;
            const team1 = teams[0];
            const team2 = teams[1];
            const { r: r1, w: w1, o: o1 } = score.find(s => s.inning === `${team1} Inning 1`) || {};
            const { r: r2, w: w2, o: o2 } = score.find(s => s.inning === `${team2} Inning 1`) || {};
            const team1img = teamInfo.find(i => i.name === `${team1}`) || {};
            const team2img = teamInfo.find(i => i.name === `${team2}`) || {};
            
            const formattedData = `<div class="match-name">${name}</div>
                <div class="match-details">
                    <div class="team-details">
                    <span class="team-name">
                        <img class="team-img" src="${team1img.img}" />
                        ${team1} [${team1img.shortname}]</span>
                        <span class="team-stats">${r1}/${w1} (${o1})</span>
                    </div>
                    <div class="team-details">
                    <span class="team-name">
                        <img class="team-img" src="${team2img.img}" />
                        ${team2}  [${team2img.shortname}]</span>
                        <span class="team-stats">${r2}/${w2} (${o2})</span>
                    </div>
                    <div class="match-status">${status}</div>
                </div>`;
            console.log(formattedData);

            return formattedData;
        });

        const matchesElement = document.getElementById("matches");
        matchesElement.innerHTML = relevantData.map(match => `<li>${match}</li>`).join('');

        return relevantData;
    } catch (e) {
        console.error(e);
    }
}


async function getNewsData() {
    try {
        const apiKey = "ee6e7b8847f44128b27c8ed2d822a9dd";
        const proxyUrl = "http://localhost:8000/"; // Your proxy server address
        const apiUrl = `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${apiKey}`;

        const response = await fetch(`${proxyUrl}${apiUrl}`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log("News Data:", data);

        const newsElement = document.getElementById("news");
        newsElement.innerHTML = data.articles.map(article => `<li>${article.title}</li>`).join('');

        return data;
    } catch (error) {
        console.error("Error fetching news data:", error);
    }
}

document.getElementById("matchesBtn").addEventListener("click", getMatchData);
document.getElementById("newsBtn").addEventListener("click", getNewsData);
// Add this to your existing JavaScript code
document.getElementById("refreshBtn").addEventListener("click", getMatchData);


// Initial load - show matches by default
getMatchData();
