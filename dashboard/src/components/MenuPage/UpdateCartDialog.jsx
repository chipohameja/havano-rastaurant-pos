import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/stores/useCartStore";

const UpdateCartDialog = () => {
  const updateCartItem = useCartStore((state) => state.updateCartItem);
  const selectedItem = useCartStore((state) => state.selectedCartItem);
  const isOpen = useCartStore((state) => state.isUpdateDialogOpen);
  const closeUpdateDialog = useCartStore((state) => state.closeUpdateDialog);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      price: "",
      quantity: "",
      remark: "",
    },
  });

  // Populate form when item changes
  useEffect(() => {
    if (selectedItem) {
      reset({
        price: selectedItem.price ?? "",
        quantity: selectedItem.quantity ?? "",
        remark: selectedItem.remark ?? "",
      });
    } else {
      reset({ price: "", quantity: "", remark: "" });
    }
  }, [selectedItem, reset]);

  const handleConfirm = handleSubmit(({ price, quantity, remark }) => {
    if (!selectedItem?.name) return;
    updateCartItem({
      ...selectedItem,
      price: Number(price),
      quantity: Number(quantity),
      remark,
    });
    closeUpdateDialog();
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeUpdateDialog();
        }
      }}
    >
      <DialogContent className="p-6 rounded-xl bg-white shadow-lg">
        <div>
          <DialogHeader className="mb-4">
            {selectedItem?.name && (
              <DialogTitle className="text-xl font-semibold">
                {selectedItem.item_name || selectedItem.name}
              </DialogTitle>
            )}
          </DialogHeader>
          <form onSubmit={handleConfirm} className="space-y-4">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <Input disabled type="number" step="0.01" min="0" {...register("price")} className="w-full" />
            </div>
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <Input type="number" min="1" {...register("quantity")} className="w-full" />
            </div>
            {/* Preparation Remark */}
            <div>
              <label className="block text-sm font-medium mb-1">Preparation Remark</label>
              <Textarea
                {...register("remark")}
                placeholder="Add a preparation remark..."
                className="w-full"
              />
            </div>
            {/* Actions */}
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  closeUpdateDialog();
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                OK
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCartDialog;
