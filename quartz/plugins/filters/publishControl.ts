import { QuartzFilterPlugin } from "../types"

export const PublishControl: QuartzFilterPlugin = () => ({
  name: "PublishControl",
  shouldPublish(_ctx, [_tree, vfile]) {
    const publishFlag = vfile.data?.frontmatter?.publish
    const dgPublishFlag = vfile.data?.frontmatter?.["dg-publish"]

    if (publishFlag === false || publishFlag === "false") {
      return false
    }

    if (dgPublishFlag === false || dgPublishFlag === "false") {
      return false
    }

    return true
  },
})
