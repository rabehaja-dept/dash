import LoginForm from "~/commercetools/components/account/LoginForm";
import NewAccount from "~/commercetools/components/account/NewAccount";
import Layout from "~/layouts/commercetools/base-layout";

const LoginPage: React.FC = () => {
  return (
    <Layout>
      <div>
        <h1>Login</h1>
        <LoginForm />
        <br />
        <br />
        <NewAccount />
      </div>
    </Layout>
  );
};

export default LoginPage;
