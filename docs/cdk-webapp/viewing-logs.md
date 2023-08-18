### viewing logs

cdk-webapp wraps the `aws logs tail` command as a convenience. You can view the latest logs for your deployed app.

```bash
npx cdk-webapp logs --project-name my-new-project --stage prod
```

Just like `aws logs tail`, this command accepts arguments for `--follow`, `--since 20m` (or `2h` or `45s` or `2w`), and `--format detailed` (or `short` or `json`).
