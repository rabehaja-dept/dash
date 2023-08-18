import * as path from "path";
const inquirer = require("inquirer");
const fs = require("fs");
const { execSync } = require("child_process");

const stacks = ["MAIN"];

// @dash-remove-next-line staging
stacks.push("STAGING");

// @dash-remove-next-line production
stacks.push("PRODUCTION");

let answers;
try {
  const envrcPath = path.resolve(__dirname, "../../.envrc");
  const pathToUse = fs.existsSync(envrcPath)
    ? envrcPath
    : path.resolve(__dirname, "../../.envrc.example");
  let questions = [];
  questions.push(
    {
      type: "list",
      name: "CDK_DEFAULT_REGION",
      message: "What region do you want to deploy to?",
      default: "us-west-2",
      choices: [
        "us-east-2",
        "us-east-1",
        "us-west-1",
        "us-west-2",
        "af-south-1",
        "ap-east-1",
        "ap-southeast-3",
        "ap-south-1",
        "ap-northeast-3",
        "ap-northeast-2",
        "ap-southeast-1",
        "ap-southeast-2",
        "ap-northeast-1",
        "ca-central-1",
        "eu-central-1",
        "eu-west-1",
        "eu-west-2",
        "eu-south-1",
        "eu-west-3",
        "eu-north-1",
        "me-south-1",
        "me-central-1",
        "sa-east-1",
      ],
    },
    {
      type: "input",
      name: "CDK_DEFAULT_ACCOUNT",
      message:
        "Configuring the account id for dash-bootstrap-profile. Please hit enter to continue.",
      default: () => {
        // run bash command and save output
        const output = execSync(
          "aws sts get-caller-identity --profile dash-bootstrap-profile --query Account --output text",
          { encoding: "utf-8" }
        );
        // remove trailing newline
        return output.replace(/\n$/, "");
      },
    }
  );
  console.log(
    "************************************************PLEASE READ********************************************************************",
    "\n",
    "\n",
    `You will be asked to enter some data to configure your stacks (${stacks.join(
      ","
    )}). `,
    "\n",
    "This is only needed if you haven't bootstrapped a stack before in the region you are deploying to. ",
    "\n",
    "\n",
    "\n",
    "We support route53 and manual certificate validations, both are DNS certificate validation methods.",
    "\n",
    "\n",
    "- Manual: you need to create two certificates in AWS Certificate Manager manually before deploying the stack: ",
    "\n",
    "   * Cloud Front certificate: matching the domain name and created at us-east-1 region",
    "\n",
    "   * Load Balancer certificate: created in the region where you are deploying the stack and matching lb.yourdomain.com",
    "\n",
    "  E.g: ",
    "\n",
    "     * Domain name: yourdomain.com",
    "\n",
    "     * CloudFront certificate: yourdomain.com",
    "\n",
    "     * Load balancer certificate: lb.yourdomain.com",
    "\n",
    "Once you created the certificates, make a note about the ARNs and use them in the next step.",
    "\n",
    "\n",
    "- Route53: you need to create a hosted zone in Route53 and use it in the next step.",
    "\n",
    "\n",
    "More information about domain validation at https://docs.aws.amazon.com/acm/latest/userguide/domain-ownership-validation.html",
    "\n",
    "More information about certificates at https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html.",
    "\n",
    "\n",
    "******************************************************************************************************************************",
    "\n"
  );
  stacks.forEach(async (stack) => {
    let stackLowerCase = stack.toLowerCase();
    questions.push(
      {
        type: "input",
        name: `${stack}_DOMAIN_NAME`,
        message: `Please, enter the domain name for your stack (${stackLowerCase} branch). For example:${stackLowerCase}.DEPT_DASH_PROJECT_NAME.mydomain.com`,
        //read the default value from the pathToUse file
        default: () => {
          const data = fs.readFileSync(pathToUse, "utf8");
          const regex = new RegExp(`${stack}_DOMAIN_NAME=(.*)`);
          const match = data.match(regex);
          return match ? match[1] : "";
        },
        choices: [],
      },
      {
        type: "list",
        name: `${stack}_CDK_CERTIFICATE_VALIDATION`,
        message: `How do you want to validate your certificate for your stack (${stackLowerCase} branch)?`,
        default: () => {
          const data = fs.readFileSync(pathToUse, "utf8");
          const regex = new RegExp(`${stack}_CDK_CERTIFICATE_VALIDATION=(.*)`);
          const match = data.match(regex);
          return match ? match[1] : "route53";
        },
        choices: ["route53", "manual"],
      },
      {
        type: "input",
        name: `${stack}_ROUTE53_HOSTED_ZONE_DOMAIN`,
        message: `Please, enter the domain name for your hosted zone (${stackLowerCase} branch). For example: mydomain.com`,
        default: () => {
          const data = fs.readFileSync(pathToUse, "utf8");
          const regex = new RegExp(`${stack}_ROUTE53_HOSTED_ZONE_DOMAIN=(.*)`);
          const match = data.match(regex);
          return match ? match[1] : "mydomain.com";
        },
        choices: [],
        when: (answers: any) =>
          answers[`${stack}_CDK_CERTIFICATE_VALIDATION`] === "route53",
      },
      {
        type: "input",
        name: `${stack}_CLOUDFRONT_CERTIFICATE_ARN`,
        message: `Please, enter the ARN of your CloudFront certificate (${stackLowerCase} branch).`,
        default: () => {
          const data = fs.readFileSync(pathToUse, "utf8");
          const regex = new RegExp(`${stack}_CLOUDFRONT_CERTIFICATE_ARN=(.*)`);
          const match = data.match(regex);
          return match ? match[1] : "";
        },
        choices: [],
        when: (answers: any) =>
          answers[`${stack}_CDK_CERTIFICATE_VALIDATION`] === "manual",
      },
      {
        type: "input",
        name: `${stack}_LOAD_BALANCER_CERTIFICATE_ARN`,
        message: `Please, enter the ARN of your load balancer certificate (${stackLowerCase} branch).`,
        default: () => {
          const data = fs.readFileSync(pathToUse, "utf8");
          const regex = new RegExp(
            `${stack}_LOAD_BALANCER_CERTIFICATE_ARN=(.*)`
          );
          const match = data.match(regex);
          return match ? match[1] : "";
        },
        choices: [],
        when: (answers: any) =>
          answers[`${stack}_CDK_CERTIFICATE_VALIDATION`] === "manual",
      }
    );
  });

  answers = inquirer.prompt(questions).then((answers: any) => {
    Object.keys(answers).forEach((key) => {
      const value = answers[key]; // value is in fact answers.<question_name>
      const line = `export ${key}=${value}`; // create the line to write in the file
      const regex = new RegExp(`export ${key}=.*`, "g"); // create a regex to find the line in the file
      const content = fs.readFileSync(pathToUse, "utf8"); // read the file
      const result = content.replace(regex, line); // replace the line in the file
      fs.writeFileSync(pathToUse, result, "utf8"); // write the file
    });
  });
} catch (error) {
  console.log(error);
  process.exit(0);
}

export { answers };
