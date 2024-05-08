async function getMatchData() {
    try {
        const response = await fetch("https://api.cricapi.com/v1/currentMatches?apikey=eb21d9c2-74d8-4a2f-864d-1764b26a37f1&offset=0");
        const data = await response.json();

        if (data.status !== "success") return;

        const matchesList = data.data;

        if (!matchesList) return [];

        const relevantData = matchesList.map(match => {
            const { name, status, score, teams, teamInfo } = match;
            const team1 = teams[0];
            const team2 = teams[1];

            // Check if teamInfo array exists and has at least one element
            if (Array.isArray(teamInfo) && teamInfo.length > 0) {
                const team1img = teamInfo.find(i => i.name === `${team1}`) || {};
                const team2img = teamInfo.find(i => i.name === `${team2}`) || {};

                // Check if score array exists and has at least one element
                if (Array.isArray(score) && score.length > 0) {
                    const { r: r1, w: w1, o: o1 } = score.find(s => s.inning === `${team1} Inning 1`) || {};
                    const { r: r2, w: w2, o: o2 } = score.find(s => s.inning === `${team2} Inning 1`) || {};

                    return `<div class="match-name">${name}</div>
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
                } else {
                    // Handle the case when the score array is empty or missing
                    return `<div class="match-name">${name}</div>
                        <div class="match-details">
                            <div class="team-details">
                                <span class="team-name">
                                    <img class="team-img" src="${team1img.img}" />
                                    ${team1} [${team1img.shortname}]</span>
                                <span class="team-stats">N/A</span>
                            </div>
                            <div class="team-details">
                                <span class="team-name">
                                    <img class="team-img" src="${team2img.img}" />
                                    ${team2}  [${team2img.shortname}]</span>
                                <span class="team-stats">N/A</span>
                            </div>
                            <div class="match-status">${status}</div>
                        </div>`;
                }
            } else {
                // Handle the case when teamInfo array is empty or missing
                // You can provide default values or skip processing altogether
                return '';
            }
        });

        const matchesElement = document.getElementById("matches");
        matchesElement.innerHTML = relevantData.map(match => `<li>${match}</li>`).join('');

        return relevantData;
    } catch (e) {
        console.error(e);
    }
}

document.getElementById("matchesBtn").addEventListener("click", getMatchData);
document.getElementById("refreshBtn").addEventListener("click", getMatchData);

// Initial load - show matches by default
getMatchData();
