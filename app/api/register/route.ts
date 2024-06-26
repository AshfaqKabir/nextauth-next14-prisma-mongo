import { NextResponse } from "next/server";
import prismadb from "../../libs/prismadb";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    // Get the Response
    const body = await req.json();
    console.log(body);

    // Extract the Data from body
    const { email, password } = body;

    // If One FIeld Empty
    if (!email || !password) {
      return new NextResponse("Missing Data", { status: 500 });
    }

    // If User Already Exists
    const userAlreadyExists = await prismadb.user.findFirst({
      where: {
        email: email,
      },
    });

    if (userAlreadyExists?.id) {
      return new NextResponse("User Already Exists", { status: 500 });
    }

    // Hash the Pass
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create New User
    const newUser = await prismadb.user.create({
      data: {
        email: email,
        hashedPassword: hashedPassword,
      },
    });

    return NextResponse.json(newUser);
  } catch (err: any) {
    console.log("Register Error: ", err);
    return new NextResponse(err, { status: 500 });
  }
}
