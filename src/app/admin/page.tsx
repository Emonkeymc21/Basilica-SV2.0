import { AdminDashboardShell } from '@/components/admin/AdminDashboardShell';

export const metadata = {
  title: 'Panel administrativo | Basílica SV',
  description: 'Gestión de contenidos parroquiales',
};

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-[#0e2a47]">Dashboard</h1>
        <p className="text-stone-600">Vista base del panel (mock UX). Conectar a Auth + Prisma para producción.</p>
      </header>
      <AdminDashboardShell />
    </div>
  );
}
