import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// Explorer mapFn은 클라이언트로 직렬화되므로 외부 변수 참조 불가 — inline으로 정의
const explorerConfig = {
  title: "📂 카테고리",
  folderDefaultState: "open" as const,
  useSavedState: true,
  mapFn: (node: any) => {
    const folderIcons: Record<string, string> = {
      "개발": "💻 개발",
      "Server": "🖥️ Server",
      "데이터베이스": "🗃️ 데이터베이스",
      "SQL": "🗄️ SQL",
      "알고리즘": "🧮 알고리즘",
      "블로그 제작": "📝 블로그 제작",
      "Git": "🌿 Git",
      "디자인패턴": "🧩 디자인패턴",
    }
    if (!node.isFolder) {
      if (node.slugSegment === "index") {
        node.displayName = "🏠 홈"
      }
    } else if (node.slugSegment) {
      // slug(공백→dash) + macOS NFD 자모 분리 정규화
      const key = node.slugSegment.replace(/-/g, " ").normalize("NFC")
      if (folderIcons[key]) {
        node.displayName = folderIcons[key]
      }
    }
    return node
  },
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Comments({
      provider: 'giscus',
      options: {
        repo: 'jsangmin99/obsidianBlog',
        repoId: 'R_kgDONmakxg',
        category: 'Announcements',
        categoryId: 'DIC_kwDONmakxs4CqzG6',
      }
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jsangmin99",
      Blog: "https://blog.jsangmin.co.kr",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (props) => props.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer(explorerConfig)),
  ],
  right: [
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "최근 글",
        limit: 6,
        linkToMore: false,
        showTags: true,
        filter: (page) => page.slug !== "index",
      }),
      condition: (props) => props.fileData.slug === "index",
    }),
    Component.Graph(),
    Component.ConditionalRender({
      component: Component.DesktopOnly(Component.TableOfContents()),
      condition: (props) => props.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.Backlinks(),
      condition: (props) => props.fileData.slug !== "index",
    }),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer(explorerConfig)),
  ],
  right: [],
}
