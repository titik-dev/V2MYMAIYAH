
const query = `
  query CheckPostsQuery {
    posts(first: 5, where: { orderby: { field: DATE, order: DESC }, ignoreStickyPosts: true }) {
      nodes {
        title
        date
      }
    }
  }
`;

async function checkQuery() {
    try {
        const res = await fetch('http://localhost/v2maiyah/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });

        const json = await res.json();
        if (json.errors) {
            console.error("Query Failed!");
            console.error(JSON.stringify(json.errors, null, 2));
        } else {
            console.log("Query Success!");
            console.log(JSON.stringify(json.data.posts.nodes, null, 2));
        }

    } catch (error) {
        console.error("Network Error:", error);
    }
}

checkQuery();
