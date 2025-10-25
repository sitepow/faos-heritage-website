import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";

export default function Login() {
  return (
    <Card className="w-[450px] p-5">
      <CardHeader className="flex flex-col items-center w-full gap-1">
        <span className="font-bold text-lg">เข้าสู่ระบบ หรือ สมัครสมาชิก</span>
        <span className="text-default-500">
          เข้าสู่ DemoStore ด้วย Passport Local
        </span>
      </CardHeader>

      <CardBody className="gap-5">
        <Input label="อีเมล" />
        <Input label="รหัสผ่าน" type="password" />
      </CardBody>

      <CardFooter className="flex-col gap-2.5">
        <span className="text-default-500">
          หากคุณสมัครสมาชิก จะถือว่าคุณได้ยินยอม{" "}
          <span className="text-bold underline">ข้อกำหนดและเงื่อนไข</span>{" "}
          พร้อมทั้ง{" "}
          <span className="text-bold underline">นโยบายความเป็นส่วนตัว</span>
          และยืนยันแล้วว่าคุณมีอายุ 10 ปีขึ้นไป
        </span>

        <Button fullWidth>ดำเนินการต่อ</Button>
      </CardFooter>
    </Card>
  );
}
