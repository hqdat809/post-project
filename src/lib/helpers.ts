import { NextResponse } from "next/server";
import toast from "react-hot-toast";
import { ZodError } from "zod";
type EnvVariableKey = "JWT_SECRET_KEY" | "JWT_EXPIRES_IN";

export function getEnvVariable(key: EnvVariableKey): string {
  const value = process.env[key];
  if (!value || value.length === 0) {
    console.error("Could not find environment variable");
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export function getErrorResponse(
  status: number = 500,
  message: string,
  error: ZodError | null = null
) {
  return new NextResponse(
    JSON.stringify({
      status: status < 500 ? "fail" : "error",
      message,
      error: error ? error?.flatten() : null,
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export function handleApiError(error: Error): void {
  try {
    let errorData;
    try {
      errorData = JSON.parse(error.message);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (parseError) {
      // Treat error.message as a plain error message
      // console.log("Error message:", error.message);
      toast.error(error.message);
      return;
    }

    if (
      typeof errorData === "object" &&
      errorData !== null &&
      "fieldErrors" in errorData
    ) {
      const fieldErrors = errorData.fieldErrors as Record<string, string[]>;
      Object.keys(fieldErrors).forEach((fieldName) => {
        const validationMessages = fieldErrors[fieldName];
        if (validationMessages.length > 0) {
          const firstValidationMessage = validationMessages[0];
          toast.error(firstValidationMessage);
          // console.log(
          //   `Validation error for ${fieldName}:`,
          //   firstValidationMessage
          // );
        }
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // console.log("Original error message:", error);
    toast.error(error);
  }
}
