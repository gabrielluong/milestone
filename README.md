# Milestone

Tags a merged issue with the current milestone when closed by the specified closed-by login.

## Usage

```yaml
uses: gabrielluong/milestone@v1
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
  closed-by: "mergify[bot]"
```
