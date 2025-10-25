import frappe


def update_standard_rate(doc, method):
    """
    Updates the Item's standard_rate when the Item Price
    for 'Standard Selling' price list is updated.
    """
    try:
        # Only update for "Standard Selling" price list
        if doc.price_list == "Standard Selling":
            # Ensure item_code is available
            if not doc.item_code:
                frappe.throw("Item Code is missing in Item Price document")

            # Fetch the Item document
            item = frappe.get_doc("Item", doc.item_code)

            # Update the standard_rate field
            item.standard_rate = doc.price_list_rate

            # Save quietly (avoids recursive triggers)
            item.flags.ignore_validate = True
            item.flags.ignore_permissions = True
            item.save()

            frappe.msgprint(
                f"✅ Updated Standard Rate for <b>{doc.item_code}</b> → {doc.price_list_rate}"
            )

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Error in update_standard_rate")
        frappe.throw(f"Error updating Item Standard Rate: {e}")
