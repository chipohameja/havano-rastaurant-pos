import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import MenuItemCard from "@/components/MenuPage/MenuItemCard";
import { useCartStore } from "@/stores/useCartStore";
import { useMenuStore } from "@/stores/useMenuStore";

import NumPad from "./UpdateCartDialog";

const Menu = () => {
  const { menuItems, fetchMenuItems } = useMenuStore();
  const selectedCategory = useCartStore((state) => state.selectedCategory);
  const selectedCategoryId = selectedCategory?.id;
  const [searchTerm, setSearchTerm] = useState("");
  console.log(menuItems);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesCategory =
        !selectedCategoryId ||
        selectedCategoryId === "all" ||
        item.custom_menu_category === selectedCategoryId;

      const label = (item.item_name || item.name || "").toLowerCase();
      const matchesSearch = !term || label.includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, searchTerm, selectedCategoryId]);

  return (
    <>
      <NumPad isOpen={false} setIsOpen={() => {}} />
      <div className="flex items-center justify-between">
        <p className="text-2xl my-4">{selectedCategory?.name || "Menu"}</p>
        <div className="flex items-center w-1/3 bg-background px-2 py-1 rounded-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
          <input
            type="text"
            placeholder="Search"
            className="w-full focus:outline-none focus:ring-0 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="text-primary" />
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {filteredItems.map((item) => (
          <MenuItemCard key={item.name} item={item} />
        ))}
      </div>
    </>
  );
};

export default Menu;
