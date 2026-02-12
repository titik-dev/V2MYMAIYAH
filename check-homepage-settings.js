
const query = `
  query CheckHomepageSettings {
    maiyahOptionsData {
      maiyahGlobalSettings {
        homepageSettings {
          sectionTitleCeklis
          sectionTitleLatest
          sectionTitlePopular
        }
      }
    }
  }
`;

async function checkSettings() {
    try {
        const res = await fetch('https://assets.mymaiyah.id/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });

        const json = await res.json();
        console.log("Full JSON Response:");
        console.log(JSON.stringify(json, null, 2));

    } catch (error) {
        console.error("Error fetching settings:", error);
    }
}

checkSettings();
