import { MenuCalendar } from "@/components/admin/menu-calendar";

export default function AdminMenuPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Календарь меню</h1>
        <p className="text-muted-foreground">
          Назначайте блюда на конкретные даты и копируйте варианты меню вперёд
        </p>
      </div>
      <MenuCalendar />
    </div>
  );
}
