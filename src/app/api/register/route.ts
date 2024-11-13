import prisma from "@/lib/prisma";
import {
  RegisterUserInput,
  RegisterUserSchema,
} from "@/lib/validations/user.schema";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { ZodError } from "zod";
import { getErrorResponse } from "@/lib/helpers";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterUserInput;

    const data = RegisterUserSchema.parse(body);

    console.log("data: ", data);

    const hashedPassword = await hash(data.password, 12);

    console.log("hashedPassword: ", hashedPassword);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    console.log("user: ", user);

    return NextResponse.json(
      JSON.stringify({
        status: "success",
        data: { user: { ...user, password: undefined } },
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("error: ", error);
    if (error instanceof ZodError) {
      return getErrorResponse(400, "failed validation", error);
    }
    if (error.code === "P2002") {
      return getErrorResponse(409, "user with that email already exists");
    }
    return getErrorResponse(500, error.message);
  }
}
