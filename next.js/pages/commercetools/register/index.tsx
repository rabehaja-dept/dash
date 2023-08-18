import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import styles from "./register.module.css";

const schema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(3, { message: "Password is required" }),
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
});

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    const { email, password, firstName, lastName } = data;
    //create customer
    const response = await fetch("/api/commercetools/customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
      }),
    });

    const customer = await response.json();

    if (customer && response.ok) {
      router.push("/commercetools/login");
    } else {
      console.error("Error creating customer");
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.heading}>Create Account</h1>
        <Link href="/commercetools/login" className={styles.link}>
          BACK TO SIGN IN
        </Link>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <label className={styles.label} htmlFor="firstName">
            First Name
          </label>
          <input
            {...register("firstName")}
            placeholder="Enter your first name"
            className={styles.input}
          />
          {errors.firstName && typeof errors.firstName.message === "string" && (
            <span className={styles.error}>{errors.firstName.message}</span>
          )}

          <label className={styles.label} htmlFor="lastName">
            Last Name
          </label>
          <input
            {...register("lastName")}
            placeholder="Enter your last name"
            className={styles.input}
          />
          {errors.lastName && typeof errors.lastName.message === "string" && (
            <span className={styles.error}>{errors.lastName.message}</span>
          )}

          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            {...register("email")}
            placeholder="Enter your email"
            className={styles.input}
          />
          {errors.email && typeof errors.email.message === "string" && (
            <span className={styles.error}>{errors.email.message}</span>
          )}

          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="******"
            className={styles.input}
          />
          {errors.password && typeof errors.password.message === "string" && (
            <span className={styles.error}>{errors.password.message}</span>
          )}

          <div className={styles.checkboxContainer}>
            <input
              className={styles.checkbox}
              type="checkbox"
              id="show-password"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label className={styles.checkboxLabel} htmlFor="show-password">
              Show Password
            </label>
          </div>
          <button className={styles.button} type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
