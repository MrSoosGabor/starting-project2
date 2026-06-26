import { AuthForm } from "../auth-form";

export default function RegisterPage() {
  return (
    <AuthForm
      title="Regisztracio"
      description="Hozz letre fiokot email cimmel es jelszoval. A hitelesites bekotese kesobb kerul be."
      submitLabel="Fiok letrehozasa"
      passwordAutoComplete="new-password"
      switchText="Mar van fiokod?"
      switchHref="/login"
      switchLabel="Bejelentkezes"
    />
  );
}
