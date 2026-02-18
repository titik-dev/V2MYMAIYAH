import { WORDPRESS_API_URL, WORDPRESS_SITE_URL } from "@/lib/wp";
import { readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_CONTRIBUTOR_AVATAR = `${WORDPRESS_SITE_URL}/wp-content/uploads/2022/10/82627C46-5A91-4B80-ABD7-215EB88E92DA-768x768.jpeg`;
const CONTRIBUTOR_LIST_FILE = "list BEBERAPA kontributor.txt";



async function fetchAPI(query: string, { variables, nextOptions }: { variables?: Record<string, any>, nextOptions?: RequestInit['next'] } = {}) {
  try {
    const res = await fetch(WORDPRESS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: variables || {},
      }),
      next: nextOptions || { revalidate: 60 }, // Defaultrevalidate: 60s, overrideable
    });

    if (res.status !== 200) {
      const responseBody = await res.text().catch(() => "");
      console.error(`API Error: Status ${res.status}`, responseBody);
      throw new Error(`Failed to fetch API (${res.status}) from ${WORDPRESS_API_URL}`);
    }

    const json = await res.json();
    if (json.errors) {
      console.warn("GraphQL Errors (Partial Data):", JSON.stringify(json.errors, null, 2));
      // If data exists, return it despite errors (Partial Success)
      // Only throw if data is completely missng
      if (!json.data) {
        const firstError = json.errors?.[0]?.message || "Unknown GraphQL error";
        throw new Error(`Failed to fetch API: ${firstError}`);
      }
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
            databaseId
            name
            description
            avatar {
              url
            }
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

  if (!data?.post) return null;

  return {
    ...data.post,
    customAuthor: null,
    customTitle: null,
    author: {
      ...data.post.author,
      node: {
        ...data.post.author?.node,
        authorProfile: null,
        url: null,
      },
    },
  };
}

function normalizeIdentity(value: string): string {
  return (value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function tokenizeIdentity(value: string): string[] {
  return (value || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);
}

const COMMON_NAME_TOKENS = new Set([
  "muhammad",
  "mohammad",
  "muhamad",
  "mohamad",
  "ahmad",
  "abdul",
  "bin",
  "binti",
  "al",
]);

function getSignificantTokens(tokens: string[]): string[] {
  return tokens.filter((token) => !COMMON_NAME_TOKENS.has(token));
}

function pickLocalAvatarUrl({
  databaseId,
  slug,
  name,
  acfPhoto,
  legacyAvatarMap,
  legacyAvatarBySlugMap,
  mediaCandidates,
}: {
  databaseId?: number;
  slug?: string;
  name?: string;
  acfPhoto?: string | null;
  legacyAvatarMap?: Map<number, string>;
  legacyAvatarBySlugMap?: Map<string, string>;
  mediaCandidates: Array<{ sourceUrl?: string; slug?: string; title?: string }>;
}): string | null {
  if (acfPhoto) return acfPhoto;
  if (databaseId && legacyAvatarMap?.has(databaseId)) {
    return legacyAvatarMap.get(databaseId) || null;
  }
  if (slug && legacyAvatarBySlugMap?.has(slug)) {
    return legacyAvatarBySlugMap.get(slug) || null;
  }

  const slugKey = normalizeIdentity(slug || "");
  const nameKey = normalizeIdentity(name || "");
  const slugTokens = tokenizeIdentity(slug || "");
  const nameTokens = tokenizeIdentity(name || "");
  const significantSlugTokens = getSignificantTokens(slugTokens);
  const significantNameTokens = getSignificantTokens(nameTokens);
  if (!slugKey && !nameKey) return null;

  const scoreCandidate = (candidate: string): number => {
    let score = 0;

    if (slugKey && candidate.includes(slugKey)) score += 100;
    if (nameKey && candidate.includes(nameKey)) score += 90;

    const sigSlugHits = significantSlugTokens.filter((token) => candidate.includes(token)).length;
    const sigNameHits = significantNameTokens.filter((token) => candidate.includes(token)).length;
    const slugHits = slugTokens.filter((token) => candidate.includes(token)).length;
    const nameHits = nameTokens.filter((token) => candidate.includes(token)).length;

    if (sigSlugHits >= 2 || sigNameHits >= 2) score += 60;
    else if (sigSlugHits >= 1 || sigNameHits >= 1) score += 35;

    if (slugHits >= 2 || nameHits >= 2) score += 20;

    return score;
  };

  const ranked = mediaCandidates
    .map((item) => {
      const mediaSlug = normalizeIdentity(item.slug || "");
      const mediaTitle = normalizeIdentity(item.title || "");
      const mediaUrl = normalizeIdentity(item.sourceUrl || "");
      const combined = `${mediaSlug}${mediaTitle}${mediaUrl}`;
      return {
        item,
        score: scoreCandidate(combined),
      };
    })
    .filter((entry) => entry.score >= 60)
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.item?.sourceUrl || null;
}

function resolveContributorAvatar(
  localAvatar: string | null,
  avatarUrl: string | null | undefined
): string | null {
  if (localAvatar) return localAvatar;

  const safeAvatar = (avatarUrl || "").trim();
  if (!safeAvatar) return DEFAULT_CONTRIBUTOR_AVATAR;

  // When WP falls back to wp_user_avatar through Gravatar, prefer local placeholder
  // to avoid broken external loads and keep visual consistent with legacy WP pages.
  if (
    /secure\.gravatar\.com/i.test(safeAvatar) &&
    /[?&]d=wp_user_avatar\b/i.test(safeAvatar)
  ) {
    return DEFAULT_CONTRIBUTOR_AVATAR;
  }

  return safeAvatar;
}

async function getLegacyAuthorAvatarMap(): Promise<Map<number, string>> {
  try {
    const response = await fetch(`${WORDPRESS_SITE_URL}/kontributor/`, {
      // Legacy HTML list is relatively static; 30m cache is acceptable.
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      return new Map();
    }

    const html = await response.text();
    const result = new Map<number, string>();

    const pattern =
      /about-author-(\d+)[\s\S]*?<img[^>]+src="([^"]+)"/gi;

    let match: RegExpExecArray | null = pattern.exec(html);
    while (match) {
      const id = Number(match[1]);
      const src = match[2];
      if (id && src) {
        result.set(
          id,
          src
            .replace(/^https?:\/\/assets\.mymaiya\.id/i, "https://assets.mymaiyah.id")
            .replace(/^https?:\/\/mymaiya\.id/i, "https://mymaiyah.id")
        );
      }
      match = pattern.exec(html);
    }

    return result;
  } catch {
    return new Map();
  }
}

async function getAuthorAvatarMapFromLocalFile(): Promise<{
  byId: Map<number, string>;
  bySlug: Map<string, string>;
}> {
  const byId = new Map<number, string>();
  const bySlug = new Map<string, string>();

  try {
    const filePath = path.join(process.cwd(), CONTRIBUTOR_LIST_FILE);
    const html = await readFile(filePath, "utf8");

    const pattern =
      /about-author-(\d+)[\s\S]*?<a href="[^"]*\/author\/([^\/"]+)\/"[\s\S]*?<img[^>]+src="([^"]+)"/gi;

    let match: RegExpExecArray | null = pattern.exec(html);
    while (match) {
      const id = Number(match[1]);
      const slug = (match[2] || "").trim();
      const src = (match[3] || "")
        .replace(/^https?:\/\/assets\.mymaiya\.id/i, "https://assets.mymaiyah.id")
        .replace(/^https?:\/\/mymaiya\.id/i, "https://mymaiyah.id");

      if (id && src) byId.set(id, src);
      if (slug && src) bySlug.set(slug, src);

      match = pattern.exec(html);
    }
  } catch {
    return { byId, bySlug };
  }

  return { byId, bySlug };
}

async function getAuthorPageAvatarBySlug(slug: string): Promise<string | null> {
  if (!slug) return null;

  try {
    const response = await fetch(`${WORDPRESS_SITE_URL}/author/${slug}/`, {
      next: { revalidate: 1800 },
    });
    if (!response.ok) return null;

    const html = await response.text();
    const match = html.match(
      /<img[^>]+class="[^"]*wp-user-avatar[^"]*"[^>]+src="([^"]+)"/i
    );

    if (!match?.[1]) return null;
    return match[1]
      .replace(/^https?:\/\/assets\.mymaiya\.id/i, "https://assets.mymaiyah.id")
      .replace(/^https?:\/\/mymaiya\.id/i, "https://mymaiyah.id");
  } catch {
    return null;
  }
}

export async function getPostsBySlugs(slugs: string[]) {
  const promises = slugs.map((slug) => getPostBySlug(slug));
  const results = await Promise.all(promises);
  return results.filter((post) => post !== null && post !== undefined);
}

export async function getPostsByAuthor(authorId: number, excludePostId: number) {
  const data = await fetchAPI(
    `
    query PostsByAuthor($authorId: Int, $notIn: [ID]) {
      posts(first: 3, where: { author: $authorId, notIn: $notIn, orderby: { field: DATE, order: DESC } }) {
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
                slug
              }
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        authorId: authorId,
        notIn: [excludePostId]
      }
    }
  );
  return data?.posts?.nodes || [];
}

export async function getContributors() {
  const [contributorsData, mediaData, legacyAvatarMap, localFileAvatarMaps] = await Promise.all([
    fetchAPI(
      `
      query ContributorsList {
        users(first: 200) {
          nodes {
            id
            databaseId
            name
            slug
            description
            avatar {
              url
            }
            authorProfile {
              fotoProfil {
                node {
                  sourceUrl
                }
              }
            }
            posts(first: 1) {
              nodes {
                id
              }
            }
          }
        }
      }
      `
    ),
    fetchAPI(
      `
      query ContributorAvatarCandidates {
        mediaItems(first: 300, where: { search: "avatar-" }) {
          nodes {
            slug
            sourceUrl
            title
          }
        }
      }
      `
    ),
    getLegacyAuthorAvatarMap(),
    getAuthorAvatarMapFromLocalFile(),
  ]);

  const users = contributorsData?.users?.nodes || [];
  const mediaCandidates = mediaData?.mediaItems?.nodes || [];

  return users
    .filter((user: any) => user?.posts?.nodes?.length > 0)
    .map((user: any) => {
      const localAvatar = pickLocalAvatarUrl({
        databaseId: user?.databaseId,
        slug: user?.slug,
        name: user?.name,
        acfPhoto: user?.authorProfile?.fotoProfil?.node?.sourceUrl,
        legacyAvatarMap: localFileAvatarMaps?.byId?.size ? localFileAvatarMaps.byId : legacyAvatarMap,
        legacyAvatarBySlugMap: localFileAvatarMaps?.bySlug,
        mediaCandidates,
      });

      return {
        ...user,
        avatar: {
          url: resolveContributorAvatar(localAvatar, user?.avatar?.url),
        },
      };
    })
    .sort((a: any, b: any) => (a?.name || "").localeCompare(b?.name || "", "id"));
}

export async function getContributorArchiveBySlug(slug: string) {
  const [userData, mediaData, legacyAvatarMap, localFileAvatarMaps] = await Promise.all([
    fetchAPI(
      `
      query ContributorArchive($id: ID!) {
        user(id: $id, idType: SLUG) {
          id
          databaseId
          name
          slug
          description
          avatar {
            url
          }
          authorProfile {
            fotoProfil {
              node {
                sourceUrl
              }
            }
          }
          posts(first: 30, where: { orderby: { field: DATE, order: DESC } }) {
            nodes {
              id
              title
              slug
              date
              excerpt
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
            }
          }
        }
      }
      `,
      {
        variables: {
          id: slug,
        },
      }
    ),
    fetchAPI(
      `
      query ContributorAvatarCandidates {
        mediaItems(first: 300, where: { search: "avatar-" }) {
          nodes {
            slug
            sourceUrl
            title
          }
        }
      }
      `
    ),
    getLegacyAuthorAvatarMap(),
    getAuthorAvatarMapFromLocalFile(),
  ]);

  const user = userData?.user;
  if (!user) return null;

  const localAvatar = pickLocalAvatarUrl({
    databaseId: user?.databaseId,
    slug: user?.slug,
    name: user?.name,
    acfPhoto: user?.authorProfile?.fotoProfil?.node?.sourceUrl,
    legacyAvatarMap: localFileAvatarMaps?.byId?.size ? localFileAvatarMaps.byId : legacyAvatarMap,
    legacyAvatarBySlugMap: localFileAvatarMaps?.bySlug,
    mediaCandidates: mediaData?.mediaItems?.nodes || [],
  });

  const authorPageAvatar = await getAuthorPageAvatarBySlug(user?.slug || slug);

  return {
    ...user,
    avatar: {
      url: resolveContributorAvatar(
        localAvatar || authorPageAvatar,
        user?.avatar?.url
      ),
    },
  };
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

export async function getPageByUri(uri: string) {
  const normalizedUri = uri.startsWith("/") ? uri : `/${uri}`;
  const safeUri = normalizedUri.endsWith("/") ? normalizedUri : `${normalizedUri}/`;

  const data = await fetchAPI(
    `
    query PageByUri($id: ID!) {
      page(id: $id, idType: URI) {
        id
        title
        slug
        uri
        content
        status
      }
    }
    `,
    {
      variables: {
        id: safeUri,
      },
    }
  );

  return data?.page || null;
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
              mobileDrawerLogo {
                node {
                  id
                  sourceUrl
                  altText
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

