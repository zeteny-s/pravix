import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface PricingFeature {
  name: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: PricingFeature[];
  highlighted?: boolean;
  onSelect: () => void;
}

export function PricingCard({
  title,
  price,
  description,
  features,
  highlighted = false,
  onSelect,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border p-8 shadow-lg transition-all hover:shadow-xl",
        highlighted && "border-legal-600 bg-legal-50/50"
      )}
    >
      {highlighted && (
        <div className="absolute -top-5 left-0 right-0 mx-auto w-fit rounded-full bg-legal-600 px-4 py-1 text-sm font-medium text-white">
          Most Popular
        </div>
      )}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        </div>
        <div className="space-y-2">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-gray-500">/month per user</span>
        </div>
        <Button
          onClick={onSelect}
          className={cn(
            "w-full",
            highlighted ? "bg-legal-600 hover:bg-legal-700" : ""
          )}
        >
          Get Started
        </Button>
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">What's included:</h4>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li
                key={index}
                className={cn(
                  "flex items-center text-sm",
                  feature.included ? "text-gray-900" : "text-gray-400"
                )}
              >
                <Check
                  className={cn(
                    "mr-3 h-5 w-5",
                    feature.included ? "text-legal-600" : "text-gray-300"
                  )}
                />
                {feature.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
