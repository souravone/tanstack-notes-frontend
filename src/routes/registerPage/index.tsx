import { FieldInfo } from "@/utils/fieldInfo";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { signUp, useSession } from "@/lib/auth";
import { useEffect } from "react";

type InitialFormValue = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialValue: InitialFormValue = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const loginFormSchema = z
  .object({
    name: z.string().min(3, "Name should be at least 3 characters long"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const Route = createFileRoute("/registerPage/")({
  head: () => ({
    meta: [{ title: "MERN Notes - Register here" }],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigage = useNavigate();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      navigage({ to: "/" });
    }
  }, [session, navigage]);

  const form = useForm({
    defaultValues: initialValue as InitialFormValue,
    validators: {
      onChange: loginFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await signUp.email({
          name: value.name,
          email: value.email,
          password: value.password,
        });

        if (result.error) {
          console.error("Login failed");
        } else {
          navigage({ to: "/" });
        }
      } catch (err) {
        console.log("Problem while signing in", err);
      }
    },
  });
  return (
    <div className="max-w-6xl mx-auto my-6">
      <form
        className="mt-12 px-8 py-8 max-w-3xl mx-auto border-2 shadow rounded-md bg-white"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <h1 className="text-2xl font-semibold my-4">Register Here</h1>
        <div className="space-y-4">
          <form.Field name="name">
            {(field) => (
              <div>
                <label className="block" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Add name"
                  className="input-field"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </div>
            )}
          </form.Field>
          <form.Field name="email">
            {(field) => (
              <div>
                <label className="block" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Add email"
                  className="input-field"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </div>
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => (
              <div>
                <label className="block" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Add password"
                  className="input-field"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </div>
            )}
          </form.Field>
          <form.Field name="confirmPassword">
            {(field) => (
              <div>
                <label className="block" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Add password"
                  className="input-field"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </div>
            )}
          </form.Field>
          <button type="submit" className="btn-primary mt-4">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
