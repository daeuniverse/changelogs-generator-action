export type PullRequest = {
  title: string
  html_url: string
  number: number
  state: string
  labels: string[]
  assignees: string[]
  author: string
  merge_commit_sha: string
  merged_at: string
  base_ref: string
  head_ref: string
  is_new_contributor: boolean
}

export type GraphQLQueryResponse = {
  search: {
    issueCount: number
    nodes: any
  }
}
