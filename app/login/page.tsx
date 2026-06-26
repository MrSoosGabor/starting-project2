import { AuthForm } from "../auth-form";

export default function LoginPage() {
  return (
    <AuthForm
      title="Bejelentkezes"
      description="Jelentkezz be az email cimed es jelszavad megadasaval, hogy elerd a sajat jegyzeteidet."
      submitLabel="Bejelentkezes"
      passwordAutoComplete="current-password"
      switchText="Meg nincs fiokod?"
      switchHref="/register"
      switchLabel="Regisztracio"
    />
  );
}
