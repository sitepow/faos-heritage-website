import { Star } from "lucide-react";
import { ComponentProps, FC } from "react";

interface Props {
  rate?: number;
}

const StarRating: FC<ComponentProps<"div"> & Props> = ({
  rate = 0,
  ...props
}) => {
  return (
    <div {...props} className="flex">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          fill={index < Math.floor(rate) ? "currentColor" : "none"}
          size={15}
          className={
            index < Math.floor(rate) ? "text-yellow-400" : "text-gray-300"
          }
        />
      ))}
    </div>
  );
};

export { StarRating };
