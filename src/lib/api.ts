import { notFound } from "next/navigation";

const API_URL = "https://assets.mymaiyah.id/graphql";

// Allow self-signed certificates for local development
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

async function fetchAPI(query: string, { variables }: { variables?: Record<string, any> } = {}) {
  // Using GET for simplicity and robustness in this local env
  let url = `${API_URL}?query=${encodeURIComponent(query)}`;
  if (variables) {
    url += `&variables=${encodeURIComponent(JSON.stringify(variables))}`;
  }

  console.log("Fetching GET:", url);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
    });

    if (res.status !== 200) {
      console.error(`API Error: Status ${res.status}`);
      throw new Error("Failed to fetch API");
    }

    const json = await res.json();
    if (json.errors) {
      console.error("GraphQL Errors:", json.errors);
      throw new Error("Failed to fetch API");
    }
    return json.data;
  } catch (err) {
    console.error("FetchAPI Exception:", err);
    throw err;
  }
}

export async function getAllPostsForHome() {
  const data = await fetchAPI(
    `
    query AllPosts {
      posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            id
            title
            slug
            excerpt
            date
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            categories {
              edges {
                node {
                  name
                  slug
                }
              }
            }
            author {
              node {
                name
                avatar {
                  url
                }
              }
            }
          }
        }
      }
    }
  `,
  );
  return data?.posts;
}

export async function getPrimaryMenu() {
  // Ideally this fetches from WP Menu, but for now we can mock or fetch categories
  const data = await fetchAPI(
    `
    query GetCategories {
      categories(first: 10, where: { parent: null }) {
        edges {
          node {
            id
            name
            slug
            count
          }
        }
      }
    }
    `
  );
  return data?.categories;
}

export async function getPostBySlug(slug: string) {
  const data = await fetchAPI(
    `
    query PostBySlug($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        id
        databaseId
        title
        slug
        content
        date
        modified
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
        customAuthor {
          nama
          deskripsi
        }
        categories {
          edges {
            node {
              name
              slug
            }
          }
        }
        customTitle {
          subJudulBawah
        }
      }
    }
  `,
    {
      variables: {
        id: slug,
        idType: 'SLUG',
      },
    }
  );
  return data?.post;
}

export async function getHomepageAds() {
  try {
    const data = await fetchAPI(
      `
      query HomepageAds {
        page(id: "/", idType: URI) {
          homepageSettings {
            ceklisAds {
              gambar {
                node {
                  sourceUrl
                  altText
                }
              }
              url
            }
          }
        }
      }
    `
    );
    return data?.page?.homepageSettings?.ceklisAds || [];
  } catch (error) {
    console.warn("Homepage Ads Fetch Warning (Using Default):", error);
    return [];
  }
}

export async function getRelatedPosts(categorySlug: string, count = 3) {
  const data = await fetchAPI(
    `
    query RelatedPosts($categoryName: String, $first: Int) {
      posts(first: $first, where: { categoryName: $categoryName }) {
        edges {
          node {
            id
            title
            slug
            date
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            categories {
              edges {
                node {
                  name
                }
              }
            }
          }
        }
      }
    }
    `,
    {
      variables: {
        categoryName: categorySlug,
        first: count
      }
    }
  );
  return data?.posts;
}

export async function searchPosts(term: string) {
  const data = await fetchAPI(
    `
    query SearchPosts($search: String!) {
      posts(first: 20, where: { search: $search }) {
        edges {
          node {
            id
            title
            slug
            excerpt
            date
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            author {
              node {
                name
              }
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        search: term,
      },
    }
  );
  return data?.posts;
}

export async function getPostsByCategory(slug: string) {
  const data = await fetchAPI(
    `
    query PostsByCategory($id: ID!, $idType: CategoryIdType!) {
      category(id: $id, idType: $idType) {
        name
        slug
        posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
          edges {
            node {
              id
              databaseId
              title
              slug
              excerpt
              date
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
              author {
                node {
                  name
                }
              }
              customTitle {
                subJudulBawah
              }
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        id: slug,
        idType: "SLUG",
      },
    }
  );
  return data?.category;
}

export async function getGlobalMenu() {
  const data = await fetchAPI(
    `
    query GetGlobalMenu {
      page(id: "/", idType: URI) {
        mainMenuManager {
          mainMenuItems {
            label
            url
            subMenuItems {
              label
              url
            }
          }
        }
      }
    }
    `
  );

  return data?.page?.mainMenuManager?.mainMenuItems || [];
}

export async function getAgendas() {
  const data = await fetchAPI(
    `
    query GetAgendas {
      agendas(first: 100, where: { orderby: { field: DATE, order: ASC } }) {
        nodes {
          id
          title
          slug
          agendaDetails {
            tanggalEvent
            lokasi
            jenisAcara
          }
        }
      }
    }
    `
  );
  return data?.agendas?.nodes;
}

export async function getAgendaBySlug(slug: string) {
  const data = await fetchAPI(
    `
    query GetAgendaBySlug($id: ID!) {
      agenda(id: $id, idType: SLUG) {
        title
        content
        slug
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        agendaDetails {
          tanggalEvent
          lokasi
          jenisAcara
        }
      }
    }
    `,
    { variables: { id: slug } }
  );
  return data?.agenda;
}

