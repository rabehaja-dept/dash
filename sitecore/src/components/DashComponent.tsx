import { Text, Field, withDatasourceCheck, RichText } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import Image from 'next/image';

type DashComponentProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    description: Field<string>;
    image: Field<string>;
    content: Field<string>;
  };
};

const DashComponent = (props: DashComponentProps): JSX.Element => (
  <div className="text-center">
    <Image src={props.fields.image.value} width={400} height={200} alt="Dash logo" />
    <div>
      <Text field={props.fields.heading} tag="h2" />
      <br />
      <Text field={props.fields.description} />
      <br />
      <RichText field={props.fields.content} />
      <br />
    </div>
  </div>
);

export default withDatasourceCheck()<DashComponentProps>(DashComponent);
