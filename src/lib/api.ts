import { notFound } from "next/navigation";

const API_URL = "https://assets.mymaiyah.id/graphql";



async function fetchAPI(query: string, { variables, nextOptions }: { variables?: Record<string, any>, nextOptions?: RequestInit['next'] } = {}) {
  // Using GET for simplicity and robustness in this local env
  let url = `${API_URL}?query=${encodeURIComponent(query)}`;
  if (variables) {
    url += `&variables=${encodeURIComponent(JSON.stringify(variables))}`;
  }

  // console.log("Fetching GET:", url);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: nextOptions || { revalidate: 60 }, // Defaultrevalidate: 60s, overrideable
    });

    if (res.status !== 200) {
      console.error(`API Error: Status ${res.status}`);
      throw new Error("Failed to fetch API");
    }

    const json = await res.json();
    if (json.errors) {
      console.error("GraphQL Errors Full Details:", JSON.stringify(json.errors, null, 2));
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

export async function getPostsBySlugs(slugs: string[]) {
  const promises = slugs.map((slug) => getPostBySlug(slug));
  const results = await Promise.all(promises);
  return results.filter((post) => post !== null && post !== undefined);
}

export async function getHomepageData() {
  try {
    const [mainData, popularPostsData] = await Promise.all([
      fetchAPI(`
      query HomepageData {
        posts(first: 10, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
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
        maiyahOptionsData {
          maiyahGlobalSettings {
            homepageSettings {
              featuredContentMode
              sectionTitleCeklis
              sectionTitleLatest
              sectionTitlePopular
              featuredPosts(first: 100) {
                nodes {
                  ... on Post {
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
      }
      `, { nextOptions: { revalidate: 0 } }),
      // Separate Fetch for Popular Posts (Safe Mode)
      fetchAPI(`
        query PopularPostsSAFE {
          wppPopularPosts(first: 10) {
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
      `).catch(err => {
        console.warn("Popular Posts Fetch Failed (Ignored):", err.message);
        return null;
      })
    ]);

    const data = mainData;
    const popularPosts = popularPostsData?.wppPopularPosts || [];

    const settings = data?.maiyahOptionsData?.maiyahGlobalSettings?.homepageSettings;
    const mode = settings?.featuredContentMode || 'manual';

    let featuredPosts = [];

    if (mode === 'popular') {
      featuredPosts = popularPosts;
    } else if (mode === 'latest') {
      featuredPosts = data?.posts?.nodes || [];
    } else {
      // Manual Mode
      featuredPosts = settings?.featuredPosts?.nodes || [];
    }

    return {
      ads: settings?.ceklisAds || [],
      featuredPosts,
      mode,
      sectionTitles: {
        ceklis: settings?.sectionTitleCeklis || "Ceklis",
        latest: settings?.sectionTitleLatest || "Berita Terbaru",
        popular: settings?.sectionTitlePopular || "Berita Terpopuler"
      }
    };
  } catch (error) {
    console.warn("Homepage Data Fetch Warning (Using Default):", error);
    return {
      ads: [],
      featuredPosts: [],
      mode: 'manual',
      sectionTitles: {
        ceklis: "Ceklis",
        latest: "Berita Terbaru",
        popular: "Berita Terpopuler"
      }
    };
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
    query PostsByCategory($id: ID!, $idType: CategoryIdType!, $categoryName: String) {
      category(id: $id, idType: $idType) {
        name
        slug
      }
      posts(first: 20, where: { categoryName: $categoryName, orderby: { field: DATE, order: DESC } }) {
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
    `,
    {
      variables: {
        id: slug,
        idType: "SLUG",
        categoryName: slug
      },
    }
  );

  // Merge the root posts query result into the category object structure
  // This ensures frontend compatibility without changing page components
  if (data?.category && data?.posts) {
    return {
      ...data.category,
      posts: data.posts
    };
  }

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

export async function getGlobalNavigation() {
  try {
    const data = await fetchAPI(
      `
      query GetGlobalNavigation {
        maiyahOptionsData {
          maiyahGlobalSettings {
            globalNavigationManager {
              desktopMenuItems {
                label
                url
                subMenuItems {
                  label
                  url
                }
              }
              mobileDrawerItems {
                label
                url
                subMenuItems {
                  label
                  url
                }
              }
              pillMenuItems {
                label
                url
              }
              bottomNavItems {
                label
                url
                icon {
                  node {
                    sourceUrl
                    altText
                  }
                }
              }
            }
          }
        }
      }
      `
    );
    return data?.maiyahOptionsData?.maiyahGlobalSettings?.globalNavigationManager;
  } catch (error) {
    console.warn("Global Navigation Fetch Failed (Schema might be out of sync):", error);
    // Return null or empty structure so the app can continue rendering with fallbacks
    return null;
  }
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
            agendaLogo {
              node {
                sourceUrl
                altText
              }
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
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
      agendaLogo {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
}
`,
    { variables: { id: slug } }
  );
  return data?.agenda;
}

export async function getFooterData() {
  try {
    const data = await fetchAPI(
      `
      query GetFooterData {
        maiyahOptionsData {
          maiyahGlobalSettings {
            footerManager {
              footerDescription
                footerLogos {
                  logoImage {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                  logoImageDark {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                  logoUrl
                }
              footerSocials {
                platform
                url
              }
              footerCopyright
              footerLinkColumns {
                columnTitle
                columnLinks {
                  label
                  url
                }
              }
            }
          }
        }
      }
      `
    );
    return data?.maiyahOptionsData?.maiyahGlobalSettings?.footerManager;
  } catch (error) {
    return null;
  }
}

export async function getThemeCustomization() {
  try {
    const data = await fetchAPI(
      `
      query GetThemeCustomization {
        maiyahOptionsData {
          maiyahGlobalSettings {
            themeCustomization {
              customCss
            }
          }
        }
      }
      `
    );
    return data?.maiyahOptionsData?.maiyahGlobalSettings?.themeCustomization;
  } catch (error) {
    console.warn("Theme Customization Fetch Failed:", error);
    return null;
  }
}

