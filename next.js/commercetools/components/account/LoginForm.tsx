import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styles from "./LoginForm.module.css";

interface FormInputs {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const router = useRouter();
  const { data: session } = useSession();
  const anonymousId = (session as any)?.anonymous_id;
  const onSubmit = async ({ email, password }: FormInputs) => {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      anonymous_id: anonymousId,
    });

    if (!result.ok) {
      // handle login error
    } else {
      // successful login
      router.push("/commercetools");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <label className={styles.label}>
        Email
        <input {...register("email", { required: "Email is required" })} />
      </label>
      {errors.email && <p className={styles.error}>{errors.email.message}</p>}

      <label className={styles.label}>
        Password
        <input
          type="password"
          {...register("password", { required: "Password is required" })}
        />
      </label>
      {errors.password && (
        <p className={styles.error}>{errors.password.message}</p>
      )}

      <button className={styles.button} type="submit">
        Log in
      </button>
    </form>
  );
};

export default LoginForm;
