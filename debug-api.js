
const API_URL = "https://assets.mymaiyah.id/graphql";

async function debugRootPosts() {
    console.log("Debugging Root Posts Query for 'esai'...");

    // Removing 'total' to fix the error
    const query = `
    query {
        # Fetch category connection for count context
        category(id: "esai", idType: SLUG) {
            name
            slug
            count
        }

        # Fetch actual posts via root query (hoping it includes children)
        posts(first: 10, where: { categoryName: "esai" }) {
            edges {
                node {
                    title
                    categories {
                        nodes {
                            name
                        }
                    }
                }
            }
        }
    }
    `;

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        const data = await res.json();
        const posts = data.data.posts.edges;

        console.log(`\nFound ${posts.length} posts via Root Query!`);
        posts.forEach((edge, i) => {
            console.log(`${i + 1}. ${edge.node.title} [${edge.node.categories.nodes.map(c => c.name).join(', ')}]`);
        });

    } catch (e) {
        console.error(e);
    }
}

debugRootPosts();
