import { MenuCalendar } from "@/components/admin/menu-calendar";

export default function AdminMenuPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Календарь меню</h1>
        <p className="text-muted-foreground">
          Назначайте блюда на каждый день недели
        </p>
      </div>
      <MenuCalendar />
    </div>
  );
}
