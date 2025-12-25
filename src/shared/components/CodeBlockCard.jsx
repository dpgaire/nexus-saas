import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CodeBlockCard({ title, category = "", content, actions }) {
  return (
    <Card>
      <CardHeader className="flex flex-col items-start">
        <div className="flex justify-between w-full items-center">
          <CardTitle className="text-sm truncate">
            {title}
            {category && (
              <p className="text-xs text-blue-600 dark:text-blue-400 ">
                {category}
              </p>
            )}
          </CardTitle>
          {actions}
        </div>
      </CardHeader>

      <CardContent className="font-mono text-sm max-h-60 overflow-auto">
        <pre className="whitespace-pre-wrap">{content}</pre>
      </CardContent>
    </Card>
  );
}
