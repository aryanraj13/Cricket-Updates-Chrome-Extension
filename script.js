async function getMatchData() {
    try {
        const response = await fetch("https://api.cricapi.com/v1/cricScore?apikey=a80b2e33-6764-4af7-8797-3a8dcc0e88ac");
        const data = await response.json();

        if (data.status !== "success") return;

        const matchesList = data.data;

        // Clear existing match data
        document.getElementById("news").innerHTML = '';

        if (!matchesList) return [];

        // Filter out only the live matches
        const liveMatches = matchesList.filter(match => match.ms === "result" && match.series === "Indian Premier League 2024");

        const relevantData = liveMatches.map(match => {
            const { id, dateTimeGMT, t1, t2, t1s, t2s, t1img, t2img, series, status } = match;

            return `<div class="match-name">${series}</div>
                <div class="match-details">
                    <div class="team-details">
                        <span class="team-name">
                            <img class="team-img" src="${t1img}" />
                            ${t1}</span>
                        <span class="team-stats">${t1s || "N/A"}</span>
                    </div>
                    <div class="team-details">
                        <span class="team-name">
                            <img class="team-img" src="${t2img}" />
                            ${t2}</span>
                        <span class="team-stats">${t2s || "N/A"}</span>
                    </div>
                    <div class="match-status">${status}</div>
                </div>`;
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
        const response = await fetch("https://api.webz.io/newsApiLite?token=69529245-f932-4221-a082-9394ed9eebdc&q=Bitcoin");
        const data = await response.json();

        if (data.posts && data.posts.length > 0) {
            const posts = data.posts.map(post => ({
                title: post.thread.title,
                url: post.thread.url,
                site: post.thread.site,
                date: post.thread.published
            }));

            const newsElement = document.getElementById("news");

            // Clear existing match data
            document.getElementById("matches").innerHTML = '';

            // Display news data
            newsElement.innerHTML = posts.map(post => `
                <li>
                    <span class="team-stats" style="color: white;">${post.title}</span><br>
                    <a style="color: green;" href="${post.url}" target="_blank">${post.site}</a>
                    <span style="color: white; display: block; text-align: right;">${new Date(post.date).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </li>
            `).join('');
        } else {
            console.log("No posts found.");
        }
    } catch (error) {
        console.error("Error fetching news data:", error);
    }
}

document.getElementById("newsBtn").addEventListener("click", getNewsData);
document.getElementById("matchesBtn").addEventListener("click", getMatchData);
document.getElementById("refreshBtn").addEventListener("click", getMatchData);

// Initial load - show matches by default
getMatchData();
