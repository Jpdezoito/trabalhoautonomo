import { CheckCircle2, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryWithContent } from "@/features/categories/types";

export function ServiceExplorer({ category }: { category: CategoryWithContent }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Servicos mais comuns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {category.content.commonServices.map((service) => (
              <div key={service} className="flex items-start gap-3 rounded-[8px] bg-surface-muted p-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-primary" size={19} />
                <p className="font-bold leading-6 text-foreground">{service}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Quando contratar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {category.content.whenToHire.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-[8px] bg-surface-muted p-4">
                <HelpCircle className="mt-0.5 shrink-0 text-primary" size={19} />
                <p className="font-bold leading-6 text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
