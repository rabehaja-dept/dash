### Adding a stage

To add a stage, instantiate another `WebAppStack` in your bin/cdk.ts file. It should have a different stage value. Stages don't share any resources between one another; as far as CDK is concerned it's a totally separate cloudformation stack.

```diff
+new WebAppStack(app, {
+  env,
+  projectName: "my-new-project",
+  stage: "staging",
+  ...
+});
```

```bash
npx cdk deploy DeptDash-my-new-project-staging
```
