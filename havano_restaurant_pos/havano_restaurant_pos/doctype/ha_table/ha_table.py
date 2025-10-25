# Copyright (c) 2025, showline and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class HATable(Document):

    def create_sales_invoice(self):
        """Create a Sales Invoice for this HA Table"""

        if not self.table_order:
            frappe.throw(f"No active orders found for table: {self.name}")

        default_dine_in_customer = frappe.db.get_single_value(
            "Sample Pos Settings", "default_dine_in_customer"
        )

        order_items = []
        for order in self.table_order:
            order_doc = frappe.get_doc("HA Order", order.order)
            for order_item in order_doc.order_items:
                order_items.append(
                    {
                        "menu_item": order_item.menu_item,
                        "qty": order_item.qty,
                        "rate": order_item.rate,
                        "amount": order_item.amount,
                    }
                )

            order_doc.order_status = "Closed"
            order_doc.save(ignore_permissions=True)
            frappe.db.commit()

        merged_items = []
        for item in order_items:
            found = False
            for merged in merged_items:
                if (
                    merged["menu_item"] == item["menu_item"]
                    and merged["rate"] == item["rate"]
                ):
                    merged["qty"] = merged["qty"] + item["qty"]
                    merged["amount"] = merged["qty"] * merged["rate"]
                    found = True
                    break
            if not found:
                merged_items.append(item)

        sales_invoice = frappe.new_doc("Sales Invoice")
        sales_invoice.customer = default_dine_in_customer
        sales_invoice.due_date = frappe.utils.nowdate()

        for item in merged_items:
            sales_invoice.append(
                "items",
                {
                    "item_code": item["menu_item"][:140],
                    "qty": item["qty"],
                    "rate": item["rate"],
                    "amount": item["amount"],
                },
            )

        sales_invoice.insert(ignore_permissions=True)
        sales_invoice.submit()
        frappe.db.commit()

        return sales_invoice
