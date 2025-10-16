# Copyright (c) 2025, showline and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from collections import defaultdict

class HATable(Document):

    def create_sales_invoice(self):
        if not self.table_order:
            return
        default_dine_in_customer = frappe.db.get_single_value(
			"Sample Pos Settings", "default_dine_in_customer"
		)
        order_items = []
        for order in self.table_order:
            order_doc = frappe.get_doc("HA Order", order.order)
            for order_item in order_doc.order_items:
                order_items.append({
					"menu_item": order_item.menu_item,
					"qty": order_item.qty,
					"rate": order_item.rate,
					"amount": order_item.amount
				})
            order_doc.db_set("order_status", "Closed", update_modified=True)

        merged = defaultdict(
            lambda: {"qty": 0, "rate": 0, "amount": 0, "menu_item": ""}
        )

        for i in order_items:
            key = (i["menu_item"], i["rate"])
            merged[key]["menu_item"] = i["menu_item"]
            merged[key]["rate"] = i["rate"]
            merged[key]["qty"] += i["qty"]
            merged[key]["amount"] = merged[key]["qty"] * i["rate"]

        order_items = list(merged.values())

        sales_invoice = frappe.new_doc("Sales Invoice")
        sales_invoice.customer = default_dine_in_customer
        for item in order_items:
            sales_invoice.append("items", {
				"item_code": item["menu_item"],
				"qty": item["qty"],
				"rate": item["rate"],
				"amount": item["amount"]
			})
        sales_invoice.insert()
        sales_invoice.submit()
        frappe.db.commit()

        return sales_invoice
