import LoginForm from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="w-full max-w-xs">
        <h1 className="mb-6 text-center text-xl font-semibold text-text-primary">
          Panel de administrador
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
