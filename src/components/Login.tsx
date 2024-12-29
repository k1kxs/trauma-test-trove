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
      className="max-w-md w-full mx-auto"
    >
      <Card className="mt-8 overflow-hidden backdrop-blur-sm bg-white/80 border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-xl">
        <CardHeader className="pb-4 pt-8">
          <CardTitle className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 animate-gradient bg-300% pb-2">
            Авторизация
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-gray-700 ml-1">
                ФИО
              </label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Введите ваше ФИО"
                required
                className="w-full bg-gray-50/50 border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all duration-200 rounded-lg placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="groupNumber" className="text-sm font-medium text-gray-700 ml-1">
                Номер группы
              </label>
              <Input
                id="groupNumber"
                type="text"
                value={groupNumber}
                onChange={(e) => setGroupNumber(e.target.value)}
                placeholder="Введите номер группы"
                required
                className="w-full bg-gray-50/50 border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all duration-200 rounded-lg placeholder:text-gray-400"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 hover:from-purple-700 hover:via-blue-600 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg border-none mt-4"
            >
              Войти
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Login;