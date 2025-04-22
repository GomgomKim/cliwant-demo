"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { useCounterStore } from "@/shared/store/useCounterStore";
import { useTheme } from "next-themes";

export const WelcomeFeature = () => {
  const { count, increment, decrement, reset } = useCounterStore();
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to FSD Architecture</CardTitle>
          <CardDescription>
            This project is configured with Tailwind CSS, Shadcn UI, Zustand,
            and Radix UI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">
                Feature-Sliced Design Structure:
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-semibold">app</span> - App Router pages
                  and layouts
                </li>
                <li>
                  <span className="font-semibold">entities</span> - Business
                  entities
                </li>
                <li>
                  <span className="font-semibold">features</span> - User
                  scenarios, processes
                </li>
                <li>
                  <span className="font-semibold">widgets</span> - Composite
                  components for pages
                </li>
                <li>
                  <span className="font-semibold">shared</span> - Reusable
                  infrastructure
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">
                Zustand Counter Example:
              </h3>
              <div className="flex items-center gap-4 justify-center">
                <Button variant="outline" onClick={decrement}>
                  -
                </Button>
                <span className="text-2xl font-bold">{count}</span>
                <Button variant="outline" onClick={increment}>
                  +
                </Button>
                <Button variant="secondary" onClick={reset}>
                  Reset
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Theme Control:</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                >
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                >
                  Dark
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  onClick={() => setTheme("system")}
                >
                  System
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-4 justify-center">
          <Button asChild>
            <a
              href="https://feature-sliced.design/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn FSD
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js Docs
            </a>
          </Button>
          <Button variant="secondary" asChild>
            <a
              href="https://ui.shadcn.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shadcn UI
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
