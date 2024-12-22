import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface LoginProps {
  onLogin: (data: { fullName: string; groupNumber: string }) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [fullName, setFullName] = useState("");
  const [groupNumber, setGroupNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim() && groupNumber.trim()) {
      onLogin({ fullName, groupNumber });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Авторизация
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                ФИО
              </label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Введите ваше ФИО"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="groupNumber" className="text-sm font-medium">
                Номер группы
              </label>
              <Input
                id="groupNumber"
                type="text"
                value={groupNumber}
                onChange={(e) => setGroupNumber(e.target.value)}
                placeholder="Введите номер группы"
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Войти
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Login;