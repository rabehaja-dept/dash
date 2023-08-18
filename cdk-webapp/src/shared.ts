export interface ProjectInfo {
  projectName: string;
  stage: string;
}

export function envSecretName(props: ProjectInfo): string {
  return `/dept-dash/${props.projectName}/${props.stage}/environment`;
}

export function getLogGroupName(props: ProjectInfo): string {
  return `/dept-dash/${props.projectName}/${props.stage}`;
}
