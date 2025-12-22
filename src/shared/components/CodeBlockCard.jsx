import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CodeBlockCard({ title, category='', content, actions }) {
  return (
     <Card>
      <CardHeader className="flex flex-col items-start">
        <div className="flex justify-between w-full items-center">
          <CardTitle className="text-sm truncate">{title}</CardTitle>
          {actions}
        </div>
        {category && (
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium ">
            {category}
          </p>
        )}
      </CardHeader>

      <CardContent className="font-mono text-sm max-h-60 overflow-auto">
        <pre className="whitespace-pre-wrap">{content}</pre>
      </CardContent>
    </Card>
  );
}
