import frappe
from frappe import _


@frappe.whitelist()
def get_customers():
    """Get all active customers"""
    customers = frappe.get_all(
        "Customer",
        fields=["name", "customer_name"],
        filters={"disabled": 0},
        order_by="customer_name",
    )
    return customers


@frappe.whitelist()
def get_price_lists():
    """Get all selling price lists"""
    price_lists = frappe.get_all(
        "Price List",
        fields=["name", "price_list_name"],
        filters={"enabled": 1, "selling": 1},
        order_by="name",
    )
    return price_lists


@frappe.whitelist()
def search_items(search_term=None):
    """Search for items by name or code"""
    filters = {"disabled": 0}

    if search_term:
        filters["item_name"] = ["like", f"%{search_term}%"]

    items = frappe.get_all(
        "Item",
        fields=[
            "name",
            "item_code",
            "item_name",
            "description",
            "stock_uom",
            "standard_rate",
        ],
        filters=filters,
        order_by="item_name",
        limit=20,
    )
    return items


@frappe.whitelist()
def get_number_of_items(category=None):
    """Get the number of items in a category"""
    item_group = frappe.db.get_single_value("Sample Pos Settings", "menu_item_group")
    if category:
        return frappe.db.count(
            "Item",
            {"disabled": 0, "item_group": item_group, "custom_menu_category": category},
        )
    else:
        return frappe.db.count("Item", {"disabled": 0, "item_group": item_group})


@frappe.whitelist()
def create_order_from_cart(payload):
    """Create an order from the cart"""
    try:
        order = frappe.new_doc("HA Order")
        order.order_type = payload.get("order_type")
        order.customer_name = payload.get("customer_name")
        order.table = payload.get("table", "")
        order.waiter = payload.get("waiter", "")
        order.payment_status = "Unpaid"

        for item in payload.get("order_items", []):
            order.append(
                "order_items",
                {
                    "menu_item": item.get("name"),
                    "qty": item.get("quantity"),
                    "rate": item.get("price"),
                    "amount": item.get("price") * item.get("quantity"),
                    "preparation_remark": item.get("remark"),
                },
            )

        order.save()
        if payload.get("order_type") == "Take Away":
            order.create_invoice_from_order()
        frappe.db.commit()

        table = payload.get("table")
        if table and payload.get("order_type") == "Dine In":
            table = frappe.get_doc("HA Table", table)
            table.assigned_waiter = payload.get("waiter")
            table.append(
                "table_order",
                {
                    "order": order.name,
                },
            )
            table.save()
            frappe.db.commit()

        return {
            "success": True,
            "message": "Order created successfully",
            "order_id": order.name,
        }

    except Exception as e:
        frappe.log_error(f"Error creating order: {frappe.get_traceback()}")
        return {
            "success": False,
            "message": "Failed to create order",
            "details": str(e),
        }


@frappe.whitelist()
def update_order(payload):
    try:
        order = frappe.get_doc("HA Order", payload.get("order_id"))
        order.order_items = []

        for item in payload.get("order_items", []):
            order.append(
                "order_items",
                {
                    "menu_item": item.get("name"),
                    "qty": item.get("quantity"),
                    "rate": item.get("price"),
                    "amount": item.get("price") * item.get("quantity"),
                    "preparation_remark": item.get("remark"),
                },
            )
        order.save()
        frappe.db.commit()

        return {
            "success": True,
            "message": "Order updated successfully",
            "order_id": order.name,
        }

    except Exception as e:
        frappe.log_error(f"Error updating order: {frappe.get_traceback()}")
        return {
            "success": False,
            "message": "Failed to update order",
            "details": str(e),
        }


@frappe.whitelist()
def get_number_of_orders(menu_item):
    try:
        if not menu_item:
            return {"success": False, "message": "Menu item not provided", "count": 0}

        count = frappe.db.count("HA Order Item", {"menu_item": menu_item})
        return {
            "success": True,
            "message": "Number of orders retrieved successfully",
            "count": count,
        }

    except Exception as e:
        frappe.log_error(f"Error getting number of orders: {frappe.get_traceback()}")
        return {
            "success": False,
            "message": "Failed to get number of orders",
            "details": str(e),
        }


@frappe.whitelist()
def mark_table_as_paid(table):
    try:
        table_doc = frappe.get_doc("HA Table", table)
        sales_invoice = table_doc.create_sales_invoice()
        table_doc.table_order = []
        table_doc.save()
        return {
            "success": True,
            "message": "Sales Invoice created successfully",
            "sales_invoice": sales_invoice.name,
        }
    except Exception as e:
        frappe.log_error(f"Error creating sales invoice: {frappe.get_traceback()}")
        return {
            "success": False,
            "message": "Failed to create sales invoice",
            "details": str(e),
        }
