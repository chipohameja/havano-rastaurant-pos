import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props} />
  );
}

export { Input }


// import * as React from "react";
// import { cn } from "@/lib/utils";
// import { Keyboard } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import KeyboardReact from "react-simple-keyboard";
// import "react-simple-keyboard/build/css/index.css";

// function InputWithKeyboard({ className, type, ...props }) {
//   const [open, setOpen] = React.useState(false);
//   const [value, setValue] = React.useState("");
//   const [tempValue, setTempValue] = React.useState("");
//   const keyboardRef = React.useRef(null);

//   const handleInputChange = (e) => {
//     setValue(e.target.value);
//     setTempValue(e.target.value);
//   };

//   const handleKeyboardChange = (input) => {
//     setTempValue(input);
//   };

//   const handleClose = (openState) => {
//     if (!openState) {
//       setValue(tempValue);
//     }
//     setOpen(openState);
//   };

//   return (
//     <div className="relative w-full flex items-center">
//       <input
//         type={type}
//         data-slot="input"
//         value={value}
//         onChange={handleInputChange}
//         className={cn(
//           "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//           "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
//           "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
//           className
//         )}
//         {...props}
//       />

//       {/* Keyboard Icon */}
//       <button
//         type="button"
//         onClick={() => setOpen(true)}
//         className="absolute right-2 text-muted-foreground hover:text-foreground"
//       >
//         <Keyboard className="w-4 h-4" />
//       </button>

//       {/* Dialog with React Keyboard */}
//       <Dialog open={open} onOpenChange={handleClose} className="w-screen h-screen">
//         <DialogContent className="w-screen h-auto">
//           <DialogHeader>
//             <DialogTitle>Virtual Keyboard</DialogTitle>
//           </DialogHeader>

//           {/* Live typing preview */}
//           <div className="w-full p-2 mb-2 rounded-md border text-foreground text-lg">
//             {tempValue || "Start typing..."}
//           </div>

//           <KeyboardReact
//             keyboardRef={(r) => (keyboardRef.current = r)}
//             onChange={handleKeyboardChange}
//             input={tempValue}
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export { InputWithKeyboard as Input };

