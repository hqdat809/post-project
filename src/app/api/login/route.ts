import { getEnvVariable, getErrorResponse } from "@/lib/helpers";
import prisma from "@/lib/prisma";
import { signJWT } from "@/lib/token";
import { LoginUserInput, LoginUserSchema } from "@/lib/validations/user.schema";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginUserInput;
    const data = LoginUserSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    console.log("user: ", user);
    if (user) {
      console.log("user: ", user.password);
      console.log("user: ", data.password);
      console.log(user && (await compare(data.password, user.password)));
    }

    if (!user || !(await compare(data.password, user.password))) {
      return getErrorResponse(401, "Invalid password or email");
    }

    const JWT_EXPIRES_IN = getEnvVariable("JWT_EXPIRES_IN");

    const token = await signJWT(
      {
        sub: user.id,
      },
      { exp: `${JWT_EXPIRES_IN}m` }
    );

    const tokenMaxAge = parseInt(JWT_EXPIRES_IN) * 60;
    const cookieOptions = {
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "development",
      maxAge: tokenMaxAge,
    };

    const response = new NextResponse(
      JSON.stringify({
        message: "Logged in successfully",
        token,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    await Promise.all([
      response.cookies.set(cookieOptions),
      response.cookies.set({
        name: "logged-in",
        value: "true",
        maxAge: tokenMaxAge,
      }),
    ]);

    return response;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof ZodError) {
      return getErrorResponse(400, "Invalid request body", error);
    }

    return getErrorResponse(500, error.message);
  }
}
