import type { ReactElement } from "react";

export function makeTemplate<
  T extends (props: any) => ReactElement<any, any> | null
>(Component: T): T & { args: Parameters<T>[0] } {
  // @ts-ignore
  // eslint-disable-next-line react/display-name
  return (args: Parameters<T>) => <Component {...args} />;
}

/**
 * Change these to your figma file id and figma project name
 */
const FIGMA_FILE_ID = "hkllNZ0AF7jLu2SPmIL6Mu";
const FIGMA_PROJECT_NAME = "DEPT-DASH---in-progress";

/**
 * A helper function to get the full figma url for your project.
 * Node IDs stay the same between projects,
 * so if your project has cloned the base DASH figma project
 * and edited it, you'll only need to update
 * the file id and project name above.
 * @param nodeId the id of the node in figma
 * @returns the full url to the figma node for this story
 */
export const getFigmaUrl = (nodeId: string) => {
  return `https://www.figma.com/file/${FIGMA_FILE_ID}/${FIGMA_PROJECT_NAME}?node-id=${nodeId}`;
};
