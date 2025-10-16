import { Edit, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast,Toaster } from "sonner";

import { formatCurrency } from "@/lib/utils";
import { handleCreateOrder, handleUpdateOrder } from "@/lib/utils";
import { useCartStore } from "@/stores/useCartStore";
import { useOrderStore } from "@/stores/useOrderStore";

import Clock from "../HomePage/Clock";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import UpdateCartDialog from "./UpdateCartDialog";

const Cart = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const fetchTableOrders = useOrderStore((state) => state.fetchTableOrders);
  const {
    cart,
    removeFromCart,
    openUpdateDialog,
    activeOrderId,
    activeTableId,
    activeWaiterId,
    customerName,
    orderType,
    clearCart,
  } = useCartStore();


  const handleSubmitOrder = async (cart) => {
    if (!cart || cart.length === 0) {
      return;
    }
    const payload = {
      order_id: activeOrderId,
      order_type: orderType,
      customer_name: customerName,
      table: activeTableId,
      waiter: activeWaiterId,
      order_items: cart,
    };
    try {
      setIsSubmitting(true);
      const res = activeOrderId
        ? await handleUpdateOrder(payload)
        : await handleCreateOrder(payload);

      const {
        success,
        message: apiMessage,
        order_id: createdOrderId,
        details,
      } = res || {};

      if (success) {
        const successTitle =
          typeof apiMessage === "string"
            ? apiMessage
            : activeOrderId
            ? "Order updated successfully!"
            : "Order created successfully!";
        const orderIdentifier = activeOrderId || createdOrderId;

        toast.success(successTitle, {
          description: orderIdentifier
            ? `Order ID: ${orderIdentifier}`
            : undefined,
          duration: 4000,
        });


        try {
          await fetchOrders();
          if (activeTableId) {
            await fetchTableOrders(activeTableId);
          }
        } catch (refreshErr) {
          console.error("Failed to refresh orders:", refreshErr);
        }

        clearCart();
        if (activeTableId) navigate(`/tables/${activeTableId}`);
      } else {
        const errorTitle =
          typeof apiMessage === "string"
            ? apiMessage
            : "Something went wrong!";
        const errorDescription =
          typeof details === "string"
            ? details
            : "Please check your order details and try again.";

        toast.error(errorTitle, {
          description: errorDescription,
          duration: 5000,
        });
        console.error("Order error:", res);
      }
    } catch (err) {
      toast.error("Server Error", {
        description: "Unable to reach the server. Please try again later.",
        duration: 5000,
      });
      console.error("Order submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="h-[820px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <Clock />
            {activeOrderId ? (
              <h1 className="text-2xl font-bold text-primary">
                {activeOrderId}
              </h1>
            ) : (
              <h1 className="text-2xl font-bold text-primary">New Order</h1>
            )}
          </CardTitle>
        </CardHeader>
        <hr className="border border-gray-600" />
        <CardContent className="flex-1">
          <p className="text-lg font-bold my-2">Order Details</p>
          {cart.length > 0 ? (
            <div className="flex flex-col space-y-1">
              {cart.map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between items-center bg-secondary-background py-2 px-4 rounded-sm"
                >
                  <div className="flex gap-4 font-bold">
                    <p>x{item.quantity}</p>
                    <p>{item.item_name || item.name}</p>
                    <i>
                      {formatCurrency(item.price ?? item.standard_rate ?? 0)}
                    </i>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="cursor-pointer hover:bg-background p-2 rounded-sm group"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item);
                      }}
                    >
                      <Trash2
                        size={20}
                        className="text-red-700 group-hover:text-red-400"
                      />
                    </div>
                    <div
                      className="cursor-pointer hover:bg-background p-2 rounded-sm group"
                      onClick={() => openUpdateDialog(item)}
                    >
                      <Edit
                        size={20}
                        className="text-yellow-700 group-hover:text-yellow-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col justify-center items-center gap-2">
                <ShoppingCart size={60} className="text-secondary" />
                <i>Cart is empty</i>
              </div>
            </div>
          )}
        </CardContent>
        <hr className="border border-gray-600" />
        <CardFooter>
          <Button
            onClick={() => handleSubmitOrder(cart)}
            size="lg"
            className="w-full"
            disabled={cart.length === 0 || isSubmitting}
            title={cart.length === 0 ? "Add items to your cart first" : ""}
          >
            {activeOrderId ? "Update Order" : "Place Order"}
          </Button>
        </CardFooter>
      </Card>
      <Toaster richColors duration={4000} position="top-center" />
      <UpdateCartDialog />
    </>
  );
};

export default Cart;
