"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Form } from "@heroui/form";
import Image from "next/image";

type UserInputs = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: UserInputs) => {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-[450px] p-5">
        <CardHeader className="flex flex-col items-center w-full gap-1">
          <span className="font-bold text-lg">
            เข้าสู่ระบบ หรือ สมัครสมาชิก
          </span>
          <span className="text-default-500">
            เข้าสู่ DemoStore ด้วย Passport Local
          </span>
        </CardHeader>

        <CardBody className="gap-5">
          <Input
            label="อีเมล"
            type="email"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            {...register("email", {
              required: "กรุณากรอกอีเมล",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "รูปแบบอีเมลไม่ถูกต้อง",
              },
            })}
          />

          <Input
            label="รหัสผ่าน"
            type="password"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
            {...register("password", {
              required: "กรุณากรอกรหัสผ่าน",
              minLength: {
                value: 6,
                message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
              },
            })}
          />
        </CardBody>

        <CardBody className="justify-center items-center gap-4">
          <span>หรือจะเข้าสู่ระบบด้วย</span>

          <div className="flex gap-4">
            <Image
              src={"/google.png"}
              width={50}
              height={50}
              alt="google-login"
              className="rounded-full cursor-pointer"
              onClick={async () => {
                await signIn("google");
              }}
            />

            <Image
              src={"/facebook.png"}
              width={50}
              height={50}
              alt="google-login"
              className="rounded-full cursor-pointer"
              onClick={async () => {
                await signIn("facebook");
              }}
            />
          </div>
        </CardBody>

        <CardFooter className="flex-col gap-2.5">
          <span className="text-default-500 text-xs text-center">
            หากคุณสมัครสมาชิก จะถือว่าคุณได้ยินยอม{" "}
            <span className="font-bold underline">ข้อกำหนดและเงื่อนไข</span>{" "}
            พร้อมทั้ง{" "}
            <span className="font-bold underline">นโยบายความเป็นส่วนตัว</span>
            และยืนยันแล้วว่าคุณมีอายุ 10 ปีขึ้นไป
          </span>

          <Button fullWidth type="submit">
            ดำเนินการต่อ
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
