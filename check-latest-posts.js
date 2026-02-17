


async function checkLatestPosts() {
    const query = `
    query LatestPostsCheck {
      posts(first: 5, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          title
          date
          id
          slug
        }
      }
    }
  `;

    try {
        const response = await fetch('http://localhost/v2maiyah/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        const json = await response.json();

        if (json.errors) {
            console.error('GraphQL Errors:', json.errors);
        } else {
            console.log('--- Latest 5 Posts from API (Ordered by DATE DESC) ---');
            json.data.posts.nodes.forEach((post, index) => {
                console.log(`${index + 1}. [${post.date}] ${post.title}`);
            });
        }
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

checkLatestPosts();
