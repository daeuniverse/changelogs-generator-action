export type PullRequest = {
  number: number
  author: string
  assignees: string[]
  title: string
  labels: string[]
  html_url: string
  merged_at: string
  is_new_contributor: boolean
}
