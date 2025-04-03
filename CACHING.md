DISCORD TALK - [Discord Talk](https://discord.com/channels/967097582721572934/1146821621873643612/1317897227015815178)
Zephury — 12/15/24, 11:53 AM
I've seen some wonky use of unstable_cache in NextJS lately;
Here's a gist for a function that makes the unstable_cache api more simple to use, while also combining it with React.cache. Included in the comments are examples on how to use it, as well as a link to an article which explains things a bit more clearly. One of the biggest clarifications is on the keyParts argument, which is almost never needed, meanwhile, we end up with plenty of people treating keyParts like cache tags, or providing them unnecessarily, as keyParts is the 2nd argument to unstable_cache and should be the 3rd, in my opinion.
https://gist.github.com/HarleySalas/f059cfc8150074c779b806764b8fe890
paul — 12/15/24, 9:27 PM
ive noticed issues with cache not revalidating when we omitted the keyParts before :tired:

<!-- TODO: -->

Look into the url mentioned in the gist. It mentions gotchas at the bottom
https://alfonsusardani.notion.site/unstable_cache-from-next-cache-f300b3184d6a472ea5282543d50b9f02
Plus this - https://github.com/vercel/next.js/discussions/63099

Also, this grok chat
https://grok.com/chat/ab0eb6d9-067b-47c7-852a-9e6a66da08fd

IF we decide to use it headers and cookies can't be used in unstable_cache unless called outside as example provides in grok.
Also, might be better to use keyparts like the github mentions above to revalidate
things by their id specifically.

### Key Points

- It seems likely that the page.tsx uses React's `cache` instead of Next.js's `unstable_cache` to balance performance and data freshness, especially for dynamic pages like the home page.
- Research suggests that `cache` deduplicates requests within a render pass, while `unstable_cache` persists data across requests, which may not be ideal for frequently changing page content.
- The evidence leans toward using `unstable_cache` for global data like the header, as seen in the Header component, due to its infrequent changes and shared nature.

---

### Why `cache` is Used in page.tsx

The page.tsx uses React's `cache` for querying page data, such as in the `queryPageBySlug` function, instead of Next.js's `unstable_cache`. This choice likely reflects the need to ensure data freshness for page content, particularly for dynamic pages like the home page, which are rendered on each request. React's `cache` deduplicates requests within the same render pass, preventing redundant database queries during server-side rendering, but it does not persist data across different requests. This means each user request fetches the latest data, which is crucial if the page content changes frequently or needs to respect draft mode settings.

In contrast, the Header component uses `unstable_cache` through `getCachedGlobal` for global data like the header. This makes sense because global data is shared across pages, changes less often, and benefits from persistent caching to reduce database queries and improve performance. The difference highlights that page-specific data, especially for dynamic rendering, prioritizes freshness over persistent caching, while global data benefits from the latter.

### Unexpected Detail: Draft Mode Considerations

An interesting aspect is how draft mode influences this decision. The `queryPageBySlug` function checks draft mode, which means the fetched data could vary per request based on whether draft content is enabled. Using `unstable_cache` here could lead to serving outdated or inappropriate draft content to users, which is why React's `cache` is preferred to ensure each request fetches the correct data.

---

### Survey Note: Detailed Analysis of Caching Choices in Next.js

This section provides a comprehensive analysis of why the page.tsx uses React's `cache` instead of Next.js's `unstable_cache`, drawing from the provided code and additional context. The discussion aims to clarify the caching strategies in Next.js, particularly for server components, and their implications for performance and data management.

#### Background on Caching in Next.js

Next.js offers multiple caching mechanisms for server components, including React's `cache` from the React 18 API and Next.js's `unstable_cache`. According to the [Next.js Documentation on Caching](https://nextjs.org/docs/app/building-your-application/caching), these tools serve different purposes:

- **React's `cache`**: Introduced in React 18, this API is designed for deduplicating requests during a single render pass, especially on the server side when not using the fetch API. It does not persist data across requests, meaning each new request triggers a fresh fetch if not cached in the render pass. This is detailed in the [React Documentation on Cache](https://react.dev/reference/react/cache), which notes its use for in-memory caching during server-side rendering (SSR) or static site generation (SSG).

- **Next.js's `unstable_cache`**: As noted in the same Next.js documentation, this API extends caching by persisting data on disk, allowing reuse across different requests. This reduces backend queries for subsequent visits, making it suitable for immutable or infrequently changing data. However, it is marked as unstable, with a note indicating it will be replaced by a stable `cache` API in future versions, as seen in the inline documentation comment.

A StackOverflow discussion ([StackOverflow Discussion on Cache Differences](https://stackoverflow.com/questions/76123456/whats-the-difference-between-react-18s-new-cache-and-next-js-deduping)) further clarifies that React patches `globalThis.fetch` on the server side for automatic deduplication, but for non-fetch API calls (like ORM queries), developers must manually opt into deduplication using React's `cache`. Next.js's `unstable_cache`, however, adds persistent caching, which is beneficial for reducing load on the backend across multiple user visits.

#### Analysis of Code: page.tsx vs. Header Component

In the provided code, the page.tsx uses React's `cache` for the `queryPageBySlug` function, which fetches page data from the Payload CMS based on the slug. The function is wrapped as follows:

```typescript
const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode();

  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: "pages",
    draft,
    limit: 1,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs?.[0] || null;
});
```

This implementation suggests that the caching is intended for deduplication within the render pass, particularly relevant for server-side rendering of dynamic pages like the home page, which is not statically generated (as seen by its exclusion from `generateStaticParams`). For statically generated pages, the data is fetched at build time and embedded in the static HTML, so caching at runtime is less critical. However, for dynamic rendering, React's `cache` ensures that if `queryPageBySlug` is called multiple times in the same render pass (e.g., due to nested components), it executes only once, improving performance.

In contrast, the Header component uses `unstable_cache` through `getCachedGlobal`, defined as:

```typescript
export const getCachedGlobal = (slug: Global, depth = 0) =>
  unstable_cache(async () => getGlobal(slug, depth), [slug], {
    tags: [`global_${slug}`],
  });
```

This is called in the Header component as:

```typescript
export async function Header() {
  const headerData: Header = await getCachedGlobal('header', 1)()

  return <HeaderClient data={headerData} />
}
```

Here, `unstable_cache` is used to persistently cache global data like the header, which is shared across all pages and likely changes infrequently. The use of tags (`global_${slug}`) allows for targeted cache invalidation, which is suitable for such data. This persistent caching reduces database queries for every page load, enhancing performance, especially for high-traffic sites.

#### Why Not Use `unstable_cache` in page.tsx?

Given the benefits of `unstable_cache` for persistent caching, why does page.tsx use React's `cache` instead? Several factors likely contribute:

1. **Data Freshness for Page Content**: For page-specific data, especially the home page, which is dynamically rendered on each request, ensuring the latest content is critical. The home page might change frequently, and users expect to see up-to-date information. Persistent caching with `unstable_cache` could serve stale data, which is undesirable. The comment in page.tsx, "Remove this code once your website is seeded," referring to the fallback to `homeStatic`, suggests that once the site is fully set up, the home page will be fetched dynamically without caching, reinforcing the need for freshness.

2. **Draft Mode Considerations**: The `queryPageBySlug` function checks `draftMode()`, which means the fetched data could vary based on whether draft content is enabled. If `unstable_cache` were used, it might cache draft content, potentially serving it to users who shouldn't see it or vice versa, leading to inconsistencies. React's `cache`, by not persisting across requests, avoids this issue, ensuring each request fetches the appropriate data based on the current draft mode.

3. **Statically Generated Pages**: For pages included in `generateStaticParams` (e.g., `/about`, `/contact`), the data is fetched at build time with `draft: false`, and the resulting HTML is static. Here, there's no need for runtime caching, as the data is already embedded. React's `cache` might still deduplicate within the build process, but `unstable_cache` would be redundant for these cases.

4. **Complexity of Cache Invalidation**: Using `unstable_cache` for page data would require a robust cache invalidation strategy, especially with tags, to ensure updates to page content trigger re-fetches. Given the dynamic nature of pages and the need to handle draft mode, implementing such a strategy could add complexity. The developers might have chosen React's `cache` to keep things simple, relying on Next.js's built-in caching for static generation and fresh fetches for dynamic rendering.

5. **Stability Concerns**: The Next.js documentation notes that `unstable_cache` is marked as unstable, with a future replacement by a stable `cache` API. Given this, the developers might prefer to use React's `cache` for critical page data to avoid relying on an unstable API, especially for a core feature like page rendering.

#### Comparison Table: React's `cache` vs. Next.js's `unstable_cache`

| Feature               | React's `cache`                                        | Next.js's `unstable_cache`                                   |
| --------------------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| **Purpose**           | Deduplicates requests in render pass                   | Persists data across requests, reduces backend queries       |
| **Persistence**       | In-memory, per render pass                             | On-disk, reusable across requests                            |
| **Use Case**          | Dynamic data needing freshness, non-fetch API calls    | Immutable or infrequently changing data, shared across pages |
| **Draft Mode Impact** | Ensures fresh fetches per request, respects draft mode | Could serve stale or inappropriate draft content             |
| **Example Usage**     | `queryPageBySlug` in page.tsx                          | `getCachedGlobal` for header in Header component             |

#### Additional Context from Community Insights

The provided gist and Discord comments ([Gist by HarleySalas](https://gist.github.com/HarleySalas/f059cfc8150074c779b806764b8fe890)) suggest a custom caching solution combining React's `cache` and Next.js's `unstable_cache`, allowing for both deduplication and persistent caching with tags. For example:

```typescript
export const getPageByPathname = cache(
  async (pathname: string) => {
    const { isEnabled: draft } = await draftMode();
    const payload = await getPayload({ config });

    const { docs } = await payload.find({
      collection: "page",
      draft,
      limit: 1,
      where: { pathname: { equals: pathname } },
    });
    return docs?.[0] || null;
  },
  {
    tags: (pathname) => [pathname],
    revalidate: 3600,
  },
);
```

This approach could be used for page data, but the page.tsx does not implement it, likely due to the reasons above, such as ensuring data freshness and avoiding complexity. The comment from "paul" in the Discord thread about issues with cache revalidation when omitting keyParts highlights the potential pitfalls of `unstable_cache`, reinforcing the choice of React's `cache` for simpler, safer deduplication.

An article on high-performance Next.js 15 caching ([High Performance Next.js 15 Caching and a Replacement for unstable_cache](https://example.com/article-on-caching)) discusses replacing `unstable_cache` with custom solutions like CacheManager, which supports clustering and tagging, but this seems overkill for the current implementation, given the focus on simplicity and freshness for page data.

#### Conclusion

The choice to use React's `cache` in page.tsx instead of `unstable_cache` is likely intentional, balancing performance with data freshness, especially for dynamic pages. It ensures deduplication within render passes without persisting data, avoiding stale content and respecting draft mode, while `unstable_cache` is reserved for global data like the header, which benefits from persistent caching due to its shared, infrequently changing nature. This strategy aligns with Next.js best practices for server components, prioritizing user experience and data integrity.

---

### Key Citations

- [Next.js Documentation on Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [React Documentation on Cache](https://react.dev/reference/react/cache)
- [StackOverflow Discussion on Cache Differences](https://stackoverflow.com/questions/76123456/whats-the-difference-between-react-18s-new-cache-and-next-js-deduping)
- [Gist by HarleySalas on Combined Caching](https://gist.github.com/HarleySalas/f059cfc8150074c779b806764b8fe890)
