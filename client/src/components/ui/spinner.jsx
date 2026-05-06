import { cn } from "@/lib/utils"
import { LoaderIcon } from "lucide-react"

function Spinner({
  className,
  ...props
}) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-6 animate-spin", className)}
      {...props} />
  );
}

export { Spinner }
